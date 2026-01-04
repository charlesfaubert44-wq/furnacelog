/**
 * Secure logging utility for FurnaceLog
 * - Removes console.log in production
 * - Sanitizes sensitive data
 * - Provides structured logging
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  /**
   * Sanitize sensitive data before logging
   */
  private sanitize(data: any): any {
    if (typeof data === 'string') {
      // Remove tokens, passwords, emails
      return data
        .replace(/token[\"']?\s*:\s*[\"']?[\w-]+[\"']?/gi, 'token: [REDACTED]')
        .replace(/password[\"']?\s*:\s*[\"']?[\w-]+[\"']?/gi, 'password: [REDACTED]')
        .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, '[EMAIL]');
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized = { ...data };
      const sensitiveKeys = ['password', 'token', 'accessToken', 'refreshToken', 'secret', 'apiKey'];

      for (const key of Object.keys(sanitized)) {
        if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
          sanitized[key] = '[REDACTED]';
        }
      }

      return sanitized;
    }

    return data;
  }

  /**
   * Format log entry
   */
  private formatLog(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: context ? this.sanitize(context) : undefined
    };
  }

  /**
   * Send logs to external service (production only)
   */
  private sendToService(entry: LogEntry): void {
    // In production, send to error tracking service
    // e.g., Sentry, LogRocket, Datadog
    if (!this.isDevelopment && entry.level === 'error') {
      // TODO: Integrate with error tracking service
      // Example: Sentry.captureMessage(entry.message, { level: entry.level, extra: entry.context });
    }
  }

  /**
   * Log methods
   */
  log(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      const entry = this.formatLog('log', message, context);
      console.log(`[${entry.timestamp}]`, entry.message, entry.context || '');
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      const entry = this.formatLog('info', message, context);
      console.info(`[${entry.timestamp}]`, entry.message, entry.context || '');
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    const entry = this.formatLog('warn', message, context);
    if (this.isDevelopment) {
      console.warn(`[${entry.timestamp}]`, entry.message, entry.context || '');
    }
    this.sendToService(entry);
  }

  error(message: string, error?: Error | any, context?: Record<string, any>): void {
    const entry = this.formatLog('error', message, {
      ...context,
      error: error?.message || error,
      stack: this.isDevelopment ? error?.stack : undefined
    });

    if (this.isDevelopment) {
      console.error(`[${entry.timestamp}]`, entry.message, entry.context || '');
    }

    this.sendToService(entry);
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.isDevelopment) {
      const entry = this.formatLog('debug', message, context);
      console.debug(`[${entry.timestamp}]`, entry.message, entry.context || '');
    }
  }
}

export const logger = new Logger();
export default logger;
