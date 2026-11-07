import React from 'react';
import { Facebook, Instagram, Linkedin, Twitter, Mail, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { FOOTER_CONTENT, SITE_BRAND } from '../data/siteContent';
import { ResilientImage } from './ResilientImage';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  return (
    <footer className="bg-[#141E15] text-white border-t border-[#265728]/30">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/15">
          {/* Brand & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-block bg-white p-3 rounded-2xl shadow-xs">
              <ResilientImage
                src={SITE_BRAND.logoFooter}
                alt={SITE_BRAND.logoFooterAlt}
                className="h-20 sm:h-24 w-auto object-contain mix-blend-multiply"
              />
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-md">
              {FOOTER_CONTENT.description}
            </p>
          </div>

          {/* Useful Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-display text-base font-semibold text-white">
              {FOOTER_CONTENT.usefulLinksHeading}
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_CONTENT.usefulLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-75" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-display text-base font-semibold text-white">
              {FOOTER_CONTENT.getInTouchHeading}
            </h4>
            <div className="flex items-center gap-3">
              <a
                href={SITE_BRAND.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Footer Facebook"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#265728] flex items-center justify-center text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={SITE_BRAND.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Footer Instagram"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#265728] flex items-center justify-center text-white transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={SITE_BRAND.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Footer LinkedIn"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#265728] flex items-center justify-center text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={SITE_BRAND.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Footer Twitter"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#265728] flex items-center justify-center text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/75">
          <p className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            <Mail className="w-3.5 h-3.5 text-[#bad8bb]" />
            <span>{FOOTER_CONTENT.queriesPrefix}</span>
            <a
              href={SITE_BRAND.emailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#bad8bb] hover:underline font-medium"
            >
              {SITE_BRAND.email}
            </a>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <p>
              {FOOTER_CONTENT.copyrightPrefix}{' '}
              <a
                href="#navbar"
                className="text-[#bad8bb] hover:underline font-medium"
              >
                {FOOTER_CONTENT.copyrightOrg}
              </a>
            </p>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#265728] text-white/90 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#bad8bb]" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
