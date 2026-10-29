import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Send, Mail } from 'lucide-react';
import { SITE_BRAND, THOUGHTS_CONTENT } from '../data/siteContent';
import { validateThoughtsForm } from '../utils/siteLogic';

export const ThoughtsSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState<{
    name: string;
    email: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateThoughtsForm({ name, email, message });
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        access_key: THOUGHTS_CONTENT.web3FormsAccessKey,
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      };

      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      }).catch(() => null);
    } finally {
      setIsSubmitting(false);
      setSubmittedEntry({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <section
      id="thoughts"
      aria-labelledby="thoughts-heading"
      className="scroll-mt-20 py-24 border-t border-emerald-950/10 bg-[#F7F9F7]"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
        >
          {/* Left 5 Columns: Editorial Invitation */}
          <div className="lg:col-span-5 space-y-5">
            <p className="text-xs uppercase tracking-widest text-[#265728] font-semibold">
              Community Dialogue
            </p>
            <h2
              id="thoughts-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F1C12] tracking-tight"
            >
              {THOUGHTS_CONTENT.heading}
            </h2>
            <p className="text-base sm:text-lg text-[#3F5243] leading-relaxed">
              {THOUGHTS_CONTENT.subheading}
            </p>

            <div className="pt-4 border-t border-emerald-950/10 space-y-2">
              <p className="text-xs text-[#3F5243]">Direct Correspondence</p>
              <a
                href={SITE_BRAND.emailComposeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#265728] hover:underline"
              >
                <Mail className="w-4 h-4" />
                <span>{SITE_BRAND.email}</span>
              </a>
            </div>
          </div>

          {/* Right 7 Columns: Clean Architectural Form */}
          <div className="lg:col-span-7 bg-white border border-emerald-950/10 rounded-3xl p-6 sm:p-10 shadow-sm">
            {submittedEntry ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                role="status"
                aria-live="polite"
                className="bg-[#EAF2EA] border border-[#265728]/30 rounded-2xl p-8 text-center space-y-3"
              >
                <CheckCircle2 className="w-10 h-10 text-[#265728] mx-auto" />
                <h3 className="font-display text-2xl font-semibold text-[#0F1C12]">
                  Thank you!
                </h3>
                <p className="text-sm text-[#3F5243]">
                  Message sent successfully! Thank you,{' '}
                  <span className="font-semibold text-[#0F1C12]">
                    {submittedEntry.name}
                  </span>
                  .
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setSubmittedEntry(null)}
                    className="px-5 py-2.5 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="thoughts-name"
                      className="block text-xs font-semibold text-[#0F1C12] mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="thoughts-name"
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name)
                          setErrors({ ...errors, name: undefined });
                      }}
                      className="w-full px-4 py-3 text-sm bg-[#F7F9F7] border border-emerald-950/12 rounded-xl focus:bg-white focus:border-[#265728] focus:outline-none transition-colors"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-700 mt-1.5" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="thoughts-email"
                      className="block text-xs font-semibold text-[#0F1C12] mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="thoughts-email"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email)
                          setErrors({ ...errors, email: undefined });
                      }}
                      className="w-full px-4 py-3 text-sm bg-[#F7F9F7] border border-emerald-950/12 rounded-xl focus:bg-white focus:border-[#265728] focus:outline-none transition-colors"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-700 mt-1.5" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="thoughts-message"
                    className="block text-xs font-semibold text-[#0F1C12] mb-2"
                  >
                    Your Thoughts
                  </label>
                  <textarea
                    id="thoughts-message"
                    name="message"
                    placeholder="Your Thoughts"
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message)
                        setErrors({ ...errors, message: undefined });
                    }}
                    className="w-full px-4 py-3 text-sm bg-[#F7F9F7] border border-emerald-950/12 rounded-xl focus:bg-white focus:border-[#265728] focus:outline-none transition-colors"
                  />
                  {errors.message && (
                    <p className="text-xs text-red-700 mt-1.5" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto py-3 px-8 rounded-xl bg-[#265728] text-white text-sm font-semibold hover:bg-[#1C431E] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
