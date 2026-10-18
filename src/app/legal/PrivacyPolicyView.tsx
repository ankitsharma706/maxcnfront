import React, { useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Cookie,
  Eye,
  Server,
  FileText,
  ExternalLink,
  Mail,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Globe
} from 'lucide-react';

export const PrivacyPolicyView: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Privacy Policy | Commodity Greeks Pro';
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 sm:py-6 text-slate-800 dark:text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#00778A]/10 to-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00778A]/10 dark:bg-[#00778A]/20 text-[#00778A] dark:text-[#00A3BD] text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>AdSense & Regulatory Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Your privacy is of paramount importance to Commodity Greeks Pro (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). This policy outlines our transparent data handling practices, cookie policies, and our compliance with Google AdSense, third-party advertising standards, and global privacy frameworks.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#00778A]" />
              Effective Date: October 18, 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#00778A]" />
              Jurisdiction: Global / MCX India
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Google AdSense & Third-Party Advertising Disclosure */}
      <div className="rounded-3xl bg-gradient-to-br from-sky-500/5 via-transparent to-teal-500/5 border-2 border-[#00778A]/30 dark:border-[#00778A]/40 p-6 sm:p-8 backdrop-blur-md shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00778A] text-white flex items-center justify-center font-bold shadow-md shadow-[#00778A]/20">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Google AdSense & Third-Party Advertising Disclosures
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Mandatory Publisher Transparency Disclosures
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            We partner with <strong>Google AdSense</strong> and authorized third-party ad networks to serve contextual and interest-based advertisements across our platform. In compliance with Google AdSense Publisher Policies, we provide the following explicit notices:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>Third-Party Vendors & Cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to Commodity Greeks Pro or other websites across the Internet.
            </li>
            <li>
              <strong>Google&apos;s Advertising Cookies (DART Cookie):</strong> Google&apos;s use of advertising cookies enables it and its partners to serve relevant advertisements to our users based on their visits to our site and/or other sites on the World Wide Web.
            </li>
            <li>
              <strong>User Choice & Opt-Out:</strong> Users may freely opt out of personalized advertising at any time by visiting the{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00778A] dark:text-[#00A3BD] font-semibold underline inline-flex items-center gap-0.5 hover:text-[#005566]"
              >
                Google Ads Settings
                <ExternalLink className="w-3 h-3" />
              </a>
              . Alternatively, users may opt out of third-party vendors&apos; use of cookies for personalized advertising by visiting{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00778A] dark:text-[#00A3BD] font-semibold underline inline-flex items-center gap-0.5 hover:text-[#005566]"
              >
                aboutads.info
                <ExternalLink className="w-3 h-3" />
              </a>{' '}
              or the European Interactive Digital Advertising Alliance (EDAA).
            </li>
          </ul>
        </div>
      </div>

      {/* Policy Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Information We Collect */}
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-[#00778A] dark:text-[#00A3BD]">
            <Eye className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h3>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
            <p>
              <strong>Analytical & Technical Data:</strong> Standard server logs, IP addresses (anonymized), browser types, referring pages, operating systems, and session duration to ensure computational engine uptime.
            </p>
            <p>
              <strong>User Inputs:</strong> Strike prices, spot levels, implied volatility figures, and broker screenshots uploaded for OCR processing. Screenshot processing is executed securely with OCR parsing and is not shared with external third-party advertisers.
            </p>
            <p>
              <strong>Authentication Information:</strong> If you register or authenticate via Google Sign-In, we collect your name, verified email address, and profile avatar for profile synchronization.
            </p>
          </div>
        </div>

        {/* Section 2: Cookies & Local Storage */}
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-[#00778A] dark:text-[#00A3BD]">
            <Cookie className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">2. Cookies & Local Storage</h3>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
            <p>
              We utilize browser <code>localStorage</code> to store user client preferences, such as Dark/Light visual theme mode, selected MCX commodity contracts, and risk threshold alerts.
            </p>
            <p>
              Cookies are employed by Google AdSense for fraud detection, frequency capping, aggregated ad reporting, and ad delivery. You can configure your browser to reject all cookies or notify you when a cookie is sent.
            </p>
          </div>
        </div>

        {/* Section 3: Data Security & Storage */}
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-[#00778A] dark:text-[#00A3BD]">
            <Server className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">3. Data Security & Storage</h3>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
            <p>
              All communication between your browser and our backend infrastructure is encrypted via industry-standard Transport Layer Security (TLS 1.3 / HTTPS).
            </p>
            <p>
              We enforce strict MongoDB NoSQL injection sanitization, Helmet security HTTP headers, rate limiting, and Cross-Site Request Forgery (CSRF) defenses to protect your financial simulation datasets.
            </p>
          </div>
        </div>

        {/* Section 4: Children's Privacy (COPPA) */}
        <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 space-y-3">
          <div className="flex items-center gap-2.5 text-[#00778A] dark:text-[#00A3BD]">
            <Lock className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">4. Children&apos;s Privacy (COPPA)</h3>
          </div>
          <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-2 leading-relaxed">
            <p>
              Our commodity derivatives valuation engine is designed exclusively for adult market participants, derivatives traders, quants, and institutional users.
            </p>
            <p>
              We do not knowingly collect personal identifiable information from individuals under the age of 18. If you believe a minor has submitted personal data, please contact us for immediate deletion.
            </p>
          </div>
        </div>
      </div>

      {/* User Rights & Contact Box */}
      <div className="rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          5. User Rights & Privacy Contact
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Depending on your jurisdiction (including GDPR, CCPA, and India DPDP Act), you have the right to access, rectify, or request deletion of any stored calculation history or account data associated with your session.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Data Protection Officer:</span>
            <p className="text-slate-500 dark:text-slate-400">Commodity Greeks Pro Compliance Team</p>
          </div>
          <a
            href="mailto:support@commoditygreeks.pro"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00778A] hover:bg-[#006070] text-white font-medium transition-colors shadow-sm"
          >
            <Mail className="w-4 h-4" />
            <span>support@commoditygreeks.pro</span>
          </a>
        </div>
      </div>
    </div>
  );
};
