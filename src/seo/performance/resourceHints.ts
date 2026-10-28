import { ResourceHint } from '../types';

export const DEFAULT_RESOURCE_HINTS: ResourceHint[] = [
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com'
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous'
  },
  {
    rel: 'dns-prefetch',
    href: 'https://pagead2.googlesyndication.com'
  },
  {
    rel: 'dns-prefetch',
    href: 'https://accounts.google.com'
  }
];

/**
 * Injects resource hints into <head> idempotently.
 */
export function injectResourceHints(hints: ResourceHint[] = DEFAULT_RESOURCE_HINTS): void {
  if (typeof document === 'undefined') return;

  for (const hint of hints) {
    const selector = `link[rel="${hint.rel}"][href="${hint.href}"]`;
    if (document.querySelector(selector)) {
      continue;
    }

    const link = document.createElement('link');
    link.rel = hint.rel;
    link.href = hint.href;
    if (hint.as) link.as = hint.as;
    if (hint.type) link.type = hint.type;
    if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;

    document.head.appendChild(link);
  }
}

/**
 * Helper to preload critical web fonts to prevent FOIT/FOUT and improve LCP.
 */
export function preloadFont(fontUrl: string, type = 'font/woff2'): void {
  if (typeof document === 'undefined') return;

  const selector = `link[rel="preload"][href="${fontUrl}"]`;
  if (document.querySelector(selector)) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = fontUrl;
  link.as = 'font';
  link.type = type;
  link.crossOrigin = 'anonymous';

  document.head.appendChild(link);
}
