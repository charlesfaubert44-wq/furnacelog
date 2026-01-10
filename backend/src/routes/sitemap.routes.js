import express from 'express';

const router = express.Router();

/**
 * GET /sitemap.xml
 * Generate dynamic sitemap for search engines
 */
router.get('/sitemap.xml', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'https://furnacelog.com';

  // Define static pages with their priorities and change frequencies
  const pages = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    // Protected pages - lower priority, no index for auth pages
    { url: '/dashboard', changefreq: 'daily', priority: 0.5 },
    { url: '/wiki', changefreq: 'weekly', priority: 0.6 },
  ];

  // Get current date in ISO format for lastmod
  const currentDate = new Date().toISOString();

  // Generate XML sitemap
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  pages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  // Set appropriate headers for XML
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

/**
 * GET /robots.txt
 * Generate dynamic robots.txt file
 */
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'https://furnacelog.com';

  let robotsTxt = 'User-agent: *\n';
  robotsTxt += 'Allow: /\n';
  robotsTxt += 'Disallow: /api/\n';
  robotsTxt += 'Disallow: /dashboard\n';
  robotsTxt += 'Disallow: /settings\n';
  robotsTxt += 'Disallow: /onboarding\n';
  robotsTxt += 'Disallow: /timeline/\n';
  robotsTxt += 'Disallow: /login\n';
  robotsTxt += 'Disallow: /register\n';
  robotsTxt += 'Disallow: /auth/\n';
  robotsTxt += '\n';
  robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n`;

  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

export default router;
