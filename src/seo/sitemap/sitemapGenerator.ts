import { SitemapEntry } from '../types';
import { SITE_DOMAIN, ROUTE_REGISTRY } from '../config/seoDefaults';

export interface DynamicContentProvider {
  getDynamicRoutes(): Promise<SitemapEntry[]> | SitemapEntry[];
}

export const COMMODITY_SLUGS = [
  { slug: 'gold-mini', name: 'Gold Mini (GOLDM)', priority: 0.9 },
  { slug: 'silver-mini', name: 'Silver Mini (SILVERM)', priority: 0.9 },
  { slug: 'crude-oil', name: 'Crude Oil (CRUDEOIL)', priority: 0.9 },
  { slug: 'natural-gas', name: 'Natural Gas (NATGAS)', priority: 0.9 },
  { slug: 'copper', name: 'Copper (COPPER)', priority: 0.8 },
  { slug: 'zinc', name: 'Zinc (ZINC)', priority: 0.7 },
  { slug: 'aluminium', name: 'Aluminium (ALUMINIUM)', priority: 0.7 },
  { slug: 'lead', name: 'Lead (LEAD)', priority: 0.7 },
  { slug: 'nickel', name: 'Nickel (NICKEL)', priority: 0.7 }
];

export const DOCS_SECTIONS = [
  { section: 'black-76-model', priority: 0.85 },
  { section: 'option-greeks-matrix', priority: 0.85 },
  { section: 'max-pain-iv-smile', priority: 0.85 },
  { section: 'mcx-contract-specs', priority: 0.85 },
  { section: 'broker-ocr-integration', priority: 0.8 }
];

/**
 * Escapes characters for strict XML compliance.
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Collects all indexable routes from the central route registry.
 */
export function getStandardSitemapEntries(currentDateStr = new Date().toISOString().split('T')[0]): SitemapEntry[] {
  const entries: SitemapEntry[] = [];

  for (const [, config] of Object.entries(ROUTE_REGISTRY)) {
    // Exclude noindex / private utility routes from sitemap
    if (config.robots?.index === 'noindex' || config.requiresAuth) {
      continue;
    }

    const loc = config.path === '/' ? `${SITE_DOMAIN}/` : `${SITE_DOMAIN}${config.path}`;
    entries.push({
      loc,
      lastmod: config.lastmod || currentDateStr,
      changefreq: config.changefreq || 'weekly',
      priority: config.priority !== undefined ? config.priority : 0.7
    });
  }

  // Include dynamic commodity calculator deep-links
  for (const item of COMMODITY_SLUGS) {
    entries.push({
      loc: `${SITE_DOMAIN}/calculator?commodity=${item.slug}`,
      lastmod: currentDateStr,
      changefreq: 'daily',
      priority: item.priority
    });
  }

  // Include documentation section anchors
  for (const doc of DOCS_SECTIONS) {
    entries.push({
      loc: `${SITE_DOMAIN}/docs#${doc.section}`,
      lastmod: currentDateStr,
      changefreq: 'weekly',
      priority: doc.priority
    });
  }

  return entries;
}

/**
 * Generates an XML string adhering to sitemaps.org 0.9 schema.
 */
export async function generateSitemapXml(customProvider?: DynamicContentProvider): Promise<string> {
  const standardEntries = getStandardSitemapEntries();
  const dynamicEntries = customProvider ? await customProvider.getDynamicRoutes() : [];

  // Deduplicate by loc
  const map = new Map<string, SitemapEntry>();
  for (const entry of [...standardEntries, ...dynamicEntries]) {
    map.set(entry.loc, entry);
  }

  const allEntries = Array.from(map.values());

  const xmlLines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  ];

  for (const entry of allEntries) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${escapeXml(entry.loc)}</loc>`);
    if (entry.lastmod) {
      xmlLines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
    }
    if (entry.changefreq) {
      xmlLines.push(`    <changefreq>${escapeXml(entry.changefreq)}</changefreq>`);
    }
    if (typeof entry.priority === 'number') {
      xmlLines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
    }
    // Automated self-referencing hreflangs
    xmlLines.push(`    <xhtml:link rel="alternate" hreflang="en-IN" href="${escapeXml(entry.loc)}" />`);
    xmlLines.push(`    <xhtml:link rel="alternate" hreflang="en-US" href="${escapeXml(entry.loc)}" />`);
    xmlLines.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.loc)}" />`);
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');
  return xmlLines.join('\n');
}

/**
 * Generates high-standard robots.txt with crawl-rate and user-agent isolation.
 */
export function generateRobotsTxt(): string {
  return [
    '# =========================================================================',
    '# Commodity Greeks Pro - Enterprise Crawler & Robots Directives',
    '# Canonical Domain: https://maxcnfront.vercel.app',
    '# =========================================================================',
    '',
    '# Google AdSense Crawler - Must have full unhindered access to content for inventory verification',
    'User-agent: Mediapartners-Google',
    'Allow: /',
    '',
    '# Google Search Inspection & Mobile/Desktop Indexing Bots',
    'User-agent: Googlebot',
    'User-agent: Googlebot-Mobile',
    'User-agent: Google-InspectionTool',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /auth',
    'Disallow: /settings',
    'Disallow: /*?*token=*',
    'Disallow: /*?*session=*',
    '',
    '# Bingbot & Standard Crawlers',
    'User-agent: Bingbot',
    'User-agent: DuckDuckBot',
    'User-agent: Slurp',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /auth',
    'Disallow: /settings',
    '',
    '# Default crawler rules',
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /auth',
    'Disallow: /settings',
    'Disallow: /*?*token=*',
    '',
    '# Host & Sitemap specification',
    `Host: ${new URL(SITE_DOMAIN).host}`,
    `Sitemap: ${SITE_DOMAIN}/sitemap.xml`,
    ''
  ].join('\n');
}
