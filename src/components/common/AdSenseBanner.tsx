import React, { useEffect, useRef } from 'react';
import { useGreeksStore } from '../../store/useGreeksStore';
import {
  isAdSenseEligibleRoute,
  loadAdSenseScriptForRoute,
  ADSENSE_CLIENT_ID
} from '../../utils/adSenseManager';
import { ShieldCheck, Info } from 'lucide-react';

interface AdSenseBannerProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdSenseBanner: React.FC<AdSenseBannerProps> = ({
  slotId,
  format = 'auto',
  className = ''
}) => {
  const { activeTab } = useGreeksStore();
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef<boolean>(false);

  // Strict Policy Check: NEVER render ad units or script on restricted routes (auth, settings, utilities)
  const isEligible = isAdSenseEligibleRoute(activeTab);

  useEffect(() => {
    if (!isEligible) return;

    // Dynamically load AdSense script ONLY when viewing an approved content-rich route
    loadAdSenseScriptForRoute(activeTab);

    // Push slot once script is ready
    if (slotId && !pushedRef.current && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch (err) {
        // Suppress duplicate push in React re-renders
      }
    }
  }, [slotId, activeTab, isEligible]);

  // If the route is ineligible (auth, settings, uploads, history), render NOTHING
  if (!isEligible) {
    return null;
  }

  // If approved and slotId is provided, render the compliant unit
  if (slotId) {
    return (
      <div className={`w-full overflow-hidden flex flex-col items-center justify-center my-4 ${className}`}>
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-600 mb-1">
          Advertisement
        </span>
        <ins
          ref={adRef}
          className="adsbygoogle block w-full text-center"
          style={{ display: 'block' }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Pre-approval fallback: High-value institutional notice instead of empty container
  return (
    <div className={`w-full rounded-2xl bg-gradient-to-r from-slate-50 to-sky-50/40 dark:from-slate-900/60 dark:to-slate-800/40 border border-slate-200/80 dark:border-slate-800/80 p-4 transition-colors ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00778A]/10 text-[#00778A] dark:text-[#00A3BD] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>MCX Derivatives Valuation & Analytical Guardrails</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00778A]/10 text-[#00778A] dark:text-[#00A3BD] font-mono">
                Verified Engine
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
              All theoretical option Greeks (Delta, Gamma, Theta, Vega, Rho) are computed in real time using 64-bit Black-76/Black-Scholes algorithms.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-[#00778A]" />
          <span>Real-time MCX Feed Active</span>
        </div>
      </div>
    </div>
  );
};
