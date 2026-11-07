import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, Eye, ArrowUpRight } from 'lucide-react';
import { DocumentLink } from '../data/siteContent';
import { useSiteContent } from '../context/SiteContentContext';
import {
  filterDocumentsByCategory,
  getDownloadFilename,
} from '../utils/siteLogic';

interface ResourcesSectionProps {
  onOpenDocument: (doc: DocumentLink, category: string) => void;
}

export const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  onOpenDocument,
}) => {
  const { documentsRepository } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categoryTabs = [
    'All',
    ...documentsRepository.map((c) => c.category),
  ];

  const filteredCategories = filterDocumentsByCategory(
    documentsRepository,
    selectedCategory
  );

  const handleDownload = (link: DocumentLink) => {
    if (link.hasLocalPdf && link.pdfUrl) {
      const a = document.createElement('a');
      a.href = link.pdfUrl;
      a.download = getDownloadFilename(link.pdfUrl);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      onOpenDocument(link, '');
    }
  };

  return (
    <section
      id="documents"
      aria-labelledby="resources-heading"
      className="scroll-mt-20 py-24 bg-[#F7F9F7] border-b border-emerald-950/10"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-emerald-950/10"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-[#265728] font-semibold mb-2">
              Archive & Knowledge Repository
            </p>
            <h2
              id="resources-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F1C12] tracking-tight"
            >
              RESOURCES & PUBLICATIONS
            </h2>
          </div>

          {/* Interactive Filter Controls with Motion Pill */}
          <div
            role="group"
            aria-label="Filter resources by category"
            className="flex flex-wrap items-center gap-1 p-1.5 bg-white rounded-2xl border border-emerald-950/10 shadow-2xs"
          >
            {categoryTabs.map((tab) => {
              const isSelected = selectedCategory === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedCategory(tab)}
                  className={`relative px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isSelected
                      ? 'text-white'
                      : 'text-[#3F5243] hover:text-[#0F1C12]'
                  }`}
                >
                  {isSelected && (
                    <motion.span
                      layoutId="resourceFilterIndicator"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-xl bg-[#265728] shadow-xs"
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Editorial Ledger Layout with Motion Entrance */}
        <div className="divide-y divide-emerald-950/10">
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((docCategory, idx) => (
              <motion.div
                key={docCategory.category}
                layout
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
              >
                {/* Left 4 Columns: Category Title & Count */}
                <div className="lg:col-span-4 flex items-baseline gap-3">
                  <span className="font-mono-tabular text-xs text-[#265728] font-semibold">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[#0F1C12]">
                      {docCategory.category}
                    </h3>
                    <p className="text-xs text-[#3F5243] mt-1">
                      {docCategory.links.length}{' '}
                      {docCategory.links.length === 1
                        ? 'publication indexed'
                        : 'publications indexed'}
                    </p>
                  </div>
                </div>

                {/* Right 8 Columns: Publication Rows */}
                <ul className="lg:col-span-8 bg-white border border-emerald-950/10 rounded-3xl divide-y divide-emerald-950/8 overflow-hidden shadow-xs">
                  {docCategory.links.map((link) => (
                    <li key={link.title}>
                      <div className="flex items-center justify-between px-6 py-5 hover:bg-[#F7F9F7] transition-colors">
                        <button
                          type="button"
                          onClick={() =>
                            onOpenDocument(link, docCategory.category)
                          }
                          className="flex-1 flex items-center gap-4 text-left group cursor-pointer pr-4"
                        >
                          <div className="w-11 h-11 rounded-2xl bg-[#EAF2EA] text-[#265728] flex items-center justify-center shrink-0 group-hover:bg-[#265728] group-hover:text-white transition-colors">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-display text-base sm:text-lg font-semibold text-[#0F1C12] group-hover:text-[#265728] transition-colors">
                              {link.title}
                            </p>
                            <p className="text-xs text-[#3F5243] mt-0.5">
                              {docCategory.category} ·{' '}
                              {link.hasLocalPdf
                                ? 'PDF Document Available'
                                : link.comingSoonHeading}
                            </p>
                          </div>
                        </button>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              onOpenDocument(link, docCategory.category)
                            }
                            aria-label={`View ${link.title}`}
                            className="px-3.5 py-2 rounded-xl border border-emerald-950/12 text-xs font-semibold text-[#0F1C12] hover:border-[#265728] hover:text-[#265728] transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownload(link)}
                            aria-label={`Download ${link.title}`}
                            className="p-2.5 rounded-xl bg-[#EAF2EA] text-[#265728] hover:bg-[#265728] hover:text-white transition-colors cursor-pointer"
                            title={
                              link.hasLocalPdf
                                ? 'Download PDF'
                                : 'Open publication details'
                            }
                          >
                            {link.hasLocalPdf ? (
                              <Download className="w-4 h-4" />
                            ) : (
                              <ArrowUpRight className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
