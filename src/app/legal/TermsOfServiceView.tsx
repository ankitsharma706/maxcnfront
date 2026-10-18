import React, { useEffect } from 'react';
import {
  FileText,
  AlertTriangle,
  Scale,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  Calendar,
  Building,
  Mail
} from 'lucide-react';

export const TermsOfServiceView: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Terms of Service | Commodity Greeks Pro';
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 sm:py-6 text-slate-800 dark:text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-[#00778A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <Scale className="w-4 h-4" />
            <span>Institutional User Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Please read these Terms of Service carefully before utilizing the Commodity Greeks Pro analytical platform. By accessing or utilizing our website, calculators, OCR ingestion utilities, or API services, you agree to be legally bound by these terms.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00778A]" />
              Last Updated: October 18, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-[#00778A]" />
              Platform: Commodity Greeks Pro Engine
            </span>
          </div>
        </div>
      </div>

      {/* Critical Financial Disclaimer Box */}
      <div className="rounded-3xl bg-amber-500/5 dark:bg-amber-500/10 border-2 border-amber-500/30 dark:border-amber-500/40 p-6 sm:p-8 backdrop-blur-md shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Critical Financial & Derivative Trading Disclaimer
            </h2>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-mono">
              SEBI & Global Regulatory Risk Notice
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <strong>Trading in MCX commodity options and futures involves substantial risk of financial capital loss.</strong> The calculations, analytical Greek profiles (Delta, Gamma, Theta, Vega, Rho), volatility surfaces, scenario stress models, and automated OCR estimations displayed on Commodity Greeks Pro are provided strictly for <strong>informational, research, and educational purposes</strong>.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Nothing on this platform constitutes financial advice, investment advisory services, trade recommendations, or portfolio solicitation. Option prices, Greeks sensitivity coefficients, and implied volatilities are mathematical approximations derived from theoretical models (such as Black-76 and Black-Scholes) and may diverge from real-time exchange executions or clearing prices.
        </p>
      </div>

      {/* Core Terms Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#00778A]/10 text-[#00778A] dark:text-[#00A3BD] flex items-center justify-center text-xs font-mono">
              1
            </span>
            Acceptance of Terms & Eligibility
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            By creating an account, running Greeks simulations, or accessing our web endpoints, you warrant that you are at least 18 years of age and possess full legal capacity to enter into these binding terms. If you are accessing the platform on behalf of an institution, fund, or corporate entity, you affirm that you have authorization to bind that entity.
          </p>
        </div>

        {/* Section 2 */}
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#00778A]/10 text-[#00778A] dark:text-[#00A3BD] flex items-center justify-center text-xs font-mono">
              2
            </span>
            Intellectual Property Rights
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            All algorithms, user interfaces, branding trademarks, visual designs, analytical code, and proprietary calculation engines on Commodity Greeks Pro are the exclusive intellectual property of the platform creators and protected under international copyright, patent, and trademark treaties. You may not reverse engineer, decompile, or copy our analytical engines without prior written consent.
          </p>
        </div>

        {/* Section 3 */}
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#00778A]/10 text-[#00778A] dark:text-[#00A3BD] flex items-center justify-center text-xs font-mono">
              3
            </span>
            Acceptable Use & API Guardrails
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Users agree not to: (a) engage in denial-of-service or flooding attacks against our API servers; (b) upload malicious, corrupted, or illicit screenshot files to our OCR parser; (c) attempt unauthorized access to other user accounts or MongoDB databases; or (d) scrape platform data at frequencies that degrade performance for other market participants.
          </p>
        </div>

        {/* Section 4 */}
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#00778A]/10 text-[#00778A] dark:text-[#00A3BD] flex items-center justify-center text-xs font-mono">
              4
            </span>
            Limitation of Liability
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            To the maximum extent permitted by applicable law, Commodity Greeks Pro and its operators, contributors, and licensors shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including loss of profits, trading capital, data, or goodwill arising from the use of or inability to use this platform.
          </p>
        </div>

        {/* Section 5 */}
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#00778A]/10 text-[#00778A] dark:text-[#00A3BD] flex items-center justify-center text-xs font-mono">
              5
            </span>
            Modifications & Termination
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We reserve the right to revise or amend these Terms of Service at any time without prior notice. Continued use of the platform after any modifications constitutes your formal acceptance of the revised terms. We reserve the right to suspend or terminate accounts in violation of these conditions.
          </p>
        </div>
      </div>

      {/* Footer Contact */}
      <div className="rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Legal & Compliance Inquiries:</span>
          <p className="text-slate-500 dark:text-slate-400">Questions concerning these Terms of Service can be directed to our desk.</p>
        </div>
        <a
          href="mailto:[EMAIL_ADDRESS]"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00778A] hover:bg-[#006070] text-white font-medium transition-colors shadow-sm"
        >
          <Mail className="w-4 h-4" />
          <span>[EMAIL_ADDRESS]</span>
        </a>
      </div>
    </div>
  );
};
