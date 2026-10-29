/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Calendar, FileText } from 'lucide-react';
import {
  DocumentLink,
  NAV_ITEMS,
  RecentEventItem,
} from './data/siteContent';
import { getDownloadFilename } from './utils/siteLogic';
import { Header } from './components/Header';
import { HeroAndHighlights } from './components/HeroAndHighlights';
import { InitiativesSection } from './components/InitiativesSection';
import { ResourcesSection } from './components/ResourcesSection';
import { EventsSection } from './components/EventsSection';
import { ThoughtsSection } from './components/ThoughtsSection';
import { Footer } from './components/Footer';
import { ResilientImage } from './components/ResilientImage';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [inspectedImage, setInspectedImage] = useState<{
    src: string;
    alt: string;
    caption?: string;
  } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{
    doc: DocumentLink;
    category: string;
  } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<RecentEventItem | null>(
    null
  );

  // Automatic Scroll-Spy to update active nav link fluidly as the user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 160) {
        setActiveSection('home');
        return;
      }
      const sectionIds = NAV_ITEMS.map((item) => item.sectionId).filter(
        (id) => id !== 'home'
      );
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 180) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (href: string, sectionId: string) => {
    setActiveSection(sectionId);
    if (href === '/' || sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F7] text-[#0F1C12]">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="flex-1">
        <HeroAndHighlights
          onInspectImage={(img) => setInspectedImage(img)}
        />
        <InitiativesSection />
        <ResourcesSection
          onOpenDocument={(doc, category) =>
            setSelectedDocument({ doc, category })
          }
        />
        <EventsSection
          onSelectEvent={(eventItem) => setSelectedEvent(eventItem)}
        />
        <ThoughtsSection />
      </main>

      <Footer />

      {/* Animated Lightbox Modal for Cover Slider Photos */}
      <AnimatePresence>
        {inspectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={inspectedImage.alt}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setInspectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl border border-emerald-950/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-emerald-950/10 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold text-[#0F1C12]">
                    {inspectedImage.alt}
                  </h3>
                  {inspectedImage.caption && (
                    <p className="text-xs text-[#3F5243]">
                      {inspectedImage.caption}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setInspectedImage(null)}
                  aria-label="Close image viewer"
                  className="p-2 rounded-xl text-[#3F5243] hover:text-[#0F1C12] hover:bg-[#F2F6F2] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 bg-[#F7F9F7] flex items-center justify-center max-h-[80vh] overflow-auto">
                <ResilientImage
                  src={inspectedImage.src}
                  alt={inspectedImage.alt}
                  className="max-h-[72vh] w-auto object-contain rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Document / Publication Viewer Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={selectedDocument.doc.title}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedDocument(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-emerald-950/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-emerald-950/10 flex items-center justify-between bg-[#F7F9F7]">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#265728]" />
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#0F1C12]">
                      {selectedDocument.doc.title}
                    </h3>
                    {selectedDocument.category && (
                      <p className="text-xs text-[#3F5243]">
                        {selectedDocument.category}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedDocument.doc.hasLocalPdf && (
                    <a
                      href={selectedDocument.doc.pdfUrl}
                      download={getDownloadFilename(
                        selectedDocument.doc.pdfUrl
                      )}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedDocument(null)}
                    aria-label="Close document viewer"
                    className="p-2 rounded-xl text-[#3F5243] hover:text-[#0F1C12] hover:bg-[#EAF2EA] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {selectedDocument.doc.hasLocalPdf ? (
                <div className="h-[75vh] bg-[#F7F9F7]">
                  <iframe
                    src={selectedDocument.doc.pdfUrl}
                    title={selectedDocument.doc.title}
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="p-12 text-center space-y-3 bg-[#F7F9F7]">
                  <h4 className="font-display text-2xl font-semibold text-[#265728]">
                    {selectedDocument.doc.comingSoonHeading}
                  </h4>
                  <p className="text-lg font-medium text-[#3F5243]">
                    {selectedDocument.doc.comingSoonStatus}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Event Detail Modal for "Read More" */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={selectedEvent.review}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-emerald-950/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-emerald-950/10 flex items-center justify-between bg-[#F7F9F7]">
                <div>
                  <p className="text-xs font-mono-tabular text-[#265728] font-semibold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedEvent.date}</span>
                  </p>
                  <h3 className="font-display text-xl font-semibold text-[#0F1C12] mt-0.5">
                    {selectedEvent.review}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  aria-label="Close event details"
                  className="p-2 rounded-xl text-[#3F5243] hover:text-[#0F1C12] hover:bg-[#EAF2EA] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 bg-[#F7F9F7] flex flex-col items-center">
                <ResilientImage
                  src={selectedEvent.img}
                  alt={selectedEvent.review}
                  className="max-h-[65vh] w-auto object-contain rounded-2xl border border-emerald-950/10"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
