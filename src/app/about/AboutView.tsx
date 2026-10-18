import React, { useEffect } from 'react';
import {
  TrendingUp,
  Cpu,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  Database,
  CheckCircle2,
  Award,
  Users,
  Compass,
  ArrowRight,
  Code2,
  LineChart
} from 'lucide-react';
import { useGreeksStore } from '../../store/useGreeksStore';

export const AboutView: React.FC = () => {
  const { setActiveTab } = useGreeksStore();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'About Us | Commodity Greeks Pro';
  }, []);

  const features = [
    {
      icon: Cpu,
      title: 'Black-76 & Black-Scholes Engine',
      description: 'Continuous 64-bit numerical computations of first and second-order Greeks (Delta, Gamma, Theta, Vega, Rho) specifically calibrated for MCX futures-style commodity options.'
    },
    {
      icon: Zap,
      title: 'Automated Broker OCR Ingestion',
      description: 'Proprietary computer vision parser extracting strike tables, open interest, and implied volatility directly from broker screenshots (Groww, Zerodha, Upstox, Angel One).'
    },
    {
      icon: BarChart3,
      title: 'Scenario Stress Simulator',
      description: 'Real-time multi-strike sensitivity testing with custom underlying price shocks (+/-100 to +/-2800 points), volatility expansion/contraction, and time decay modeling.'
    },
    {
      icon: Database,
      title: 'Enterprise MongoDB Persistence',
      description: 'Secure historical telemetry and scenario archiving allowing commodity option traders to track structural volatility shifts across contract expiry cycles.'
    }
  ];

  const commodities = [
    { name: 'Gold & Gold Mini', unit: '100g / 1kg', symbol: 'GOLD' },
    { name: 'Silver & Silver Mini', unit: '5kg / 30kg', symbol: 'SILVER' },
    { name: 'Crude Oil', unit: '100 BBL', symbol: 'CRUDEOIL' },
    { name: 'Natural Gas', unit: '1250 mmBtu', symbol: 'NATURALGAS' },
    { name: 'Copper & Nickel', unit: '2500 kg', symbol: 'COPPER' },
    { name: 'Zinc & Aluminium', unit: '5 MT', symbol: 'ZINC' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-4 sm:py-6 text-slate-800 dark:text-slate-200">
      {/* Hero Header */}
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-12 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#0EA5E9]/15 via-[#00778A]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs font-semibold">
            <Award className="w-4 h-4" />
            <span>Institutional Commodity Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading leading-tight">
            Democratizing Enterprise MCX Option Analytics
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Commodity Greeks Pro is an institutional-grade mathematical analytics workstation built for commodity derivatives traders, quants, and market makers active on India&apos;s Multi Commodity Exchange (MCX).
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setActiveTab('calculator');
                window.history.pushState({}, '', '/calculator');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#00778A] hover:bg-[#006070] text-white font-semibold text-xs transition-all shadow-md shadow-[#00778A]/20 cursor-pointer flex items-center gap-2"
            >
              <span>Launch Greeks Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setActiveTab('contact');
                window.history.pushState({}, '', '/contact');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
            >
              Contact Our Desk
            </button>
          </div>
        </div>
      </div>

      {/* Mission & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-8 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00778A]/10 text-[#00778A] flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Our Mission</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Retail and proprietary commodity traders in India often lack the sophisticated analytical tooling available to institutional trading desks. Our mission is to bridge this gap by delivering zero-latency, exchange-accurate Black-76 mathematical modeling, visual volatility surfaces, and automated chain ingestion directly into the browser.
          </p>
        </div>

        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-8 space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quant Precision & Trust</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Every option calculation is benchmarked against standard quantitative finance libraries. We model European and American style dynamics, accounting for cash settlement vs. tender period delivery variances and custom contract lot sizes across Gold, Crude, and Natural Gas contracts.
          </p>
        </div>
      </div>

      {/* Core Architectural Pillars */}
      <div className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
            Core Engine Capabilities
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Engineered for high-frequency volatility analysis and risk hedging
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-2 hover:border-[#00778A]/50 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-[#00778A] dark:text-[#00A3BD]">
                  <Icon className="w-5 h-5" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{feat.title}</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coverage Commodities Matrix */}
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Covered MCX Commodity Contracts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete strike coverage with automated ATM centering and IV smile derivation
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg w-fit">
            9 Active Commodities
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {commodities.map((comm) => (
            <div
              key={comm.symbol}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/70 dark:border-slate-800/70 text-xs"
            >
              <div className="font-bold text-slate-900 dark:text-white">{comm.name}</div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                Lot: {comm.unit} • {comm.symbol}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust & Transparency Footnote */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-100 to-sky-50 dark:from-slate-900/80 dark:to-[#0c1829]/80 border border-slate-200 dark:border-slate-800 p-6 text-center space-y-2">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
          Transparent, Independent & Ad-Supported
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Commodity Greeks Pro is supported through transparent contextual advertising and premium institutional subscriptions. We adhere strictly to ethical advertising standards, protecting user privacy and ensuring clean, uninterrupted analytical terminal access.
        </p>
      </div>
    </div>
  );
};
