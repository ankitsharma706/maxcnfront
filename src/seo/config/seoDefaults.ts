import { RouteMetadataConfig, OrganizationSchemaData, SoftwareAppSchemaData } from '../types';

export const SITE_DOMAIN = 'https://maxcnfront.vercel.app';
export const SITE_NAME = 'Commodity Greeks Pro';
export const SITE_LOCALE = 'en_US';
export const SITE_THEME_COLOR = '#00778A';
export const DEFAULT_OG_IMAGE = `${SITE_DOMAIN}/favicon.png`;

export const ORGANIZATION_CONFIG: OrganizationSchemaData = {
  name: 'Commodity Greeks Pro Quant Labs',
  url: SITE_DOMAIN,
  logo: `${SITE_DOMAIN}/favicon.png`,
  description: 'Enterprise MCX Commodity Option Greeks Engine, quantitative Black-76 modeling, real-time risk scenario simulation, and broker OCR analytics.',
  sameAs: [
    'https://twitter.com/commoditygreeks',
    'https://github.com/commodity-greeks-pro',
    'https://www.linkedin.com/company/commodity-greeks-pro'
  ],
  contactPoint: {
    contactType: 'Quant Trading Desk & Support',
    email: 'support@commoditygreeks.pro',
    url: `${SITE_DOMAIN}/contact`,
    availableLanguage: ['English', 'Hindi']
  }
};

export const SOFTWARE_APP_CONFIG: SoftwareAppSchemaData = {
  name: 'Commodity Greeks Pro Terminal',
  operatingSystem: 'Cross-Platform Web, iOS, Android, Linux, macOS, Windows',
  applicationCategory: 'FinanceApplication',
  description: 'High-precision 64-bit Black-76 quantitative terminal for MCX Commodity Options with real-time Greeks, volatility surface simulation, and smart OCR ingestion.',
  url: SITE_DOMAIN,
  offers: {
    price: '0.00',
    priceCurrency: 'INR'
  },
  aggregateRating: {
    ratingValue: '4.9',
    ratingCount: '1240'
  },
  featureList: [
    'Black-76 Commodity Derivatives Pricing Model',
    'First & Second-Order Greeks: Delta, Gamma, Vega, Theta, Rho, Vanna, Volga',
    'Broker Option Chain OCR & Ingestion (Groww, Zerodha, Upstox, Angel One)',
    'Interactive Greeks Stress & Multi-Scenario Simulator',
    'Max Pain Strike & Implied Volatility (IV) Smile Modeling',
    'Enterprise Archival Calculation History & Export'
  ]
};

export const ROUTE_REGISTRY: Record<string, RouteMetadataConfig> = {
  '/': {
    path: '/',
    title: 'Commodity Greeks Pro - Enterprise MCX Greeks Engine & Quantitative Options Analytics',
    description: 'Enterprise-grade Commodity Option Greeks Calculation Engine for MCX Commodities (Gold, Silver, Crude Oil, Natural Gas, Copper, Zinc) using Black-76 model, real-time risk scenarios, and MongoDB persistence.',
    keywords: [
      'Commodity Greeks', 'MCX Options', 'Black-76', 'Black-Scholes', 'Option Greeks', 
      'Gold Mini Greeks', 'Crude Oil Options', 'Natural Gas IV', 'Delta Gamma Theta Vega',
      'Quantitative Trading India', 'Options Trading Terminal'
    ],
    priority: 1.0,
    changefreq: 'daily',
    isEditorial: true,
    adSenseEligible: true,
    breadcrumb: { name: 'Home' },
    openGraph: {
      type: 'website',
      title: 'Commodity Greeks Pro — Real-Time MCX Option Greeks Engine',
      description: 'Institutional-grade Black-76 valuation, automated broker chain OCR, and scenario risk simulation for Indian MCX commodity options.'
    }
  },
  '/calculator': {
    path: '/calculator',
    title: 'Greeks Workspace & Options Calculator | Commodity Greeks Pro',
    description: 'Calculate real-time Black-76 and Black-Scholes Delta, Gamma, Theta, Vega, and Rho for Gold, Silver, Crude Oil, and Natural Gas options on MCX India.',
    keywords: ['MCX Options Calculator', 'Black-76 Calculator', 'Commodity Delta Calculator', 'Option Greeks Engine'],
    priority: 0.9,
    changefreq: 'weekly',
    isEditorial: true,
    adSenseEligible: false, // Interactive calculator workspace without full article body
    breadcrumb: { name: 'Greeks Workspace', parentPath: '/' },
    openGraph: {
      type: 'website',
      title: 'Real-Time MCX Greeks Workspace & Options Pricing Engine',
      description: 'Run precision 64-bit numerical evaluations of commodity option sensitivities.'
    }
  },
  '/scenario': {
    path: '/scenario',
    title: 'Greeks Stress Simulator & Multi-Scenario Matrix | Commodity Greeks Pro',
    description: 'Simulate portfolio stress, volatility shocks, and price deviations across MCX options positions with real-time dynamic P&L curves and risk matrices.',
    keywords: ['Options Stress Simulator', 'Volatility Shock Test', 'MCX Scenario Analysis', 'Greeks Matrix'],
    priority: 0.8,
    changefreq: 'weekly',
    isEditorial: false,
    adSenseEligible: false,
    breadcrumb: { name: 'Stress Simulator', parentPath: '/' }
  },
  '/analytics': {
    path: '/analytics',
    title: 'Option Volatility Surface & Market Analytics | Commodity Greeks Pro',
    description: 'Deep dive into Implied Volatility (IV) smile dynamics, Put-Call Ratio (PCR), Max Pain strikes, and historical volatility trends for MCX commodities.',
    keywords: ['Volatility Surface', 'MCX Max Pain', 'PCR Ratio', 'Implied Volatility Smile', 'Options Analytics'],
    priority: 0.8,
    changefreq: 'daily',
    isEditorial: true,
    adSenseEligible: false,
    breadcrumb: { name: 'Market Analytics', parentPath: '/' }
  },
  '/docs': {
    path: '/docs',
    title: 'Terminal Documentation & Quantitative Guide | Commodity Greeks Pro',
    description: 'Complete mathematical formulations of the Black-76 model, lot size specifications for MCX derivatives, second-order Greeks formulas, and broker OCR schemas.',
    keywords: [
      'Black-76 Mathematical Formula', 'Commodity Options Guide', 'MCX Contract Specifications',
      'Option Greeks Formulas', 'Quant Trading Documentation', 'Second-Order Greeks'
    ],
    priority: 0.9,
    changefreq: 'weekly',
    isEditorial: true,
    adSenseEligible: true, // Rich long-form educational editorial
    breadcrumb: { name: 'Documentation', parentPath: '/' },
    openGraph: {
      type: 'article',
      title: 'MCX Commodity Option Greeks & Black-76 Mathematical Guide',
      description: 'Authoritative quantitative manual for pricing futures-settled commodity options on India Multi Commodity Exchange.'
    }
  },
  '/about': {
    path: '/about',
    title: 'About Us & Quant Platform Architecture | Commodity Greeks Pro',
    description: 'Learn about our algorithmic foundation, mission to empower Indian derivatives traders with institutional-grade quantitative risk modeling, and platform technology.',
    keywords: ['About Commodity Greeks Pro', 'Algorithmic Trading Platform', 'Quant Desk India', 'MCX Analytics Team'],
    priority: 0.8,
    changefreq: 'monthly',
    isEditorial: true,
    adSenseEligible: true,
    breadcrumb: { name: 'About Us', parentPath: '/' }
  },
  '/contact': {
    path: '/contact',
    title: 'Contact Us & Quant Desk Support | Commodity Greeks Pro',
    description: 'Get in touch with our institutional engineering team, submit platform feedback, or request custom quantitative API integration for your brokerage desk.',
    keywords: ['Contact Quant Desk', 'API Support', 'Institutional Greeks Feed', 'Commodity Trading Inquiries'],
    priority: 0.8,
    changefreq: 'monthly',
    isEditorial: true,
    adSenseEligible: true,
    breadcrumb: { name: 'Contact Us', parentPath: '/' }
  },
  '/privacy-policy': {
    path: '/privacy-policy',
    title: 'Privacy Policy | Commodity Greeks Pro',
    description: 'Understand how Commodity Greeks Pro protects your data, handles browser session privacy, and complies with financial data security regulations.',
    priority: 0.7,
    changefreq: 'monthly',
    isEditorial: true,
    adSenseEligible: true,
    breadcrumb: { name: 'Privacy Policy', parentPath: '/' }
  },
  '/terms-of-service': {
    path: '/terms-of-service',
    title: 'Terms of Service | Commodity Greeks Pro',
    description: 'Terms and conditions governing the usage of Commodity Greeks Pro computational analytics, financial risk disclosures, and intellectual property.',
    priority: 0.7,
    changefreq: 'monthly',
    isEditorial: true,
    adSenseEligible: true,
    breadcrumb: { name: 'Terms of Service', parentPath: '/' }
  },
  '/uploads': {
    path: '/uploads',
    title: 'Smart Price Ingestion & Broker OCR | Commodity Greeks Pro',
    description: 'Upload broker screenshots and CSV/Excel option chains for automated OCR extraction and real-time Greek computations.',
    priority: 0.6,
    changefreq: 'weekly',
    isEditorial: false,
    adSenseEligible: false,
    breadcrumb: { name: 'Price Ingestion', parentPath: '/' }
  },
  '/history': {
    path: '/history',
    title: 'Historical Calculations & Archival Logs | Commodity Greeks Pro',
    description: 'Review historical option Greek calculations, audit trails, and exported Excel models stored in your workspace repository.',
    priority: 0.6,
    changefreq: 'weekly',
    isEditorial: false,
    adSenseEligible: false,
    breadcrumb: { name: 'Calculation History', parentPath: '/' }
  },
  '/settings': {
    path: '/settings',
    title: 'Terminal Configuration & Risk Settings | Commodity Greeks Pro',
    description: 'Configure interest rate benchmarks (MIBOR), dividend yields, default commodity contracts, and visual terminal appearance.',
    priority: 0.4,
    changefreq: 'monthly',
    isEditorial: false,
    adSenseEligible: false,
    robots: {
      index: 'noindex',
      follow: 'nofollow',
      noarchive: true
    },
    breadcrumb: { name: 'Terminal Settings', parentPath: '/' }
  },
  '/auth': {
    path: '/auth',
    title: 'Sign In & Authentication | Commodity Greeks Pro',
    description: 'Sign in to access synchronized quantitative portfolios, saved scenario matrices, and automated price ingestion history.',
    priority: 0.3,
    changefreq: 'monthly',
    isEditorial: false,
    requiresAuth: true,
    adSenseEligible: false,
    robots: {
      index: 'noindex',
      follow: 'nofollow',
      noarchive: true
    },
    breadcrumb: { name: 'Authentication', parentPath: '/' }
  }
};
