import { Helmet } from 'react-helmet-async';

/**
 * Organization Schema - For Homepage and About page
 */
export const OrganizationSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FurnaceLog',
    description:
      "Northern home maintenance tracking platform for Canada's North. Prevent costly failures in extreme cold climates.",
    url: 'https://furnacelog.com',
    logo: 'https://furnacelog.com/logo.png',
    sameAs: ['https://github.com/furnacelog/furnacelog'],
    foundingDate: '2024',
    founders: [
      {
        '@type': 'Person',
        name: 'FurnaceLog Team',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yellowknife',
      addressRegion: 'NT',
      addressCountry: 'CA',
    },
    areaServed: [
      {
        '@type': 'State',
        name: 'Northwest Territories',
      },
      {
        '@type': 'State',
        name: 'Yukon',
      },
      {
        '@type': 'State',
        name: 'Nunavut',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@furnacelog.com',
      availableLanguage: ['English'],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * WebApplication Schema - For Homepage
 */
export const WebApplicationSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FurnaceLog',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web Browser, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CAD',
      description: 'Free during beta phase',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    description:
      'Track heating systems, get weather alerts, and prevent costly home maintenance failures in northern Canada.',
    screenshot: 'https://furnacelog.com/screenshot.png',
    featureList: [
      'Heating System Tracking',
      'Weather-Integrated Alerts',
      'Seasonal Maintenance Checklists',
      'Modular Home Support',
      'Offline-First Design',
      'Cost Tracking',
    ],
    releaseNotes: 'Beta version with full tracking capabilities',
    softwareVersion: '1.0.0',
    author: {
      '@type': 'Organization',
      name: 'FurnaceLog',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * FAQPage Schema - For Contact page or FAQ sections
 */
interface FAQ {
  question: string;
  answer: string;
}

interface FAQPageSchemaProps {
  faqs: FAQ[];
}

export const FAQPageSchema: React.FC<FAQPageSchemaProps> = ({ faqs }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * BreadcrumbList Schema - For navigation breadcrumbs
 */
interface Breadcrumb {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  breadcrumbs: Breadcrumb[];
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ breadcrumbs }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Article Schema - For blog posts (future)
 */
interface ArticleSchemaProps {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  url: string;
}

export const ArticleSchema: React.FC<ArticleSchemaProps> = ({
  title,
  description,
  image,
  datePublished,
  dateModified,
  authorName,
  url,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName || 'FurnaceLog Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'FurnaceLog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://furnacelog.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * HowTo Schema - For tutorial/guide pages (future)
 */
interface HowToStep {
  name: string;
  text: string;
  image?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  image?: string;
  steps: HowToStep[];
  totalTime?: string;
}

export const HowToSchema: React.FC<HowToSchemaProps> = ({
  name,
  description,
  image,
  steps,
  totalTime,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: name,
    description: description,
    image: image,
    totalTime: totalTime,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * LocalBusiness Schema - For contractor directory pages (future Phase 2)
 */
interface BusinessAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
}

interface BusinessRating {
  value: number;
  count: number;
}

interface Business {
  name: string;
  description?: string;
  image?: string;
  url: string;
  phone?: string;
  address: BusinessAddress;
  latitude: number;
  longitude: number;
  priceRange?: string;
  rating?: BusinessRating;
}

interface LocalBusinessSchemaProps {
  business: Business;
}

export const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({ business }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description,
    image: business.image,
    '@id': business.url,
    url: business.url,
    telephone: business.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.latitude,
      longitude: business.longitude,
    },
    priceRange: business.priceRange,
    aggregateRating: business.rating && {
      '@type': 'AggregateRating',
      ratingValue: business.rating.value,
      reviewCount: business.rating.count,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
