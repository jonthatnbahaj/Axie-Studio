import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useLocation } from 'react-router-dom';

interface SchemaMarkupProps {
  type: 'Organization' | 'LocalBusiness' | 'Service' | 'Product' | 'Article' | 'FAQ' | 'BreadcrumbList';
  data?: any;
}

const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data = {} }) => {
  const { currentLanguage } = useLanguage();
  const location = useLocation();
  
  const baseUrl = 'https://axiestudio.se';
  const currentUrl = `${baseUrl}${location.pathname}`;

  const generateSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type
    };

    switch (type) {
      case 'Organization':
        return {
          ...baseSchema,
          name: 'Axie Studio',
          url: baseUrl,
          logo: `${baseUrl}/Axiestudiologo.jpg`,
          image: `${baseUrl}/Axiestudiologo.jpg`,
          description: 'Professional digital solutions including web development, booking systems, and e-commerce in Sweden',
          foundingDate: '2024',
          founders: [
            {
              '@type': 'Person',
              name: 'Stefan Axelsson',
              jobTitle: 'CEO & Founder'
            }
          ],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jönköping',
            addressCountry: 'SE',
            addressRegion: 'Jönköping County'
          },
          contactPoint: [
            {
              '@type': 'ContactPoint',
              telephone: '+46735132620',
              contactType: 'customer service',
              areaServed: 'SE',
              availableLanguage: ['Swedish', 'English'],
              hoursAvailable: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '17:00'
              }
            }
          ],
          sameAs: [
            'https://www.facebook.com/profile.php?id=61573009403109',
            'https://www.instagram.com/axiestudi0/',
            'https://www.youtube.com/@AxieStudio_se'
          ],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Digital Services',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Web Development',
                  description: 'Professional websites with responsive design and SEO optimization'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Booking Systems',
                  description: 'Advanced booking systems with payment integration and automated reminders'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'E-commerce Solutions',
                  description: 'Complete webshops with product management and secure payments'
                }
              }
            ]
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            reviewCount: '500',
            bestRating: '5',
            worstRating: '1'
          }
        };

      case 'LocalBusiness':
        return {
          ...baseSchema,
          name: 'Axie Studio',
          image: `${baseUrl}/Axiestudiologo.jpg`,
          description: 'Professional web development and digital solutions in Jönköping, Sweden',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jönköping',
            addressCountry: 'SE'
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 57.7826,
            longitude: 14.1618
          },
          url: baseUrl,
          telephone: '+46735132620',
          email: 'stefan@axiestudio.se',
          openingHours: 'Mo-Fr 09:00-17:00',
          priceRange: '8995-14995 SEK',
          paymentAccepted: ['Cash', 'Credit Card', 'Bank Transfer', 'Swish'],
          currenciesAccepted: 'SEK',
          areaServed: {
            '@type': 'Country',
            name: 'Sweden'
          },
          serviceArea: {
            '@type': 'GeoCircle',
            geoMidpoint: {
              '@type': 'GeoCoordinates',
              latitude: 57.7826,
              longitude: 14.1618
            },
            geoRadius: '500000'
          }
        };

      case 'Service':
        return {
          ...baseSchema,
          name: data.name || 'Digital Solutions',
          description: data.description || 'Professional digital services',
          provider: {
            '@type': 'Organization',
            name: 'Axie Studio',
            url: baseUrl
          },
          areaServed: {
            '@type': 'Country',
            name: 'Sweden'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: data.name || 'Service Catalog',
            itemListElement: data.offers || []
          },
          category: data.category || 'Web Development',
          serviceType: data.serviceType || 'Digital Services'
        };

      case 'Product':
        return {
          ...baseSchema,
          name: data.name,
          description: data.description,
          image: data.image || `${baseUrl}/Axiestudiologo.jpg`,
          brand: {
            '@type': 'Brand',
            name: 'Axie Studio'
          },
          manufacturer: {
            '@type': 'Organization',
            name: 'Axie Studio'
          },
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: data.currency || 'SEK',
            availability: 'https://schema.org/InStock',
            seller: {
              '@type': 'Organization',
              name: 'Axie Studio'
            }
          }
        };

      case 'Article':
        return {
          ...baseSchema,
          headline: data.title,
          description: data.description,
          image: data.image || `${baseUrl}/Axiestudiologo.jpg`,
          author: {
            '@type': 'Person',
            name: data.author || 'Axie Studio Team'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Axie Studio',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/Axiestudiologo.jpg`
            }
          },
          datePublished: data.publishedDate,
          dateModified: data.modifiedDate || data.publishedDate,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': currentUrl
          }
        };

      case 'FAQ':
        return {
          ...baseSchema,
          mainEntity: data.questions?.map((faq: any) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          })) || []
        };

      case 'BreadcrumbList':
        return {
          ...baseSchema,
          itemListElement: data.breadcrumbs?.map((crumb: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.url
          })) || []
        };

      default:
        return baseSchema;
    }
  };

  const schema = generateSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  );
};

export default SchemaMarkup;