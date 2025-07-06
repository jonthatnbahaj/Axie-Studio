import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

interface AdvancedSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  price?: {
    amount: number;
    currency: string;
  };
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  rating?: {
    value: number;
    count: number;
  };
}

const AdvancedSEO: React.FC<AdvancedSEOProps> = ({
  title,
  description,
  keywords = [],
  image = '/Axiestudiologo.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Axie Studio',
  section,
  tags = [],
  price,
  availability,
  rating
}) => {
  const { currentLanguage, t } = useLanguage();
  const location = useLocation();
  
  const baseUrl = 'https://axiestudio.se';
  const currentUrl = `${baseUrl}${location.pathname}${location.search}`;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  const defaultTitle = t('hero.title') + ' - ' + t('hero.subtitle');
  const defaultDescription = t('hero.description');
  const defaultKeywords = [
    'webbyrå', 'webbdesign', 'bokningssystem', 'e-handel', 'mobilappar', 
    'webbutveckling', 'Jönköping', 'Sverige', 'webbplats', 'webshop', 
    'digital marknadsföring', 'SEO', 'responsiv design', 'CRM'
  ];
  
  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = [...defaultKeywords, ...keywords];
  
  // Generate structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'service' ? 'Service' : 'WebPage',
    name: finalTitle,
    description: finalDescription,
    url: currentUrl,
    image: imageUrl,
    inLanguage: currentLanguage.code,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Axie Studio',
      url: baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Axie Studio',
      logo: {
        '@type': 'ImageObject',
        url: imageUrl
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+46735132620',
        contactType: 'customer service',
        areaServed: 'SE',
        availableLanguage: ['Swedish', 'English']
      }
    }
  };
  
  // Add service-specific data
  if (type === 'service' && price) {
    structuredData['offers'] = {
      '@type': 'Offer',
      price: price.amount,
      priceCurrency: price.currency,
      availability: `https://schema.org/${availability || 'InStock'}`,
      validFrom: new Date().toISOString()
    };
  }
  
  // Add rating if provided
  if (rating) {
    structuredData['aggregateRating'] = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count,
      bestRating: 5,
      worstRating: 1
    };
  }
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords.join(', ')} />
      <meta name="author" content={author} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Language and Locale */}
      <html lang={currentLanguage.code} />
      <meta name="language" content={currentLanguage.code} />
      <meta name="geo.region" content="SE-F" />
      <meta name="geo.placename" content="Jönköping" />
      <meta name="geo.position" content="57.7826;14.1618" />
      <meta name="ICBM" content="57.7826, 14.1618" />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Axie Studio" />
      <meta property="og:locale" content={currentLanguage.code === 'sv' ? 'sv_SE' : 'en_US'} />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={finalTitle} />
      <meta name="twitter:site" content="@axiestudio" />
      <meta name="twitter:creator" content="@axiestudio" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      
      {/* Mobile and App */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Axie Studio" />
      <meta name="application-name" content="Axie Studio" />
      <meta name="msapplication-TileColor" content="#3b82f6" />
      <meta name="theme-color" content="#3b82f6" />
      
      {/* Performance and Caching */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      <meta httpEquiv="Expires" content={new Date(Date.now() + 31536000000).toUTCString()} />
      
      {/* Security */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://calendar.google.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {/* Alternate languages */}
      <link rel="alternate" hrefLang="sv" href={`${baseUrl}/sv${location.pathname.replace(/^\/(sv|en)/, '')}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${location.pathname.replace(/^\/(sv|en)/, '')}`} />
      <link rel="alternate" hrefLang="x-default" href={`${baseUrl}${location.pathname.replace(/^\/(sv|en)/, '')}`} />
    </Helmet>
  );
};

export default AdvancedSEO;