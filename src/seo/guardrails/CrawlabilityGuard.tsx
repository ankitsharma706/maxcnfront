import React, { useEffect } from 'react';
import { ROUTE_REGISTRY } from '../config/seoDefaults';
import { isAdSenseEligibleRoute } from '../../utils/adSenseManager';

export interface CrawlabilityGuardProps {
  routePath: string;
  isEmpty?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  children: React.ReactNode;
}

/**
 * Route-Level Crawlability & AdSense Compliance Guardrail.
 * 
 * Enforces Google Webmaster Guidelines & AdSense "Valuable Inventory: No Content" policy:
 * 1. Restricts indexing on private/utility/empty screens via dynamic `noindex, nofollow`.
 * 2. Strictly prohibits Google AdSense scripts and ad units from executing on non-editorial views.
 * 3. Restores standard indexing tags and allows compliant ad rendering on approved rich content routes.
 */
export const CrawlabilityGuard: React.FC<CrawlabilityGuardProps> = ({
  routePath,
  isEmpty = false,
  isError = false,
  isPrivate = false,
  children
}) => {
  const cleanPath = routePath.toLowerCase().replace(/\/$/, '') || '/';
  const routeConfig = ROUTE_REGISTRY[cleanPath];

  // Determine if this screen must be shielded from indexing and advertising
  const isRestrictedByConfig =
    routeConfig?.robots?.index === 'noindex' ||
    Boolean(routeConfig?.requiresAuth) ||
    routeConfig?.isEditorial === false;

  const shouldBlock = isEmpty || isError || isPrivate || isRestrictedByConfig;
  const isEligibleForAds = !shouldBlock && isAdSenseEligibleRoute(cleanPath);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }

    if (shouldBlock) {
      // 1. Enforce strict noindex on non-content / private views
      robotsMeta.content = 'noindex, nofollow, noarchive';

      // 2. Remove any auto-ads iframe or injected ad script
      const injectedAdScripts = document.querySelectorAll('script[src*="pagead2.googlesyndication.com"]');
      injectedAdScripts.forEach((script) => script.remove());

      const autoAdContainers = document.querySelectorAll('ins.adsbygoogle, .google-auto-placed');
      autoAdContainers.forEach((el) => el.remove());
    } else {
      // Restore standard crawlability for approved editorial pages
      robotsMeta.content = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
    }
  }, [cleanPath, shouldBlock]);

  return (
    <div
      data-seo-crawlable={!shouldBlock ? 'true' : 'false'}
      data-adsense-eligible={isEligibleForAds ? 'true' : 'false'}
      className="w-full"
    >
      {children}
    </div>
  );
};
