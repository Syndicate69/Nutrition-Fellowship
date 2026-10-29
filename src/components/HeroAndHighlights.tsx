import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import {
  ABOUT_US_CONTENT,
  HERO_SLIDER_IMAGES,
  KEY_HIGHLIGHTS,
  SITE_BRAND,
} from '../data/siteContent';
import { ResilientImage } from './ResilientImage';

interface HeroAndHighlightsProps {
  onInspectImage: (img: { src: string; alt: string; caption?: string }) => void;
}

export const HeroAndHighlights: React.FC<HeroAndHighlightsProps> = ({
  onInspectImage,
}) => {
  const [activeTab, setActiveTab] = useState<'value' | 'vision'>('value');
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [activePillar, setActivePillar] = useState<number>(0);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % HERO_SLIDER_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const pillars = ABOUT_US_CONTENT.ourVision.pillars;
  const activeSlide = HERO_SLIDER_IMAGES[photoIndex];

  const featuredHighlights = KEY_HIGHLIGHTS.slice(0, 2);
  const speechHighlights = KEY_HIGHLIGHTS.slice(2);

  return (
    <section
      id="aboutus"
      aria-label="About Us and Key Highlights"
      className="scroll-mt-24 relative overflow-hidden pt-10 pb-24"
    >
      {/* Subtle Ambient Botanical Backdrop */}
      <div
        className="pointer-events-none absolute -top-40 right-0 w-[640px] h-[640px] rounded-full bg-radial from-[#265728]/8 via-[#265728]/3 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10 relative">
        {/* Part 1: Hero Split with Fluid Motion Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pb-20 border-b border-emerald-950/10"
        >
          {/* Left 6 Columns: Value Proposition & Our Vision */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
            <div>
              {/* Segmented Control with Motion Pill */}
              <div className="inline-flex items-center gap-1 p-1.5 bg-white rounded-2xl border border-emerald-950/10 shadow-2xs mb-8">
                {(['value', 'vision'] as const).map((tabKey) => {
                  const label =
                    tabKey === 'value'
                      ? ABOUT_US_CONTENT.tabs.value
                      : ABOUT_US_CONTENT.tabs.vision;
                  const isSelected = activeTab === tabKey;
                  return (
                    <button
                      key={tabKey}
                      type="button"
                      onClick={() => setActiveTab(tabKey)}
                      className={`relative px-5 py-2.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'text-white'
                          : 'text-[#3F5243] hover:text-[#0F1C12]'
                      }`}
                    >
                      {isSelected && (
                        <motion.span
                          layoutId="heroTabIndicator"
                          transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 32,
                          }}
                          className="absolute inset-0 rounded-xl bg-[#265728] shadow-xs"
                          aria-hidden="true"
                        />
                      )}
                      <span className="relative z-10">{label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'value' ? (
                  <motion.div
                    key="value-tab"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-semibold text-[#0F1C12] tracking-tight leading-[1.08] text-balance">
                      {ABOUT_US_CONTENT.valueProposition.heading}
                    </h2>

                    <p className="font-display text-xl sm:text-2xl text-[#265728] leading-relaxed font-normal">
                      {ABOUT_US_CONTENT.valueProposition.paragraphs[0]}
                    </p>

                    <p className="text-base sm:text-lg text-[#3F5243] leading-relaxed max-w-xl">
                      {ABOUT_US_CONTENT.valueProposition.paragraphs[1]}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="vision-tab"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <blockquote className="font-display text-2xl sm:text-3xl italic text-[#0F1C12] leading-snug text-balance">
                      {ABOUT_US_CONTENT.ourVision.leftQuote}
                    </blockquote>

                    <p className="text-base sm:text-lg font-medium text-[#265728] leading-relaxed border-y border-emerald-950/10 py-4">
                      {ABOUT_US_CONTENT.ourVision.mainQuote}
                    </p>

                    {/* Interactive 5-Pillar Orbital Diagram */}
                    <div className="bg-white border border-emerald-950/10 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
                      <div className="relative w-56 h-56 shrink-0 flex items-center justify-center mx-auto">
                        <div
                          className="absolute w-40 h-40 rounded-full border border-dashed border-[#265728]/35"
                          aria-hidden="true"
                        />
                        <div className="relative z-10 w-16 h-16 rounded-full bg-white border border-emerald-950/10 shadow-sm flex items-center justify-center p-2">
                          <ResilientImage
                            src={SITE_BRAND.logoPrimary}
                            alt={SITE_BRAND.logoPrimaryAlt}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {pillars.map((pillar, index) => {
                          const angle = index * 72 - 90;
                          const isHighlighted = activePillar === index;
                          return (
                            <button
                              key={pillar}
                              type="button"
                              onMouseEnter={() => setActivePillar(index)}
                              onClick={() => setActivePillar(index)}
                              className={`absolute w-17 h-17 flex items-center justify-center rounded-full text-xs font-semibold transition-colors cursor-pointer shadow-xs ${
                                isHighlighted
                                  ? 'bg-[#265728] text-white border border-[#265728]'
                                  : 'bg-[#F2F6F2] text-[#265728] border border-[#265728]/25 hover:bg-[#265728] hover:text-white'
                              }`}
                              style={{
                                transform: `rotate(${angle}deg) translate(78px) rotate(${-angle}deg)`,
                              }}
                            >
                              {pillar}
                            </button>
                          );
                        })}
                      </div>

                      <div className="space-y-3 text-center sm:text-left">
                        <p className="text-xs uppercase tracking-widest text-[#265728] font-semibold">
                          Five Fellowship Pillars
                        </p>
                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-2 gap-y-1.5 text-sm font-display font-medium text-[#0F1C12]">
                          {pillars.map((pillar, i) => (
                            <React.Fragment key={pillar}>
                              <span
                                className={
                                  activePillar === i
                                    ? 'text-[#265728] font-bold underline underline-offset-4'
                                    : ''
                                }
                              >
                                {pillar}
                              </span>
                              {i < pillars.length - 1 && (
                                <span
                                  className="text-[#265728]/50"
                                  aria-hidden="true"
                                >
                                  ·
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Hero Action Row */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#initiatives"
                className="px-6 py-3 rounded-xl bg-[#265728] text-white text-xs sm:text-sm font-semibold hover:bg-[#1C431E] transition-all shadow-sm whitespace-nowrap shrink-0"
              >
                Explore Initiatives
              </a>
              <a
                href="#documents"
                className="px-6 py-3 rounded-xl bg-white border border-emerald-950/15 text-[#0F1C12] text-xs sm:text-sm font-semibold hover:border-[#265728] transition-all whitespace-nowrap shrink-0"
              >
                Resources & Publications
              </a>
              <button
                type="button"
                onClick={() =>
                  setActiveTab(activeTab === 'value' ? 'vision' : 'value')
                }
                className="px-3 py-2 text-xs font-semibold text-[#265728] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
              >
                {activeTab === 'value'
                  ? 'Our Vision & 5 Pillars →'
                  : '← Our Value Proposition'}
              </button>
            </div>
          </div>

          {/* Right 6 Columns: Unobstructed Natural-Aspect Photo Showcase */}
          <div className="lg:col-span-6">
            <div
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className="bg-white border border-emerald-950/10 rounded-3xl p-4 sm:p-5 shadow-md"
            >
              <div
                onClick={() => onInspectImage(activeSlide)}
                className="relative w-full h-[280px] sm:h-[380px] rounded-2xl overflow-hidden bg-[#9BC48F] border border-emerald-950/8 cursor-pointer group"
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={activeSlide.src}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                  >
                    <ResilientImage
                      src={activeSlide.src}
                      alt={activeSlide.alt}
                      className="w-full h-full object-contain mx-auto block transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Minimal Editorial Caption & Visual Preview Switcher */}
              <div className="mt-3.5 pt-3.5 border-t border-emerald-950/8 flex items-center justify-between gap-4 h-11">
                <div className="min-w-0 flex-1">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={activeSlide.src}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.25 }}
                      className="font-display text-sm sm:text-base italic text-[#265728] truncate"
                    >
                      {activeSlide.caption}
                    </motion.p>
                  </AnimatePresence>
                </div>

                <div
                  className="flex items-center gap-2 shrink-0"
                  role="tablist"
                  aria-label="Featured gallery images"
                >
                  {HERO_SLIDER_IMAGES.map((slide, idx) => {
                    const isCurrent = photoIndex === idx;
                    return (
                      <button
                        key={slide.src}
                        type="button"
                        role="tab"
                        aria-selected={isCurrent}
                        aria-label={slide.caption || slide.alt}
                        onClick={() => setPhotoIndex(idx)}
                        className={`relative w-14 h-9 rounded-xl overflow-hidden transition-all cursor-pointer ${
                          isCurrent
                            ? 'ring-2 ring-[#265728] ring-offset-2 ring-offset-white opacity-100 scale-105'
                            : 'opacity-55 hover:opacity-90 border border-emerald-950/10'
                        }`}
                      >
                        <ResilientImage
                          src={slide.src}
                          alt={slide.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Part 2: Asymmetric Bento Grid for Key Highlights with Immediate Scroll Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pt-16"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#265728] font-semibold mb-2">
                Featured Portals, Proceedings & Keynote Speeches
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#0F1C12] tracking-tight">
                Key Highlights
              </h1>
            </div>
            <p className="text-sm text-[#3F5243]">
              Direct access to the Nepal Nutrition Dashboard and 2nd Nutrition Fellowship meeting archives
            </p>
          </div>

          {/* Top Row: 2 Wide Featured Highlights (Dashboard & Jan 17 Documents) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {featuredHighlights.map((highlight, idx) => (
              <motion.a
                key={highlight.id}
                href={highlight.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="lg:col-span-6 group bg-white border border-emerald-950/10 hover:border-[#265728] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-full sm:w-52 h-40 rounded-2xl overflow-hidden bg-[#F2F6F2] border border-emerald-950/8 shrink-0">
                  <ResilientImage
                    src={highlight.image}
                    alt={highlight.topic}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                  <div>
                    <span className="font-mono-tabular text-xs font-semibold text-[#265728] block mb-2">
                      0{idx + 1} · Featured Resource
                    </span>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#0F1C12] group-hover:text-[#265728] transition-colors">
                        {highlight.topic}
                      </h3>
                      <span className="w-9 h-9 rounded-full bg-[#F2F6F2] group-hover:bg-[#265728] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                    <p className="text-sm text-[#3F5243] mt-2 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Bottom Row: 3 Keynote Speech Cards with Proper Portrait Framing (object-top) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {speechHighlights.map((highlight, idx) => (
              <motion.a
                key={highlight.id}
                href={highlight.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group bg-white border border-emerald-950/10 hover:border-[#265728] rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 w-full overflow-hidden bg-[#142616] border-b border-emerald-950/8">
                  <ResilientImage
                    src={highlight.image}
                    alt={highlight.topic}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-xs text-white font-mono-tabular text-xs">
                    0{idx + 3} · Keynote Speech
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl font-semibold text-[#0F1C12] group-hover:text-[#265728] transition-colors">
                        {highlight.topic}
                      </h3>
                      <span className="w-8 h-8 rounded-full bg-[#F2F6F2] group-hover:bg-[#265728] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                    <p className="text-sm text-[#3F5243] mt-2 leading-relaxed">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
