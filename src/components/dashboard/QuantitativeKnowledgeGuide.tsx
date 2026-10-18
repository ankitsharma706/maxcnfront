import React from 'react';
import { BookOpen, Cpu, ShieldCheck, Zap, Activity, Target, ArrowRight, Layers, HelpCircle } from 'lucide-react';
import { useGreeksStore } from '../../store/useGreeksStore';

export const QuantitativeKnowledgeGuide: React.FC = () => {
  const { setActiveTab } = useGreeksStore();

  return (
    <article className="rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 backdrop-blur-xl shadow-sm space-y-8 text-slate-800 dark:text-slate-200">
      {/* Title Header */}
      <header className="space-y-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00778A]/10 text-[#00778A] dark:text-[#00A3BD] text-xs font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>Quantitative Research & Options Education</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
          MCX Commodity Option Greeks & Valuation Guide
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          An authoritative reference guide on the quantitative modeling of commodity derivatives, Black-76 mathematical pricing formulations, second-order Greek risk exposures, and contract specification parameters.
        </p>
      </header>

      {/* Part 1: The Black-76 Model */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <Cpu className="w-5 h-5 text-[#00778A]" />
          <h3>1. Why Fischer Black (1976) Governs MCX Commodity Options</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Options traded on India&apos;s Multi Commodity Exchange (MCX) — including Gold Mini, Silver, Crude Oil, Natural Gas, and Copper — are European-style options that settle directly into front-month futures contracts. Unlike equity stocks governed by the Black-Scholes-Merton model where continuous dividend yields and financing rates determine cash spot carry, commodity futures prices (F) already embed storage, insurance, and convenience yields.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The Fischer Black (1976) model accurately captures this dynamic by evaluating the discounted expectation of the futures payoff at maturity:
          <br />
          <code className="text-xs font-mono text-[#00778A] dark:text-[#38BDF8] block p-2.5 my-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            Call Premium = e^(-rT) × [ F × N(d₁) - K × N(d₂) ] &nbsp;|&nbsp; Put Premium = e^(-rT) × [ K × N(-d₂) - F × N(-d₁) ]
          </code>
          Where d₁ = [ln(F/K) + 0.5σ²T] / (σ√T), and d₂ = d₁ - σ√T.
        </p>
      </section>

      {/* Part 2: The Core Option Greeks Matrix */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <Activity className="w-5 h-5 text-[#00778A]" />
          <h3>2. Primary Risk Sensitivities (The Option Greeks)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white text-xs font-mono text-[#0EA5E9]">
              Delta (Δ) — Directional Velocity
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Delta reflects the change in option premium for every ₹1 change in the underlying MCX commodity contract. In Black-76, Call Delta equals e^(-rT) × N(d₁), typically ranging between 0.00 and +1.00, while Put Delta equals -e^(-rT) × N(-d₁). Traders use portfolio net delta to construct dynamic delta-neutral hedges.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white text-xs font-mono text-emerald-500">
              Gamma (Γ) — Delta Curvature & Pin Risk
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Gamma is the second derivative of option value relative to futures price. It measures the acceleration of Delta per unit movement. Gamma reaches its highest peak for At-The-Money (ATM) options approaching expiration, introducing substantial tail risk for options sellers if the market moves rapidly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white text-xs font-mono text-amber-500">
              Theta (Θ) — Time Decay Rate
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Theta quantifies the daily decay in option premium as calendar time passes. As expiration nears, the rate of theta decay accelerates non-linearly, particularly for ATM strikes. Options writers earn theta as compensation for bearing volatility risk.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white text-xs font-mono text-purple-500">
              Vega (ν) — Implied Volatility Exposure
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Vega measures sensitivity to a 1 percentage point (100 bps) shift in Implied Volatility (IV). In MCX Crude Oil and Natural Gas, geopolitical tensions and inventory reports routinely cause IV to expand by 5% to 15% in minutes, drastically altering out-of-the-money option values.
            </p>
          </div>
        </div>
      </section>

      {/* Part 3: Max Pain and Volatility Skew */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <Target className="w-5 h-5 text-[#00778A]" />
          <h3>3. Max Pain Theory & Implied Volatility Smile Dynamics</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Max Pain Strike:</strong> Max Pain represents the price level where the cumulative payout to option buyers across all open interest (OI) strikes is minimized, and option writers retain maximum collected premium. In active MCX contracts, spot prices often exhibit gravitational pull toward the Max Pain cluster in the final 48 hours before contract expiry.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Volatility Smile & Skew:</strong> Real-world commodity options rarely trade at constant implied volatility. Out-of-the-money options trade at higher implied volatilities due to perceived tail risks. In MCX Gold, fear of currency debasement creates call-side skew; in Crude Oil, supply disruption fears create pronounced upside skew during geopolitical events.
        </p>
      </section>

      {/* Documentation Footer Callout */}
      <footer className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-slate-900 dark:text-white text-xs">
            Want to study the complete mathematical derivations and MCX lot specifications?
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Visit our comprehensive Quantitative Documentation & Manual.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('docs')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00778A] hover:bg-[#006070] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0 shadow-sm"
        >
          <span>Read Full Quant Manual</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>
    </article>
  );
};
