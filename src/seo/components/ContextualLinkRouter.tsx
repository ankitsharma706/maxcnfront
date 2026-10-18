import React from 'react';
import { ArrowRight, BookOpen, Calculator, Sliders, LineChart, FileText } from 'lucide-react';

export interface ContextualLink {
  path: string;
  title: string;
  description: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const RELATED_LINK_CLUSTERS: Record<string, ContextualLink[]> = {
  '/': [
    {
      path: '/calculator',
      title: 'MCX Greeks Calculator',
      description: 'Run precision 64-bit numerical evaluations of Delta, Gamma, Vega, Theta, and Rho.',
      badge: 'Core Tool',
      icon: Calculator
    },
    {
      path: '/scenario',
      title: 'Stress & Scenario Matrix',
      description: 'Model volatility shocks, rate shifts, and price spikes across commodity positions.',
      badge: 'Simulator',
      icon: Sliders
    },
    {
      path: '/docs',
      title: 'Quantitative Reference Manual',
      description: 'Study the Fischer Black (1976) model formulations and MCX lot specifications.',
      badge: 'Documentation',
      icon: BookOpen
    }
  ],
  '/calculator': [
    {
      path: '/scenario',
      title: 'Greeks Stress Simulator',
      description: 'Project position Greeks across +/-100, +/-500, and +/-1000 point MCX price shifts.',
      icon: Sliders
    },
    {
      path: '/docs',
      title: 'Black-76 Pricing Formula',
      description: 'Review analytical closed-form equations for futures-style commodity derivatives.',
      icon: BookOpen
    },
    {
      path: '/analytics',
      title: 'Volatility Surface & Smile',
      description: 'Analyze implied volatility skew and Max Pain strikes across active expiries.',
      icon: LineChart
    }
  ],
  '/scenario': [
    {
      path: '/calculator',
      title: 'Greeks Pricing Workspace',
      description: 'Calculate base sensitivities for individual strikes before running stress matrices.',
      icon: Calculator
    },
    {
      path: '/docs',
      title: 'Second-Order Greeks Guide',
      description: 'Understand Volga, Vanna, and cross-gamma risk acceleration in commodity spikes.',
      icon: BookOpen
    }
  ],
  '/analytics': [
    {
      path: '/calculator',
      title: 'Interactive Greeks Workspace',
      description: 'Input underlying prices and strikes to compute real-time options sensitivities.',
      icon: Calculator
    },
    {
      path: '/docs',
      title: 'Max Pain & IV Dynamics Guide',
      description: 'Learn how open interest distribution creates gravitational price pull near expiry.',
      icon: BookOpen
    }
  ],
  '/docs': [
    {
      path: '/calculator',
      title: 'Launch Greeks Workspace',
      description: 'Apply the Black-76 mathematical formulas directly to live MCX market quotes.',
      icon: Calculator
    },
    {
      path: '/scenario',
      title: 'Launch Stress Simulator',
      description: 'Simulate the impact of market volatility spikes on multi-leg commodity portfolios.',
      icon: Sliders
    },
    {
      path: '/about',
      title: 'About the Engineering Team',
      description: 'Discover how Commodity Greeks Pro was built for Indian derivatives traders.',
      icon: FileText
    }
  ],
  '/about': [
    {
      path: '/docs',
      title: 'Read Quant Manual',
      description: 'Inspect our mathematical models, contract specifications, and risk formulas.',
      icon: BookOpen
    },
    {
      path: '/calculator',
      title: 'Greeks Terminal',
      description: 'Experience real-time valuation of MCX Gold, Crude, and Natural Gas options.',
      icon: Calculator
    }
  ]
};

interface ContextualLinkRouterProps {
  currentPath: string;
  onNavigate?: (path: string) => void;
  className?: string;
  heading?: string;
}

/**
 * Contextual Internal Linking Hub.
 * - Distributes internal PageRank equity systematically to key transactional and editorial hubs.
 * - Employs descriptive, keyword-rich anchor text.
 */
export const ContextualLinkRouter: React.FC<ContextualLinkRouterProps> = ({
  currentPath,
  onNavigate,
  className = '',
  heading = 'Recommended Quantitative Workstations & Guides'
}) => {
  const clean = currentPath.toLowerCase().replace(/\/$/, '') || '/';
  const links = RELATED_LINK_CLUSTERS[clean] || RELATED_LINK_CLUSTERS['/'];

  if (!links || links.length === 0) {
    return null;
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <section
      aria-label="Related Internal Hubs"
      className={`rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/30 dark:from-slate-900/60 dark:to-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 transition-colors ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{heading}</span>
        </h3>
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Internal Architecture
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.path}
              href={link.path}
              onClick={(e) => handleLinkClick(e, link.path)}
              className="group p-3.5 rounded-xl bg-white/90 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 hover:border-[#00778A]/60 dark:hover:border-[#00A3BD]/60 transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#00778A]/10 text-[#00778A] dark:text-[#00A3BD] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {link.badge}
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#00778A] dark:group-hover:text-[#00A3BD] transition-colors">
                  {link.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-1">
                  {link.description}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-semibold text-[#00778A] dark:text-[#00A3BD] mt-3 group-hover:translate-x-0.5 transition-transform">
                <span>Access Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
