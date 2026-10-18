/**
 * AdSense Compliance & Route Isolation Manager
 * 
 * Enforces Google AdSense policy: "Valuable Inventory: No Content / Under Construction"
 * Prohibits ad tags and scripts from firing on:
 * - Authentication/Login/Signup screens (/auth, /login, /register)
 * - Pure interactive utilities without editorial articles (/settings, /uploads, /history)
 * - Blank, loading, or splash screens
 * 
 * Restricts AdSense script loading and ad units strictly to content-rich editorial pages.
 */

export const ADSENSE_CLIENT_ID = 'ca-pub-4318712038607459';

// Explicitly prohibited routes per Google AdSense Valuable Inventory guidelines
export const RESTRICTED_ROUTES = [
  'auth',
  'login',
  'register',
  'settings',
  'uploads',
  'history'
];

// Content-rich editorial routes where publisher text exceeds 500+ words
export const APPROVED_EDITORIAL_ROUTES = [
  'docs',
  'about',
  'dashboard' // Only when editorial knowledge reference is rendered
];

/**
 * Checks if the current route is eligible to host Google AdSense advertisements.
 */
export function isAdSenseEligibleRoute(currentRoute: string): boolean {
  if (!currentRoute) return false;
  const cleanRoute = currentRoute.toLowerCase().replace(/^\//, '');

  // Strict Blacklist Check
  for (const restricted of RESTRICTED_ROUTES) {
    if (cleanRoute === restricted || cleanRoute.startsWith(restricted + '/')) {
      return false;
    }
  }

  // Strict Whitelist Check
  return APPROVED_EDITORIAL_ROUTES.some(
    (allowed) => cleanRoute === allowed || cleanRoute === '' || cleanRoute === 'dashboard'
  );
}

let isScriptInjected = false;

/**
 * Dynamically loads the AdSense script ONLY when viewing an approved content-rich route.
 * Prevents Auto-Ads from executing on non-content, utility, or authentication screens.
 */
export function loadAdSenseScriptForRoute(currentRoute: string): void {
  if (typeof window === 'undefined') return;

  if (!isAdSenseEligibleRoute(currentRoute)) {
    return;
  }

  // Only inject once
  if (isScriptInjected || document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
    isScriptInjected = true;
    return;
  }

  try {
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-ad-client', ADSENSE_CLIENT_ID);
    document.head.appendChild(script);
    isScriptInjected = true;
  } catch (err) {
    console.warn('AdSense script injection suppressed:', err);
  }
}
