import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import { Mail, Facebook, Twitter, Instagram, Menu, X } from 'lucide-react';
import { NAV_ITEMS, SITE_BRAND } from '../data/siteContent';
import { ResilientImage } from './ResilientImage';

interface HeaderProps {
  activeSection: string;
  onNavigate: (href: string, sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    sectionId: string
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate(href, sectionId);
  };

  return (
    <header
      id="navbar"
      className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-emerald-950/8"
    >
      {/* Smooth Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX }}
        className="h-0.5 bg-gradient-to-r from-[#265728] via-[#3d8b40] to-[#d97706] origin-left"
      />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark & Original Logo */}
        <a
          href="/"
          onClick={(e) => handleNavClick(e, '/', 'home')}
          className="flex items-center gap-3.5 group focus-visible:outline-2 focus-visible:outline-[#265728] rounded-xl shrink-0"
        >
          <ResilientImage
            src={SITE_BRAND.logoPrimary}
            alt={SITE_BRAND.logoPrimaryAlt}
            className="h-12 sm:h-13 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-lg sm:text-xl font-semibold tracking-tight text-[#0F1C12] whitespace-nowrap shrink-0">
            Nutrition Fellowship
          </span>
        </a>

        {/* Zone 2: Clean Single-Line Navigation Links with Animated Active Indicator */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-0.5 p-1 rounded-2xl bg-[#F2F6F2] border border-emerald-950/6"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.sectionId;
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
                className={`relative px-3 py-1.5 text-[11px] tracking-wide font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-[#3F5243] hover:text-[#0F1C12]'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-[#265728] shadow-xs"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Social Channels & Direct Email Action */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-0.5">
            <a
              href={SITE_BRAND.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 flex items-center justify-center rounded-xl text-[#3F5243] hover:text-[#265728] hover:bg-[#EAF1EA] transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={SITE_BRAND.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 flex items-center justify-center rounded-xl text-[#3F5243] hover:text-[#265728] hover:bg-[#EAF1EA] transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={SITE_BRAND.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-8 h-8 flex items-center justify-center rounded-xl text-[#3F5243] hover:text-[#265728] hover:bg-[#EAF1EA] transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>

          <a
            href={SITE_BRAND.emailComposeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={SITE_BRAND.email}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] transition-all shadow-xs whitespace-nowrap shrink-0"
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">{SITE_BRAND.email}</span>
          </a>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={
              isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={isMobileMenuOpen}
            className="xl:hidden w-10 h-10 flex items-center justify-center rounded-xl text-[#0F1C12] hover:bg-[#EAF1EA] transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            aria-label="Mobile Navigation"
            className="xl:hidden bg-white border-b border-emerald-950/10 px-4 py-4 space-y-1 shadow-lg overflow-hidden"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.sectionId;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#265728] text-white font-semibold'
                      : 'text-[#0F1C12] hover:bg-[#F2F6F2]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};
