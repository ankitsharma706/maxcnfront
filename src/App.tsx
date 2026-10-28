import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { useGreeksStore, applyTheme, NavigationTab } from './store/useGreeksStore';
import { useAutoPriceSync } from './hooks/useAutoPriceSync';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardView } from './app/dashboard/DashboardView';
import { CalculatorView } from './app/calculator/CalculatorView';
import { GreeksSimulatorView } from './app/calculator/GreeksSimulatorView';
import { AnalyticsView } from './app/analytics/AnalyticsView';
import { UploadsView } from './app/uploads/UploadsView';
import { HistoryView } from './app/history/HistoryView';
import { SettingsView } from './app/settings/SettingsView';
import { PrivacyPolicyView } from './app/legal/PrivacyPolicyView';
import { TermsOfServiceView } from './app/legal/TermsOfServiceView';
import { AboutView } from './app/about/AboutView';
import { ContactView } from './app/contact/ContactView';
import { DocsView } from './app/docs/DocsView';
import { SeoManager, SemanticBreadcrumbs, CrawlabilityGuard } from './seo';


export function getTabFromPath(pathname: string): NavigationTab {
  const clean = pathname.toLowerCase().replace(/\/$/, '') || '/';
  switch (clean) {
    case '/calculator':
      return 'calculator';
    case '/scenario':
      return 'scenario';
    case '/analytics':
      return 'analytics';
    case '/uploads':
      return 'uploads';
    case '/history':
      return 'history';
    case '/reports':
      return 'reports';
    case '/portfolio':
      return 'portfolio';
    case '/settings':
      return 'settings';
    case '/about':
      return 'about';
    case '/contact':
      return 'contact';
    case '/docs':
      return 'docs';
    case '/privacy-policy':
    case '/privacy':
      return 'privacy';
    case '/terms-of-service':
    case '/terms':
      return 'terms';
    default:
      return 'dashboard';
  }
}

export function getPathFromTab(tab: NavigationTab): string {
  switch (tab) {
    case 'calculator':
      return '/calculator';
    case 'scenario':
      return '/scenario';
    case 'analytics':
      return '/analytics';
    case 'uploads':
      return '/uploads';
    case 'history':
      return '/history';
    case 'reports':
      return '/reports';
    case 'portfolio':
      return '/portfolio';
    case 'settings':
      return '/settings';
    case 'about':
      return '/about';
    case 'contact':
      return '/contact';
    case 'docs':
      return '/docs';
    case 'privacy':
      return '/privacy-policy';
    case 'terms':
      return '/terms-of-service';
    default:
      return '/';
  }
}

export default function App() {
  const { activeTab, setActiveTab, isSimulatingTicks, tickPriceUpdate, settings } = useGreeksStore();

  // Initialize and synchronize underlying live commodity price
  useAutoPriceSync();

  // Bidirectional URL Routing synchronization (Deep linking & Crawler crawlability)
  useEffect(() => {
    // 1. Initial route check on mount
    const initialTab = getTabFromPath(window.location.pathname);
    if (initialTab !== activeTab) {
      setActiveTab(initialTab);
    }

    // 2. Browser Back/Forward navigation listener
    const handlePopState = () => {
      const targetTab = getTabFromPath(window.location.pathname);
      setActiveTab(targetTab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize browser history whenever activeTab changes
  useEffect(() => {
    const targetPath = getPathFromTab(activeTab);
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ tab: activeTab }, '', targetPath);
    }
  }, [activeTab]);


  // Sync theme to DOM on mount and when settings change
  useEffect(() => {
    applyTheme(settings.theme);

    if (settings.theme === 'system' && window.matchMedia) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme('system');
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [settings.theme]);

  // Subtle real-time price tick simulation for live MCX trading ambiance
  useEffect(() => {
    if (!isSimulatingTicks) return;
    const interval = setInterval(() => {
      tickPriceUpdate();
    }, 3800);
    return () => clearInterval(interval);
  }, [isSimulatingTicks, tickPriceUpdate]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'calculator':
        return <CalculatorView />;
      case 'scenario':
        return <GreeksSimulatorView />;
      case 'analytics':
      case 'portfolio':
        return <AnalyticsView />;
      case 'uploads':
        return <UploadsView />;
      case 'history':
      case 'reports':
        return <HistoryView />;
      case 'settings':
        return <SettingsView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'docs':
        return <DocsView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      case 'terms':
        return <TermsOfServiceView />;
      default:
        return <DashboardView />;
    }
  };

  const isWideLayout = activeTab === 'calculator' || activeTab === 'scenario' || activeTab === 'analytics';
  const currentPath = getPathFromTab(activeTab);

  return (
    <div className="min-h-screen bg-transparent text-[#1D2939] dark:text-[#F0F6F9] flex flex-col relative selection:bg-[#00778A]/20 selection:text-[#00778A] transition-colors duration-200">
      {/* Dynamic Canonical Metadata, OpenGraph, Twitter Cards, and JSON-LD Schemas */}
      <SeoManager currentPath={currentPath} />

      {/* Background ambient floating gradients */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full floating-gradient-1 pointer-events-none blur-[120px] -z-10 opacity-70" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full floating-gradient-2 pointer-events-none blur-[100px] -z-10 opacity-60" />

      {/* Top Navigation */}
      <Navbar />

      {/* Main Trading Platform Container */}
      <main className={`flex-1 w-full mx-auto px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 pb-20 sm:pb-24 ${
        isWideLayout ? 'max-w-[1920px]' : 'max-w-7xl'
      }`}>
        <div className="w-full min-w-0 space-y-4">
          {/* Accessible Semantic Breadcrumbs with Synchronized JSON-LD Microdata */}
          <SemanticBreadcrumbs
            currentPath={currentPath}
            onNavigate={(p) => setActiveTab(getTabFromPath(p))}
          />

          {/* Route-Level Crawlability & AdSense Guardrail */}
          <CrawlabilityGuard routePath={currentPath}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </CrawlabilityGuard>
        </div>
      </main>


      {/* Institutional Footer */}
      <Footer />

      {/* Vercel Speed Insights (Core Web Vitals) & Web Analytics (Visitors) */}
      <SpeedInsights />
      <Analytics />
    </div>
  );
}
