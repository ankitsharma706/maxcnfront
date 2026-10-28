import React, { useEffect, useMemo } from 'react';
import { resolveMetadata, applyMetadataToDocument } from '../metadata/metadataEngine';
import { buildOrganizationSchema, buildWebSiteSchema, buildWebApplicationSchema, buildArticleSchema } from '../schema/schemaBuilder';
import { JsonLd } from '../schema/JsonLd';
import { injectResourceHints } from '../performance/resourceHints';
import { SITE_DOMAIN } from '../config/seoDefaults';

export interface SeoManagerProps {
  currentPath: string;
}

/**
 * Enterprise SEO Coordinator Component.
 * Mounts in top-level App shell to manage document meta tags, canonical links,
 * OpenGraph, Twitter cards, resource preconnections, and schema.org JSON-LD trees.
 */
export const SeoManager: React.FC<SeoManagerProps> = ({ currentPath }) => {
  const metadata = useMemo(() => resolveMetadata(currentPath), [currentPath]);

  // 1. Inject resource hints once on mount
  useEffect(() => {
    injectResourceHints();
  }, []);

  // 2. Synchronize meta, canonical, and social tags on route changes
  useEffect(() => {
    applyMetadataToDocument(metadata);
  }, [metadata]);

  // 3. Build global Structured Data
  const orgSchema = useMemo(() => buildOrganizationSchema(), []);
  const webSiteSchema = useMemo(() => buildWebSiteSchema(), []);
  const webAppSchema = useMemo(() => buildWebApplicationSchema(), []);

  // 4. Build Article Schema for Docs view
  const isDocs = currentPath.toLowerCase().includes('/docs') || currentPath === 'docs';
  const articleSchema = useMemo(() => {
    if (!isDocs) return null;
    return buildArticleSchema({
      headline: 'MCX Commodity Option Greeks & Black-76 Valuation Manual',
      description: 'Comprehensive quantitative reference guide on Fischer Black (1976) options pricing, lot sizes, and second-order Greeks sensitivities for MCX derivatives.',
      url: `${SITE_DOMAIN}/docs`,
      datePublished: '2026-01-15T00:00:00+05:30',
      dateModified: new Date().toISOString(),
      authorName: 'Commodity Greeks Pro Quant Research Team',
      publisherName: 'Commodity Greeks Pro Labs',
      publisherLogoUrl: `${SITE_DOMAIN}/favicon.png`,
      keywords: ['Black-76 Model', 'MCX Option Greeks', 'Delta', 'Gamma', 'Vega', 'Theta', 'Max Pain'],
      articleSection: 'Quantitative Finance & Derivatives Modeling'
    });
  }, [isDocs]);

  return (
    <>
      <JsonLd id="global-organization" schema={orgSchema} />
      <JsonLd id="global-website" schema={webSiteSchema} />
      <JsonLd id="global-webapp" schema={webAppSchema} />
      {articleSchema && <JsonLd id="docs-article" schema={articleSchema} />}
    </>
  );
};
