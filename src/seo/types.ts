/**
 * Enterprise Technical SEO & Structured Data Types
 * Commodity Greeks Pro Quantitative Analytics Engine
 */

export type RobotsIndex = 'index' | 'noindex';
export type RobotsFollow = 'follow' | 'nofollow';
export type ImagePreviewDirective = 'large' | 'standard' | 'none';

export interface RobotsDirectives {
  index: RobotsIndex;
  follow: RobotsFollow;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  notranslate?: boolean;
  maxSnippet?: number; // -1 for unlimited
  maxImagePreview?: ImagePreviewDirective;
  maxVideoPreview?: number; // -1 for unlimited
}

export interface HreflangAlternate {
  lang: string;
  href: string;
}

export interface OpenGraphMeta {
  title: string;
  description: string;
  url: string;
  type: 'website' | 'article' | 'profile';
  siteName: string;
  locale: string;
  alternateLocales?: string[];
  imageUrl?: string;
  imageSecureUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageType?: string;
  imageAlt?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export interface TwitterCardMeta {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface RouteMetadataConfig {
  path: string;
  title: string;
  titleTemplate?: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  robots?: RobotsDirectives;
  openGraph?: Partial<OpenGraphMeta>;
  twitter?: Partial<TwitterCardMeta>;
  alternates?: HreflangAlternate[];
  isEditorial?: boolean;
  requiresAuth?: boolean;
  adSenseEligible?: boolean;
  priority?: number;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastmod?: string;
  breadcrumb?: {
    name: string;
    parentPath?: string;
  };
}

export interface BreadcrumbItem {
  name: string;
  item: string; // URL
  position: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ArticleSchemaData {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  authorName: string;
  authorUrl?: string;
  publisherName: string;
  publisherLogoUrl: string;
  imageUrl?: string;
  keywords?: string[];
  articleSection?: string;
  wordCount?: number;
  articleBody?: string;
}

export interface SoftwareAppSchemaData {
  name: string;
  operatingSystem: string;
  applicationCategory: string;
  description: string;
  url: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
  };
  featureList?: string[];
}

export interface OrganizationSchemaData {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
  contactPoint?: {
    contactType: string;
    email?: string;
    url?: string;
    availableLanguage: string[];
  };
}

export interface ResourceHint {
  rel: 'preconnect' | 'dns-prefetch' | 'preload' | 'prefetch';
  href: string;
  as?: 'font' | 'script' | 'style' | 'image' | 'fetch';
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

