import {
  OrganizationSchemaData,
  SoftwareAppSchemaData,
  BreadcrumbItem,
  ArticleSchemaData,
  FAQItem
} from '../types';
import {
  SITE_DOMAIN,
  SITE_NAME,
  ORGANIZATION_CONFIG,
  SOFTWARE_APP_CONFIG
} from '../config/seoDefaults';

export interface BaseSchema {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: any;
}

/**
 * Builds schema.org Organization definition.
 */
export function buildOrganizationSchema(data: OrganizationSchemaData = ORGANIZATION_CONFIG): BaseSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${data.url}/#organization`,
    name: data.name,
    url: data.url,
    logo: {
      '@type': 'ImageObject',
      url: data.logo,
      caption: `${data.name} Logo`
    },
    description: data.description,
    sameAs: data.sameAs,
    contactPoint: data.contactPoint
      ? {
          '@type': 'ContactPoint',
          contactType: data.contactPoint.contactType,
          email: data.contactPoint.email,
          url: data.contactPoint.url,
          availableLanguage: data.contactPoint.availableLanguage
        }
      : undefined
  };
}

/**
 * Builds schema.org WebSite definition with SearchAction.
 */
export function buildWebSiteSchema(): BaseSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_DOMAIN}/#website`,
    url: SITE_DOMAIN,
    name: SITE_NAME,
    description: 'Enterprise MCX Commodity Option Greeks Engine and Quantitative Analytics',
    publisher: {
      '@id': `${SITE_DOMAIN}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_DOMAIN}/calculator?symbol={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-US'
  };
}

/**
 * Builds schema.org WebApplication definition.
 */
export function buildWebApplicationSchema(data: SoftwareAppSchemaData = SOFTWARE_APP_CONFIG): BaseSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${data.url}/#webapp`,
    name: data.name,
    url: data.url,
    operatingSystem: data.operatingSystem,
    applicationCategory: data.applicationCategory,
    description: data.description,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: data.offers
      ? {
          '@type': 'Offer',
          price: data.offers.price,
          priceCurrency: data.offers.priceCurrency
        }
      : undefined,
    aggregateRating: data.aggregateRating
      ? {
          '@type': 'AggregateRating',
          ratingValue: data.aggregateRating.ratingValue,
          ratingCount: data.aggregateRating.ratingCount
        }
      : undefined,
    featureList: data.featureList
  };
}

/**
 * Builds schema.org BreadcrumbList definition.
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): BaseSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item
    }))
  };
}

/**
 * Builds schema.org TechArticle or Article definition.
 */
export function buildArticleSchema(data: ArticleSchemaData): BaseSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${data.url}/#article`,
    headline: data.headline,
    description: data.description,
    url: data.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url
    },
    datePublished: data.datePublished,
    dateModified: data.dateModified,
    author: {
      '@type': 'Organization',
      name: data.authorName,
      url: data.authorUrl || SITE_DOMAIN
    },
    publisher: {
      '@type': 'Organization',
      name: data.publisherName,
      logo: {
        '@type': 'ImageObject',
        url: data.publisherLogoUrl
      }
    },
    image: data.imageUrl
      ? {
          '@type': 'ImageObject',
          url: data.imageUrl
        }
      : undefined,
    keywords: data.keywords?.join(', '),
    articleSection: data.articleSection || 'Quantitative Finance',
    wordCount: data.wordCount,
    articleBody: data.articleBody
  };
}

/**
 * Builds schema.org FAQPage definition with dynamic QA pairs.
 */
export function buildFAQSchema(faqs: FAQItem[]): BaseSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}
