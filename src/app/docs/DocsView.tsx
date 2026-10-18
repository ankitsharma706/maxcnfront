import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  Zap,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Check,
  Code2,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Percent,
  Clock
} from 'lucide-react';
import { AdSenseBanner } from '../../components/common/AdSenseBanner';
import { ContextualLinkRouter } from '../../seo';
import { useGreeksStore } from '../../store/useGreeksStore';
import { getTabFromPath } from '../../App';


export const DocsView: React.FC = () => {
  const { setActiveTab: setPlatformTab } = useGreeksStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'black76' | 'greeks' | 'specs' | 'risk'>('overview');


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Documentation & Quantitative Guide | Commodity Greeks Pro';
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 sm:py-6 text-slate-800 dark:text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0EA5E9]/15 to-[#00778A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0EA5E9]/10 text-[#0EA5E9] text-xs font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Quantitative Reference & Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Terminal Documentation & Options Knowledge Base
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            A comprehensive quantitative manual covering the Black-76 commodity option pricing formulation, first- and second-order Greeks derivations, MCX exchange contract rules, and automated broker chain OCR ingestion.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-mono scrollbar-none">
        {[
          { id: 'overview', label: '1. Platform Architecture' },
          { id: 'black76', label: '2. Black-76 Math' },
          { id: 'greeks', label: '3. Greeks Derivation' },
          { id: 'specs', label: '4. MCX Contract Rules' },
          { id: 'risk', label: '5. Volatility & Risk' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#00778A] text-white shadow-xs font-bold'
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-[#00778A] dark:text-[#00A3BD]">
              <Cpu className="w-5 h-5" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Platform Architecture & Quantitative Stack
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Commodity Greeks Pro is designed from first principles as an institutional-grade quantitative workstation for Multi Commodity Exchange (MCX) derivatives market participants. The platform is architected around four foundational components:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-mono flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#00778A]/10 text-[#00778A] flex items-center justify-center text-xs">1</span>
                  Real-Time Black-76 Computation
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Calculates continuous 64-bit precision evaluations of option pricing and risk sensitivities (Delta, Gamma, Theta, Vega, Rho, and Probability of Profit) without client-side lag.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-mono flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#00778A]/10 text-[#00778A] flex items-center justify-center text-xs">2</span>
                  Computer Vision OCR Ingestion
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Optical table recognition for Indian broker option chains (Groww, Zerodha Kite, Upstox, Angel One), extracting strike ladders, open interest, and implied volatility directly from screenshots.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-mono flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#00778A]/10 text-[#00778A] flex items-center justify-center text-xs">3</span>
                  Scenario Stress-Testing Engine
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Multi-variable sensitivity matrix simulating simultaneous spot price jumps (+/-100 to +/-2800 points), implied volatility shocks, and calendar decay trajectories.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-mono flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#00778A]/10 text-[#00778A] flex items-center justify-center text-xs">4</span>
                  MongoDB Archival Persistence
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Persistent cloud storage of calculation records, parsed option chains, and volatility surfaces allowing quantitative traders to perform historical variance audits.
                </p>
              </div>
            </div>
          </div>

          {/* AdSense Compliant Banner on Approved Editorial Route */}
          <AdSenseBanner className="my-2" />
        </div>
      )}

      {/* Tab 2: Black-76 Math */}
      {activeTab === 'black76' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              The Fischer Black (1976) Futures Option Pricing Formulation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard equity option pricing uses the Black-Scholes-Merton (1973) model, which models an underlying stock paying continuous cash dividends. However, on commodity exchanges like MCX, options are exercisable into <strong>futures contracts</strong> rather than physical commodities. Fischer Black adapted the model in 1976 specifically for options on commodity futures.
            </p>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs sm:text-sm space-y-3">
              <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                Analytical Closed-Form Formulas:
              </div>
              <div className="space-y-2 text-slate-800 dark:text-slate-200">
                <div><span className="text-[#0EA5E9] font-bold">Call Price (C):</span> e^(-rT) × [ F × N(d₁) - K × N(d₂) ]</div>
                <div><span className="text-[#0EA5E9] font-bold">Put Price (P):</span> e^(-rT) × [ K × N(-d₂) - F × N(-d₁) ]</div>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <div>d₁ = [ ln(F / K) + (0.5 × σ²) × T ] / [ σ × √T ]</div>
                <div>d₂ = d₁ - σ × √T</div>
                <div className="pt-1 text-[11px] text-slate-400">
                  Where: F = Current Futures Price, K = Strike Price, r = Risk-Free Interest Rate, T = Time to Expiry (in years), σ = Annualized Implied Volatility, N(x) = Standard Normal Cumulative Distribution Function.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 text-xs sm:text-sm space-y-2 text-slate-700 dark:text-slate-300">
              <h3 className="font-bold text-slate-900 dark:text-white">
                Why Black-76 is Superior for MCX Options:
              </h3>
              <p>
                In commodity spot markets, holding physical Gold or Crude Oil entails warehousing fees, insurance, and interest costs (cost-of-carry). The futures price (F) directly incorporates these costs. Applying Black-Scholes without futures adjustment leads to systematic mispricing of out-of-the-money strikes and incorrect delta-neutral hedge ratios.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Greeks Derivations */}
      {activeTab === 'greeks' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Analytical Derivations of First & Second-Order Option Greeks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-900 dark:text-white">Delta (Δ)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-500 font-bold">First Order</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Call Δ = e^(-rT) × N(d₁)<br />
                  Put Δ = -e^(-rT) × N(-d₁)
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Reflects directional delta exposure. A Call Delta of 0.50 on Gold Mini indicates the premium changes by ₹50 for every ₹100 move in underlying spot.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-900 dark:text-white">Gamma (Γ)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">Second Order</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Γ = [ e^(-rT) × N&apos;(d₁) ] / [ F × σ × √T ]
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Gamma measures the convexity of delta. Peaks sharply for At-The-Money (ATM) options approaching expiration, creating &quot;gamma risk&quot; for short option desks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-900 dark:text-white">Theta (Θ)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">Calendar Decay</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Θ = -[ (F × σ × e^(-rT) × N&apos;(d₁)) / (2 × √T) ] ± r × Premium
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Scaled to 1/365 to express expected 1-day time decay. Option sellers earn theta while option buyers pay theta daily.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-slate-900 dark:text-white">Vega (ν)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold">Vol Sensitivity</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  ν = e^(-rT) × F × √T × N&apos;(d₁) × 0.01
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Calculated per 1.0% (100 bps) change in implied volatility. Higher for long-dated contracts and diminishes as options approach expiry.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: MCX Contract Rules */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Official MCX India Contract Multipliers & Lot Sizes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              When analyzing commodity options, understanding contract multipliers is critical for correct rupee risk quantification. A 1-point move in Crude Oil options equals ₹100, while a 1-point move in Natural Gas equals ₹1,250:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-slate-700 dark:text-slate-300">
                    <th className="p-3">Commodity</th>
                    <th className="p-3">Symbol</th>
                    <th className="p-3">Lot Size (Multiplier)</th>
                    <th className="p-3">Price Quote Unit</th>
                    <th className="p-3">Tick Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-600 dark:text-slate-400">
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Gold Mini</td>
                    <td className="p-3 text-[#0EA5E9]">GOLDM</td>
                    <td className="p-3">100 grams (10x quote)</td>
                    <td className="p-3">₹ per 10 grams</td>
                    <td className="p-3">₹1.00</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Silver Mini</td>
                    <td className="p-3 text-[#0EA5E9]">SILVERM</td>
                    <td className="p-3">5 kilograms (5x quote)</td>
                    <td className="p-3">₹ per 1 kg</td>
                    <td className="p-3">₹1.00</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Crude Oil</td>
                    <td className="p-3 text-[#0EA5E9]">CRUDEOIL</td>
                    <td className="p-3">100 Barrels (100x quote)</td>
                    <td className="p-3">₹ per 1 BBL</td>
                    <td className="p-3">₹1.00</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Natural Gas</td>
                    <td className="p-3 text-[#0EA5E9]">NATURALGAS</td>
                    <td className="p-3">1,250 mmBtu (1250x quote)</td>
                    <td className="p-3">₹ per 1 mmBtu</td>
                    <td className="p-3">₹0.10</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Copper</td>
                    <td className="p-3 text-[#0EA5E9]">COPPER</td>
                    <td className="p-3">2,500 kg (2500x quote)</td>
                    <td className="p-3">₹ per 1 kg</td>
                    <td className="p-3">₹0.05</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Risk Management */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Options Risk Management: Volatility Skew & Max Pain
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>
                <strong>Volatility Skew & Smile:</strong> In classical Black-Scholes, implied volatility is assumed constant across all strikes. In reality, market participants price out-of-the-money puts and calls at different implied volatilities. In MCX Crude Oil, geopolitical risk frequently creates positive call skew, while in Gold, macroeconomic fear drives out-of-the-money call premiums.
              </p>
              <p>
                <strong>Max Pain Theory:</strong> Max pain is the strike price where option buyers (in aggregate) would incur the greatest cumulative monetary loss, and option writers would retain maximum collected premium. Commodity Greeks Pro computes the dynamic loss curve across all active open interest rows in the chain.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Contextual Internal Linking Hub */}
      <ContextualLinkRouter
        currentPath="/docs"
        onNavigate={(target) => setPlatformTab(getTabFromPath(target))}
      />
    </div>
  );
};

