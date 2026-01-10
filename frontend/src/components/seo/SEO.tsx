import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

/**
 * SEO Component for managing meta tags across the application
 * Implements Open Graph, Twitter Cards, and standard meta tags
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  author = 'FurnaceLog',
  publishedTime,
  modifiedTime,
  noindex = false,
  nofollow = false,
  canonical,
}) => {
  // Construct full title with site name
  const fullTitle = title
    ? `${title} | FurnaceLog`
    : 'FurnaceLog - Northern Home Maintenance Tracker';

  // Default description
  const defaultDescription =
    'Protect your northern home from -40°C disasters. Track heating systems, get weather alerts, and prevent $5,000+ emergency repairs. Free for Yukon, NWT & Nunavut homeowners.';

  const metaDescription = description || defaultDescription;

  // Default image for social sharing
  const defaultImage = 'https://furnacelog.com/og-image.jpg';
  const metaImage = image || defaultImage;

  // Canonical URL
  const canonicalUrl = canonical || url || 'https://furnacelog.com';

  // Robots meta
  const robotsContent = `${noindex ? 'noindex' : 'index'},${
    nofollow ? 'nofollow' : 'follow'
  }`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="FurnaceLog" />
      <meta property="og:locale" content="en_CA" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:creator" content="@furnacelog" />

      {/* Additional Meta Tags for Northern Canada Context */}
      <meta name="geo.region" content="CA-NT" />
      <meta name="geo.placename" content="Yellowknife" />
      <meta name="geo.position" content="62.454;-114.3718" />
      <meta name="ICBM" content="62.454, -114.3718" />
    </Helmet>
  );
};

export default SEO;
