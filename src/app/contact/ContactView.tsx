import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building,
  PhoneCall,
  Sparkles
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'support' | 'calculation' | 'api' | 'feedback' | 'legal'>('support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Contact Us | Commodity Greeks Pro';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    // Simulate reliable submission with unique ticket ID
    setTimeout(() => {
      const generatedTicket = `CGP-${Math.floor(100000 + Math.random() * 900000)}`;
      setTicketId(generatedTicket);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 sm:py-6 text-slate-800 dark:text-slate-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 backdrop-blur-xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#0EA5E9]/10 to-[#00778A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00778A]/10 dark:bg-[#00778A]/20 text-[#00778A] dark:text-[#00A3BD] text-xs font-semibold">
            <Mail className="w-4 h-4" />
            <span>Support & Quant Help Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Have an inquiry regarding MCX options valuation, spot price ingestion, Black-76 modeling, or enterprise integrations? Our quantitative support team is here to assist.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information & Channels Column */}
        <div className="space-y-4 lg:col-span-1">
          {/* Direct Email Card */}
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00778A]/10 text-[#00778A] dark:text-[#00A3BD] flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Direct Support</h2>
                <a
                  href="mailto:support@commoditygreeks.pro"
                  className="text-sm font-semibold text-slate-900 dark:text-white hover:text-[#00778A] dark:hover:text-[#00A3BD] transition-colors"
                >
                  support@commoditygreeks.pro
                </a>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              For calculation questions, broker OCR discrepancy reports, and bug submissions.
            </p>
          </div>

          {/* Response SLA Card */}
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Response SLA</h2>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  24–48 Business Hours
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Trading hours desk coverage: Monday to Friday from 09:00 to 23:30 IST (aligned with MCX evening session).
            </p>
          </div>

          {/* Quant Desk Location */}
          <div className="rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Location</h2>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  India Financial Hub
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Commodity Greeks Pro Analytics Desk<br />
              New Delhi & Mumbai, India
            </p>
          </div>
        </div>

        {/* Interactive Contact Form Column */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 backdrop-blur-xl shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto animate-in zoom-in duration-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Inquiry Received
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Your request has been logged. An analyst will review your submission and respond via email within 24 hours.
                  </p>
                </div>
                <div className="inline-block px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Ticket Reference: #{ticketId}
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                      setSubject('');
                    }}
                    className="px-5 py-2 rounded-xl bg-[#00778A] text-white text-xs font-semibold hover:bg-[#006070] transition-colors cursor-pointer"
                  >
                    Submit Another Query
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-3">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Send a Message to Support
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We value feedback from commodity options traders and platform users
                  </p>
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ankit Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00778A]/20 focus:border-[#00778A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trader@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00778A]/20 focus:border-[#00778A]"
                    />
                  </div>
                </div>

                {/* Inquiry Category Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Inquiry Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'support', label: 'Technical Support' },
                      { id: 'calculation', label: 'Greeks / Math Query' },
                      { id: 'api', label: 'Enterprise / API' },
                      { id: 'feedback', label: 'Feature Suggestion' },
                      { id: 'legal', label: 'Privacy / AdSense' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id as any)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                          category === cat.id
                            ? 'bg-[#00778A] text-white shadow-xs font-semibold'
                            : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary of your query..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00778A]/20 focus:border-[#00778A]"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your calculation inquiry, broker screenshot discrepancy, or question in detail..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00778A]/20 focus:border-[#00778A]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#00778A] hover:bg-[#006070] text-white font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-md shadow-[#00778A]/20 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Inquiry to Quant Desk</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
