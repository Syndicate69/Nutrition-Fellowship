import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { INITIATIVES } from '../data/siteContent';
import { ResilientImage } from './ResilientImage';

export const InitiativesSection: React.FC = () => {
  return (
    <section
      id="initiatives"
      aria-labelledby="initiatives-heading"
      className="scroll-mt-20 py-24 bg-[#112314] text-white relative overflow-hidden"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-14 border-b border-white/15"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-[#9AD09C] font-semibold mb-2">
              Action Pillars & Workstreams
            </p>
            <h2
              id="initiatives-heading"
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight"
            >
              PROJECTS AND INITIATIVES
            </h2>
          </div>
          <p className="text-sm sm:text-base text-white/75 max-w-md leading-relaxed">
            Uniting students, researchers, and policy leaders across three core workstreams to accelerate nutrition outcomes in Nepal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {INITIATIVES.map((item, index) => (
            <motion.a
              key={item.title}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{
                duration: 0.45,
                delay: index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 hover:border-[#9AD09C]/60 rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4 mb-12">
                <div className="w-24 h-24 rounded-2xl bg-white p-3.5 flex items-center justify-center shadow-lg">
                  <ResilientImage
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="font-mono-tabular text-sm text-[#9AD09C]">
                  0{index + 1}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-white group-hover:text-[#9AD09C] transition-colors">
                    {item.title}
                  </h3>
                  <span className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-[#265728] group-hover:border-[#265728] transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/65 mt-3">
                  Explore initiative repository & documentation
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
