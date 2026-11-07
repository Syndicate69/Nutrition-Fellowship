import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { RecentEventItem } from '../data/siteContent';
import { useSiteContent } from '../context/SiteContentContext';
import {
  getVisibleEventsWindow,
  stepCarouselIndex,
} from '../utils/siteLogic';
import { ResilientImage } from './ResilientImage';

interface EventsSectionProps {
  onSelectEvent: (event: RecentEventItem) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({
  onSelectEvent,
}) => {
  const { recentEvents, upcomingEvents, announcements } = useSiteContent();
  const [startIndex, setStartIndex] = useState(0);
  const [showAllGrid, setShowAllGrid] = useState(false);

  const visibleDesktopEvents = showAllGrid
    ? recentEvents
    : getVisibleEventsWindow(recentEvents, startIndex, 4);

  const handlePrev = () => {
    setStartIndex((prev) =>
      stepCarouselIndex(prev, -1, recentEvents.length)
    );
  };

  const handleNext = () => {
    setStartIndex((prev) =>
      stepCarouselIndex(prev, 1, recentEvents.length)
    );
  };

  return (
    <section
      id="events"
      aria-labelledby="events-heading"
      className="scroll-mt-20 py-24 bg-white"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-emerald-950/10"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-[#265728] font-semibold mb-2">
              Chronicle & Field Dispatches
            </p>
            <h2
              id="events-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F1C12] tracking-tight"
            >
              EVENTS AND UPDATES
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAllGrid((prev) => !prev)}
              className="px-4 py-2.5 text-xs font-semibold text-[#265728] bg-[#EAF2EA] hover:bg-[#d5e7d6] rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {showAllGrid
                ? 'Carousel View (4)'
                : `Show All ${recentEvents.length} Events`}
            </button>

            {!showAllGrid && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="← Previous"
                  className="px-3.5 py-2.5 rounded-xl border border-emerald-950/12 text-xs font-semibold text-[#0F1C12] hover:border-[#265728] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="→ Next"
                  className="px-3.5 py-2.5 rounded-xl border border-emerald-950/12 text-xs font-semibold text-[#0F1C12] hover:border-[#265728] transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Subheading: Recent Events + Index Pagination */}
        <div className="mt-8 mb-6 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-2xl font-semibold text-[#265728]">
            Recent Events
          </h3>
          {!showAllGrid && (
            <div
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label="Event slides"
            >
              {recentEvents.map((ev, idx) => {
                const isActive = startIndex === idx;
                return (
                  <button
                    key={ev.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setStartIndex(idx)}
                    aria-label={`Slide ${idx + 1}: ${ev.review}`}
                    className={`relative w-7 h-7 rounded-lg text-xs font-mono-tabular transition-colors cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'bg-[#265728] text-white font-semibold shadow-2xs'
                        : 'bg-[#F2F6F2] text-[#3F5243] hover:bg-[#EAF2EA]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Events Editorial Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {visibleDesktopEvents.map((eventItem, idx) => (
            <motion.article
              key={`${showAllGrid ? 'all' : startIndex}-${eventItem.id}-${idx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.2,
                ease: 'easeOut',
              }}
              className="bg-[#F7F9F7] border border-emerald-950/10 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-[#265728] hover:bg-white transition-colors duration-300 hover:shadow-lg"
            >
              <div>
                <div className="relative aspect-16/11 w-full overflow-hidden bg-[#112314] border-b border-emerald-950/8">
                  <ResilientImage
                    src={eventItem.img}
                    alt={eventItem.review}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <p className="font-mono-tabular text-xs font-semibold text-[#265728] mb-2">
                    {eventItem.date}
                  </p>
                  <h4 className="font-display text-lg font-semibold text-[#0F1C12] leading-snug line-clamp-2">
                    {eventItem.review}
                  </h4>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectEvent(eventItem)}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-emerald-950/12 group-hover:bg-[#265728] group-hover:border-[#265728] group-hover:text-white text-[#0F1C12] text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Two-Column Split: Upcoming Events & Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 border-t border-emerald-950/10"
        >
          {/* Upcoming Events (7 cols) */}
          <div className="lg:col-span-7">
            <h3 className="font-display text-2xl font-semibold text-[#0F1C12] mb-5">
              Upcoming Events
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {upcomingEvents.map((event, idx) => (
                <div
                  key={`${event.name}-${idx}`}
                  className="bg-[#F7F9F7] border border-emerald-950/10 rounded-3xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <p className="text-xs font-mono-tabular text-[#265728] font-semibold flex items-center gap-1.5 mb-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Date: {event.date}</span>
                    </p>
                    <h4 className="font-display text-lg font-semibold text-[#0F1C12] mb-2">
                      {event.name}
                    </h4>
                  </div>
                  <p className="text-sm text-[#3F5243] leading-relaxed">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Announcements (5 cols) */}
          <div className="lg:col-span-5">
            <h3 className="font-display text-2xl font-semibold text-[#0F1C12] mb-5">
              Announcements
            </h3>
            <div className="space-y-4">
              {announcements.map((announcement, idx) => (
                <div
                  key={`${announcement.title}-${idx}`}
                  className="bg-[#EAF2EA] border border-[#265728]/25 rounded-3xl p-6"
                >
                  <p className="text-xs font-mono-tabular text-[#265728] font-semibold flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Date: {announcement.date}</span>
                  </p>
                  <h4 className="font-display text-lg font-semibold text-[#0F1C12] mb-2">
                    {announcement.title}
                  </h4>
                  <p className="text-sm text-[#265728] leading-relaxed">
                    {announcement.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
