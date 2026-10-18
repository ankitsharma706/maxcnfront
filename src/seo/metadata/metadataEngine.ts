import {
  RouteMetadataConfig,
  RobotsDirectives,
  OpenGraphMeta,
  TwitterCardMeta,
  HreflangAlternate
} from '../types';
import {
  SITE_DOMAIN,
  SITE_NAME,
  SITE_LOCALE,
  SITE_THEME_COLOR,
  DEFAULT_OG_IMAGE,
  ROUTE_REGISTRY
} from '../config/seoDefaults';

export interface ResolvedMetadata {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string[];
  robotsContent: string;
  openGraph: OpenGraphMeta;
  twitter: TwitterCardMeta;
  alternates: HreflangAlternate[];
  themeColor: string;
  isEditorial: boolean;
  adSenseEligible: boolean;
}

/**
 * Normalizes a URL to a strict canonical format:
 * - Ensures HTTPS
 * - Removes default ports
 * - Strips query tracking parameters (utm_*, gclid, fbclid, etc.)
 * - Strips trailing slashes (except root)
 * - Converts domain to lowercase
 */
export function buildCanonicalUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_DOMAIN;

  try {
    const isFullUrl = pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://');
    const parsed = new URL(isFullUrl ? pathOrUrl : `${SITE_DOMAIN}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`);

    // Force canonical domain
    parsed.protocol = 'https:';
    parsed.host = new URL(SITE_DOMAIN).host;

    // Filter tracking query params
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'ref'];
    for (const param of trackingParams) {
      parsed.searchParams.delete(param);
    }

    // Clean pathname
    let cleanPath = parsed.pathname;
    if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
    }
    parsed.pathname = cleanPath;

    // Build URL string without hash
    const search = parsed.searchParams.toString();
    return `${parsed.origin}${cleanPath}${search ? `?${search}` : ''}`;
  } catch {
    const clean = pathOrUrl.replace(/\/$/, '') || '/';
    return `${SITE_DOMAIN}${clean === '/' ? '' : clean}`;
  }
}

/**
 * Serializes robots directives into a Googlebot-compliant content string.
 */
export function serializeRobots(directives?: RobotsDirectives): string {
  if (!directives) {
    return 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
  }

  const parts: string[] = [directives.index, directives.follow];

  if (directives.index === 'noindex') {
    if (directives.noarchive) parts.push('noarchive');
    return parts.join(', ');
  }

  if (directives.noarchive) parts.push('noarchive');
  if (directives.nosnippet) parts.push('nosnippet');
  if (directives.noimageindex) parts.push('noimageindex');
  if (directives.notranslate) parts.push('notranslate');

  if (typeof directives.maxSnippet === 'number') {
    parts.push(`max-snippet:${directives.maxSnippet}`);
  } else {
    parts.push('max-snippet:-1');
  }

  if (directives.maxImagePreview) {
    parts.push(`max-image-preview:${directives.maxImagePreview}`);
  } else {
    parts.push('max-image-preview:large');
  }

  if (typeof directives.maxVideoPreview === 'number') {
    parts.push(`max-video-preview:${directives.maxVideoPreview}`);
  } else {
    parts.push('max-video-preview:-1');
  }

  return parts.join(', ');
}

/**
 * Resolves metadata for any given route, applying fallback cascades.
 */
export function resolveMetadata(
  routePath: string,
  overrides?: Partial<RouteMetadataConfig>
): ResolvedMetadata {
  const cleanPath = (routePath.toLowerCase().replace(/\/$/, '') || '/');
  const baseConfig: RouteMetadataConfig = ROUTE_REGISTRY[cleanPath] || ROUTE_REGISTRY['/'] || {
    path: cleanPath,
    title: SITE_NAME,
    description: 'Enterprise MCX Commodity Option Greeks Engine',
    priority: 0.5,
    changefreq: 'weekly',
    breadcrumb: { name: cleanPath }
  };

  const config: RouteMetadataConfig = {
    ...baseConfig,
    ...overrides,
    openGraph: {
      ...baseConfig.openGraph,
      ...overrides?.openGraph
    },
    twitter: {
      ...baseConfig.twitter,
      ...overrides?.twitter
    }
  };

  const canonicalUrl = buildCanonicalUrl(config.canonicalUrl || config.path);

  const title = config.titleTemplate
    ? config.titleTemplate.replace('%s', config.title)
    : config.title;

  const robotsContent = serializeRobots(config.robots);

  const openGraph: OpenGraphMeta = {
    title: config.openGraph?.title || title,
    description: config.openGraph?.description || config.description,
    url: canonicalUrl,
    type: config.openGraph?.type || 'website',
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    alternateLocales: ['en_IN'],
    imageUrl: config.openGraph?.imageUrl || DEFAULT_OG_IMAGE,
    imageAlt: config.openGraph?.imageAlt || `${title} - ${SITE_NAME}`,
    ...config.openGraph
  };

  const twitter: TwitterCardMeta = {
    card: config.twitter?.card || 'summary_large_image',
    site: '@commoditygreeks',
    creator: '@commoditygreeks',
    title: config.twitter?.title || title,
    description: config.twitter?.description || config.description,
    imageUrl: config.twitter?.imageUrl || openGraph.imageUrl,
    imageAlt: config.twitter?.imageAlt || openGraph.imageAlt,
    ...config.twitter
  };

  const alternates: HreflangAlternate[] = [
    { lang: 'en-IN', href: canonicalUrl },
    { lang: 'en-US', href: canonicalUrl },
    { lang: 'x-default', href: canonicalUrl }
  ];

  return {
    title,
    description: config.description,
    canonicalUrl,
    keywords: config.keywords || [],
    robotsContent,
    openGraph,
    twitter,
    alternates,
    themeColor: SITE_THEME_COLOR,
    isEditorial: Boolean(config.isEditorial),
    adSenseEligible: Boolean(config.adSenseEligible)
  };
}

/**
 * Updates DOM head elements dynamically in a single-page app environment.
 */
export function applyMetadataToDocument(metadata: ResolvedMetadata): void {
  if (typeof document === 'undefined') return;

  // 1. Document Title
  document.title = metadata.title;

  // Helper to ensure meta tag exists and has correct content
  const setMeta = (nameAttr: string, key: string, content: string) => {
    let el = document.querySelector(`meta[${nameAttr}="${key}"]`) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(nameAttr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Standard Meta Tags
  setMeta('name', 'description', metadata.description);
  setMeta('name', 'robots', metadata.robotsContent);
  setMeta('name', 'theme-color', metadata.themeColor);
  if (metadata.keywords.length > 0) {
    setMeta('name', 'keywords', metadata.keywords.join(', '));
  }

  // 3. OpenGraph Tags
  setMeta('property', 'og:title', metadata.openGraph.title);
  setMeta('property', 'og:description', metadata.openGraph.description);
  setMeta('property', 'og:url', metadata.openGraph.url);
  setMeta('property', 'og:type', metadata.openGraph.type);
  setMeta('property', 'og:site_name', metadata.openGraph.siteName);
  setMeta('property', 'og:locale', metadata.openGraph.locale);
  if (metadata.openGraph.imageUrl) {
    setMeta('property', 'og:image', metadata.openGraph.imageUrl);
  }

  // 4. Twitter Card Tags
  setMeta('name', 'twitter:card', metadata.twitter.card);
  setMeta('name', 'twitter:title', metadata.twitter.title);
  setMeta('name', 'twitter:description', metadata.twitter.description);
  if (metadata.twitter.site) setMeta('name', 'twitter:site', metadata.twitter.site);
  if (metadata.twitter.creator) setMeta('name', 'twitter:creator', metadata.twitter.creator);
  if (metadata.twitter.imageUrl) setMeta('name', 'twitter:image', metadata.twitter.imageUrl);

  // 5. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', metadata.canonicalUrl);

  // 6. Hreflang alternates
  // Remove existing alternates to avoid duplicate tags on route change
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  for (const alt of metadata.alternates) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', alt.lang);
    link.setAttribute('href', alt.href);
    document.head.appendChild(link);
  }
}

/**
 * Generates string of HTML head tags for SSR or pre-rendered static shells.
 */
export function renderMetadataToHtml(metadata: ResolvedMetadata): string {
  const lines: string[] = [
    `<title>${escapeHtml(metadata.title)}</title>`,
    `<meta name="description" content="${escapeHtml(metadata.description)}">`,
    `<meta name="robots" content="${escapeHtml(metadata.robotsContent)}">`,
    `<meta name="theme-color" content="${escapeHtml(metadata.themeColor)}">`,
    `<link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}">`
  ];

  if (metadata.keywords.length > 0) {
    lines.push(`<meta name="keywords" content="${escapeHtml(metadata.keywords.join(', '))}">`);
  }

  for (const alt of metadata.alternates) {
    lines.push(`<link rel="alternate" hreflang="${escapeHtml(alt.lang)}" href="${escapeHtml(alt.href)}">`);
  }

  // OpenGraph
  lines.push(`<meta property="og:title" content="${escapeHtml(metadata.openGraph.title)}">`);
  lines.push(`<meta property="og:description" content="${escapeHtml(metadata.openGraph.description)}">`);
  lines.push(`<meta property="og:url" content="${escapeHtml(metadata.openGraph.url)}">`);
  lines.push(`<meta property="og:type" content="${escapeHtml(metadata.openGraph.type)}">`);
  lines.push(`<meta property="og:site_name" content="${escapeHtml(metadata.openGraph.siteName)}">`);
  lines.push(`<meta property="og:locale" content="${escapeHtml(metadata.openGraph.locale)}">`);
  if (metadata.openGraph.imageUrl) {
    lines.push(`<meta property="og:image" content="${escapeHtml(metadata.openGraph.imageUrl)}">`);
  }

  // Twitter
  lines.push(`<meta name="twitter:card" content="${escapeHtml(metadata.twitter.card)}">`);
  lines.push(`<meta name="twitter:title" content="${escapeHtml(metadata.twitter.title)}">`);
  lines.push(`<meta name="twitter:description" content="${escapeHtml(metadata.twitter.description)}">`);
  if (metadata.twitter.imageUrl) {
    lines.push(`<meta name="twitter:image" content="${escapeHtml(metadata.twitter.imageUrl)}">`);
  }

  return lines.join('\n');
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
