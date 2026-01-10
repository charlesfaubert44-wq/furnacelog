/**
 * SSRF (Server-Side Request Forgery) Protection
 * SECURITY: Prevents unauthorized external requests and internal network access
 *
 * This module validates all outbound HTTP requests to prevent:
 * - Requests to internal/private IP addresses
 * - Requests to localhost or link-local addresses
 * - Requests to unauthorized domains
 * - DNS rebinding attacks
 * - Cloud metadata service access (AWS, Azure, GCP)
 */

import { URL } from 'url';
import dns from 'dns';
import { promisify } from 'util';
import logger from './logger.js';

const dnsLookup = promisify(dns.lookup);

/**
 * Allowlist of permitted external domains
 * SECURITY: Only these domains can be accessed via external HTTP requests
 * Update this list when integrating new external APIs
 */
const ALLOWED_DOMAINS = [
  'api.weather.gc.ca',           // Environment Canada Weather API
  'weather.gc.ca',               // Environment Canada
  'dd.weather.gc.ca',            // Environment Canada Data Mart
  // Add other trusted external APIs here
];

/**
 * Blocklist of dangerous hosts/patterns
 * SECURITY: These are commonly used for SSRF attacks
 */
const BLOCKED_HOSTS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254',  // AWS/Azure metadata service
  'metadata.google.internal',  // GCP metadata service
  '::1',  // IPv6 localhost
  'metadata',
  'instance-data'
];

/**
 * Private IP address ranges (CIDR notation)
 * These should never be accessible from application code
 */
const PRIVATE_IP_RANGES = [
  { start: '10.0.0.0', end: '10.255.255.255' },      // Class A private
  { start: '172.16.0.0', end: '172.31.255.255' },    // Class B private
  { start: '192.168.0.0', end: '192.168.255.255' },  // Class C private
  { start: '127.0.0.0', end: '127.255.255.255' },    // Loopback
  { start: '169.254.0.0', end: '169.254.255.255' },  // Link-local
  { start: '0.0.0.0', end: '0.255.255.255' }         // Current network
];

/**
 * Convert IP address string to integer for range checking
 */
function ipToInt(ip) {
  const parts = ip.split('.').map(part => parseInt(part, 10));
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

/**
 * Check if IP address is in a private range
 */
function isPrivateIP(ip) {
  // Check for IPv6 localhost
  if (ip === '::1' || ip.startsWith('fe80:')) {
    return true;
  }

  // IPv4 only for now
  if (!ip.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return false;
  }

  const ipInt = ipToInt(ip);

  return PRIVATE_IP_RANGES.some(range => {
    const startInt = ipToInt(range.start);
    const endInt = ipToInt(range.end);
    return ipInt >= startInt && ipInt <= endInt;
  });
}

/**
 * Validate URL is safe for external requests
 * @param {string} urlString - URL to validate
 * @returns {URL} Parsed and validated URL object
 * @throws {Error} If URL is unsafe
 */
export async function validateUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    throw new Error('SSRF_PROTECTION: URL must be a non-empty string');
  }

  // Parse URL
  let url;
  try {
    url = new URL(urlString);
  } catch (error) {
    throw new Error(`SSRF_PROTECTION: Invalid URL format: ${error.message}`);
  }

  // SECURITY: Only allow HTTPS (HTTP allowed only for development)
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error('SSRF_PROTECTION: Only HTTPS URLs are allowed in production');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`SSRF_PROTECTION: Unsupported protocol: ${url.protocol}`);
  }

  // Check hostname against blocklist
  const hostname = url.hostname.toLowerCase();
  if (BLOCKED_HOSTS.some(blocked => hostname.includes(blocked))) {
    logger.warn(`SSRF_PROTECTION: Blocked request to dangerous host: ${hostname}`);
    throw new Error('SSRF_PROTECTION: Request to blocked host is not allowed');
  }

  // Validate against domain allowlist
  const isAllowed = ALLOWED_DOMAINS.some(allowed => {
    return hostname === allowed || hostname.endsWith(`.${allowed}`);
  });

  if (!isAllowed) {
    logger.warn(`SSRF_PROTECTION: Request to non-allowlisted domain: ${hostname}`);
    throw new Error(
      `SSRF_PROTECTION: Domain "${hostname}" is not in the allowlist. ` +
      `Allowed domains: ${ALLOWED_DOMAINS.join(', ')}`
    );
  }

  // Perform DNS lookup to check for private IPs (prevent DNS rebinding)
  try {
    const { address, family } = await dnsLookup(hostname);

    if (family === 4 && isPrivateIP(address)) {
      logger.warn(`SSRF_PROTECTION: DNS resolved to private IP: ${hostname} -> ${address}`);
      throw new Error('SSRF_PROTECTION: Domain resolves to private IP address');
    }

    logger.info(`SSRF_PROTECTION: Validated URL: ${hostname} -> ${address}`);
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      throw new Error(`SSRF_PROTECTION: Domain not found: ${hostname}`);
    }
    // If it's already our SSRF error, re-throw
    if (error.message.startsWith('SSRF_PROTECTION:')) {
      throw error;
    }
    // DNS lookup failed for other reason
    logger.error(`SSRF_PROTECTION: DNS lookup failed for ${hostname}: ${error.message}`);
    throw new Error(`SSRF_PROTECTION: DNS lookup failed: ${error.message}`);
  }

  return url;
}

/**
 * Safe wrapper for axios requests with SSRF protection
 * Use this instead of axios directly for external API calls
 *
 * @param {object} axios - Axios instance
 * @param {string} url - URL to request
 * @param {object} options - Axios request options
 * @returns {Promise} Axios response
 */
export async function safeFetch(axios, url, options = {}) {
  // Validate URL before making request
  const validatedUrl = await validateUrl(url);

  // Add security headers
  const secureOptions = {
    ...options,
    timeout: options.timeout || 10000,  // 10 second timeout by default
    maxRedirects: options.maxRedirects || 3,  // Limit redirects
    validateStatus: options.validateStatus || ((status) => status < 500),
    headers: {
      ...options.headers,
      'User-Agent': 'FurnaceLog/1.0',
      // Prevent credential leakage
      'Referer': undefined,
      'Origin': undefined
    }
  };

  // Log the request for security monitoring
  logger.info(`SSRF_PROTECTION: Making external request to ${validatedUrl.hostname}`, {
    url: validatedUrl.href,
    method: options.method || 'GET',
    timestamp: new Date().toISOString()
  });

  try {
    const response = await axios(validatedUrl.href, secureOptions);
    return response;
  } catch (error) {
    logger.error(`SSRF_PROTECTION: External request failed: ${error.message}`, {
      url: validatedUrl.href,
      error: error.message
    });
    throw error;
  }
}

/**
 * Middleware to validate URLs in request parameters
 * Use this to validate user-provided URLs before processing
 *
 * @param {string} paramName - Name of the request parameter containing URL
 */
export function validateUrlParam(paramName) {
  return async (req, res, next) => {
    const url = req.body[paramName] || req.query[paramName] || req.params[paramName];

    if (!url) {
      return next();  // No URL provided, skip validation
    }

    try {
      await validateUrl(url);
      next();
    } catch (error) {
      logger.warn(`SSRF_PROTECTION: Invalid URL in request parameter "${paramName}"`, {
        url,
        userId: req.userId,
        ip: req.ip,
        path: req.path
      });

      return res.status(400).json({
        success: false,
        error: {
          type: 'VALIDATION_ERROR',
          message: 'Invalid or unsafe URL',
          details: [
            {
              field: paramName,
              message: error.message
            }
          ]
        }
      });
    }
  };
}

/**
 * Add a domain to the allowlist (for dynamic configuration)
 * SECURITY: Use with caution - only add trusted domains
 *
 * @param {string} domain - Domain to add to allowlist
 */
export function addAllowedDomain(domain) {
  if (!domain || typeof domain !== 'string') {
    throw new Error('Domain must be a non-empty string');
  }

  const normalized = domain.toLowerCase().trim();

  if (BLOCKED_HOSTS.some(blocked => normalized.includes(blocked))) {
    throw new Error(`Cannot add blocked domain: ${domain}`);
  }

  if (!ALLOWED_DOMAINS.includes(normalized)) {
    ALLOWED_DOMAINS.push(normalized);
    logger.info(`SSRF_PROTECTION: Added domain to allowlist: ${normalized}`);
  }
}

/**
 * Get current allowlist (for debugging/monitoring)
 */
export function getAllowedDomains() {
  return [...ALLOWED_DOMAINS];
}

export default {
  validateUrl,
  safeFetch,
  validateUrlParam,
  addAllowedDomain,
  getAllowedDomains
};
