import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Quote, User } from 'lucide-react';
import { TeamMemberItem } from '../data/siteContent';
import { useSiteContent } from '../context/SiteContentContext';
import { ResilientImage } from './ResilientImage';

export const TeamAndTestimonialsSection: React.FC = () => {
  const { testimonials, teamMembers } = useSiteContent();
  const [selectedGroup, setSelectedGroup] = useState<
    'All' | 'Guidance Group' | 'Core Group'
  >('All');

  const guidanceMembers = teamMembers.filter(
    (m) => m.group === 'Guidance Group'
  );
  const coreMembers = teamMembers.filter(
    (m) => (m.group || 'Core Group') === 'Core Group'
  );

  const renderMemberCard = (member: TeamMemberItem, idx: number) => (
    <motion.article
      key={member.id || idx}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.35, delay: idx * 0.04 }}
      className="bg-white border border-emerald-950/10 hover:border-[#265728] rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
    >
      <div>
        <div className="aspect-[4/3] w-full bg-[#EAF2EA] border-b border-emerald-950/8 overflow-hidden flex flex-col items-center justify-center relative">
          {member.photo ? (
            <ResilientImage
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#265728]/70 p-4 text-center">
              <div className="w-14 h-14 rounded-full bg-white/80 border border-[#265728]/20 flex items-center justify-center mb-2 shadow-2xs">
                <User className="w-6 h-6 text-[#265728]" />
              </div>
              <span className="text-xs font-semibold text-[#265728]">
                Photo Placeholder
              </span>
            </div>
          )}
          <span className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs border border-emerald-950/10 text-[#265728] text-[10px] font-semibold uppercase tracking-wider">
            {member.group || 'Core Group'}
          </span>
        </div>

        <div className="p-6 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#265728]">
            {member.role}
          </p>
          <h4 className="font-display text-xl font-semibold text-[#0F1C12]">
            {member.name}
          </h4>
          <p className="text-sm text-[#3F5243] leading-relaxed">
            {member.description}
          </p>
        </div>
      </div>
    </motion.article>
  );

  return (
    <>
      {/* Testimonials Section */}
      <section
        id="testimonials"
        aria-labelledby="testimonials-heading"
        className="scroll-mt-20 py-24 border-t border-emerald-950/10 bg-white"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-[#265728] font-semibold mb-2">
                Fellowship Voices & Reflections
              </p>
              <h2
                id="testimonials-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F1C12] tracking-tight"
              >
                TESTIMONIALS
              </h2>
            </div>
            <p className="text-sm text-[#3F5243] max-w-md">
              Perspectives from practitioners, researchers, and student fellows across generations
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item, idx) => (
              <motion.article
                key={item.id || idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="bg-[#F7F9F7] border border-emerald-950/10 hover:border-[#265728]/50 rounded-3xl p-7 flex flex-col justify-between gap-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-[#EAF2EA] text-[#265728] flex items-center justify-center">
                    <Quote className="w-4 h-4" />
                  </div>
                  <p className="text-sm sm:text-base text-[#3F5243] leading-relaxed italic">
                    “{item.description}”
                  </p>
                </div>

                <div className="pt-5 border-t border-emerald-950/8 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-[#EAF2EA] border border-emerald-950/10 flex flex-col items-center justify-center shrink-0">
                    {item.photo ? (
                      <ResilientImage
                        src={item.photo}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#265728]/70">
                        <User className="w-5 h-5" />
                        <span className="text-[9px] font-semibold uppercase tracking-wider mt-0.5">
                          Photo
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-lg font-semibold text-[#0F1C12] truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs font-medium text-[#265728] truncate">
                      {item.role}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section with Guidance Group & Core Group */}
      <section
        id="team"
        aria-labelledby="team-heading"
        className="scroll-mt-20 py-24 border-t border-emerald-950/10 bg-[#F2F6F2]"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-emerald-950/10 mb-12"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-[#265728] font-semibold mb-2">
                Stewardship & Coordination
              </p>
              <h2
                id="team-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0F1C12] tracking-tight"
              >
                OUR TEAM
              </h2>
            </div>

            {/* Category Filter Pill */}
            <div
              role="group"
              aria-label="Filter team by group"
              className="inline-flex flex-wrap items-center gap-1 p-1.5 bg-white rounded-2xl border border-emerald-950/10 shadow-2xs self-start md:self-auto"
            >
              {(['All', 'Guidance Group', 'Core Group'] as const).map((tab) => {
                const isSelected = selectedGroup === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setSelectedGroup(tab)}
                    className={`relative px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#265728] text-white shadow-2xs'
                        : 'text-[#3F5243] hover:text-[#0F1C12]'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <div className="space-y-16">
            {/* Category 1: Guidance Group (Senior Professionals) */}
            {(selectedGroup === 'All' ||
              selectedGroup === 'Guidance Group') && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
                  <div>
                    <span className="text-xs font-mono-tabular font-semibold uppercase tracking-widest text-[#265728] block mb-1">
                      01 · Senior Professionals & Strategic Mentors
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F1C12]">
                      Guidance Group
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#3F5243] max-w-md">
                    Senior professionals providing strategic stewardship, policy wisdom, and mentorship across generations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {guidanceMembers.map((member, idx) =>
                    renderMemberCard(member, idx)
                  )}
                </div>
              </div>
            )}

            {/* Category 2: Core Group (Core Working Group) */}
            {(selectedGroup === 'All' || selectedGroup === 'Core Group') && (
              <div
                className={
                  selectedGroup === 'All'
                    ? 'pt-12 border-t border-emerald-950/10'
                    : ''
                }
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
                  <div>
                    <span className="text-xs font-mono-tabular font-semibold uppercase tracking-widest text-[#265728] block mb-1">
                      02 · Core Working Group
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#0F1C12]">
                      Core Group
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#3F5243] max-w-md">
                    The core working group driving program coordination, field operations, and nutrition advocacy.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {coreMembers.map((member, idx) =>
                    renderMemberCard(member, idx)
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
