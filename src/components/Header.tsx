import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'motion/react';
import { Mail, Facebook, Twitter, Instagram, Linkedin, Menu, X } from 'lucide-react';
import { NAV_ITEMS, SITE_BRAND } from '../data/siteContent';
import { ResilientImage } from './ResilientImage';

interface HeaderProps {
  activeSection: string;
  onNavigate: (href: string, sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const navRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; ready: boolean }>({
    left: 4,
    width: 60,
    ready: false,
  });

  const updatePillPosition = () => {
    const navEl = navRef.current;
    const activeEl = itemRefs.current[activeSection] || itemRefs.current['home'];
    if (!navEl || !activeEl) return;

    const left = activeEl.offsetLeft;
    const width = activeEl.offsetWidth;
    setPillStyle({ left, width, ready: true });

    // Keep the active pill centered inside the horizontal scroll bar on smaller screens
    if (navEl.scrollWidth > navEl.clientWidth) {
      const targetScrollLeft = Math.max(
        0,
        left - navEl.clientWidth / 2 + width / 2
      );
      navEl.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    updatePillPosition();
  }, [activeSection]);

  useEffect(() => {
    const handleResize = () => updatePillPosition();
    window.addEventListener('resize', handleResize);
    let observer: ResizeObserver | null = null;
    if (navRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => updatePillPosition());
      observer.observe(navRef.current);
    }
    return () => {
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, [activeSection]);

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
      className="sticky top-0 z-40 bg-white backdrop-blur-xl border-b border-emerald-950/8"
    >
      {/* Direct Zero-Lag Scroll Progress Indicator */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="h-0.5 bg-gradient-to-r from-[#265728] via-[#3d8b40] to-[#d97706] origin-left"
      />

      <div className="max-w-[1420px] mx-auto px-3 sm:px-5 lg:px-6 py-2 xl:py-0 xl:h-22 flex flex-wrap xl:flex-nowrap items-center justify-between gap-y-2.5 gap-x-3">
        {/* Zone 1: Brand Wordmark & Original Logo */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, '#home', 'home')}
          className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-[#265728] rounded-xl shrink-0 bg-white"
        >
          <ResilientImage
            src={SITE_BRAND.logoPrimary}
            alt={SITE_BRAND.logoPrimaryAlt}
            className="h-14 sm:h-16 w-auto object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col justify-center">
            <span className="font-display text-base sm:text-[19px] font-semibold tracking-tight text-[#0F1C12] leading-none whitespace-nowrap shrink-0">
              Nutrition Fellowship
            </span>
            <span className="text-[9px] sm:text-[10px] italic text-[#265728] leading-tight whitespace-nowrap mt-1">
              An Initiative of SidArt Foundation
            </span>
          </div>
        </a>

        {/* Zone 2: Pill Navigation Bar — Evenly Distributed with Zero Trailing Empty Space */}
        <nav
          ref={navRef}
          aria-label="Primary Navigation"
          className="order-3 w-full xl:order-none xl:flex-1 xl:max-w-[830px] 2xl:max-w-[900px] relative flex items-center justify-between gap-0.5 p-1 rounded-2xl bg-[#F2F6F2] border border-emerald-950/8 overflow-x-auto xl:overflow-visible no-scrollbar"
        >
          {/* Lock-Step Horizontal Sliding Active Pill (Immune to Vertical Window Scroll Drift) */}
          <span
            aria-hidden="true"
            style={{
              transform: `translateX(${pillStyle.left}px)`,
              width: `${pillStyle.width}px`,
              opacity: pillStyle.ready ? 1 : 0,
            }}
            className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-xl bg-[#265728] shadow-xs transition-[transform,width,opacity] duration-250 ease-out"
          />

          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.sectionId;
            return (
              <a
                key={item.sectionId}
                ref={(el) => {
                  itemRefs.current[item.sectionId] = el;
                }}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.sectionId)}
                className={`relative z-10 flex-1 text-center px-2.5 xl:px-2 2xl:px-3 py-1.5 text-[10.5px] xl:text-[10.5px] 2xl:text-[11px] tracking-normal font-semibold rounded-xl whitespace-nowrap shrink-0 transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-[#3F5243] hover:text-[#0F1C12]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Social Channels & Direct Email Action */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
              href={SITE_BRAND.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 flex items-center justify-center rounded-xl text-[#3F5243] hover:text-[#265728] hover:bg-[#EAF1EA] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
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
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] transition-all shadow-xs whitespace-nowrap shrink-0"
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline xl:hidden 2xl:inline">{SITE_BRAND.email}</span>
            <span className="hidden sm:inline md:hidden xl:inline 2xl:hidden">Email</span>
          </a>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={
              isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={isMobileMenuOpen}
            className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#0F1C12] hover:bg-[#EAF1EA] transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Compact Mobile Drawer for Social Links & Quick Jump on Phones */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden bg-white border-b border-emerald-950/10 px-4 py-3 space-y-3 shadow-lg overflow-hidden"
          >
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-[#3F5243]">
                Connect with us
              </span>
              <div className="flex items-center gap-1.5">
                <a
                  href={SITE_BRAND.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Mobile Facebook"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F2F6F2] text-[#265728]"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={SITE_BRAND.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Mobile Instagram"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F2F6F2] text-[#265728]"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={SITE_BRAND.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Mobile LinkedIn"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F2F6F2] text-[#265728]"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href={SITE_BRAND.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Mobile Twitter"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F2F6F2] text-[#265728]"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
