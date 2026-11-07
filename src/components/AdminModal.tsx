import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  CheckCircle2,
  AlertCircle,
  Lock,
  LogOut,
  ShieldCheck,
  Image as ImageIcon,
  FileText,
  Calendar,
  Users,
  MessageSquareQuote,
  Sparkles,
  Layers,
  Save,
} from 'lucide-react';
import {
  HeroSlideItem,
  useSiteContent,
} from '../context/SiteContentContext';
import {
  AnnouncementItem,
  DocumentCategory,
  HighlightItem,
  InitiativeItem,
  RecentEventItem,
  TeamMemberItem,
  TestimonialItem,
  UpcomingEventItem,
} from '../data/siteContent';
import { ResilientImage } from './ResilientImage';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTabId =
  | 'speeches'
  | 'testimonials'
  | 'team'
  | 'hero'
  | 'highlights'
  | 'initiatives'
  | 'resources'
  | 'events';

interface FlatResourceRow {
  category: string;
  title: string;
  pdfUrl: string;
  hasLocalPdf: boolean;
  comingSoonHeading: string;
}

/**
 * Compresses an uploaded image file via HTML5 canvas so it fits comfortably
 * inside Firestore's document field size limits (< 150KB data URL).
 */
async function compressImageFileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid image format'));
      img.onload = () => {
        const maxDim = 760;
        let width = img.width;
        let height = img.height;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        let quality = 0.78;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > 260000 && quality > 0.35) {
          quality -= 0.12;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
    heroSlides,
    keyHighlights,
    initiatives,
    documentsRepository,
    recentEvents,
    upcomingEvents,
    announcements,
    testimonials,
    teamMembers,
    currentUser,
    isAdminUser,
    isSyncing,
    signInAdmin,
    signOutAdmin,
    saveHeroSlides,
    saveKeyHighlights,
    saveInitiatives,
    saveDocumentsRepository,
    saveRecentEvents,
    saveUpcomingEvents,
    saveAnnouncements,
    saveTestimonials,
    saveTeamMembers,
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<AdminTabId>('speeches');
  const [eventsSubTab, setEventsSubTab] = useState<
    'recent' | 'upcoming' | 'announcements'
  >('recent');
  const [previewUnlocked, setPreviewUnlocked] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Local editable drafts
  const [draftTestimonials, setDraftTestimonials] =
    useState<TestimonialItem[]>(testimonials);
  const [draftTeam, setDraftTeam] = useState<TeamMemberItem[]>(teamMembers);
  const [draftHero, setDraftHero] = useState<HeroSlideItem[]>(heroSlides);
  const [draftPortals, setDraftPortals] = useState<HighlightItem[]>(
    keyHighlights.filter((h, idx) => !h.isSpeech && idx < 2)
  );
  const [draftSpeeches, setDraftSpeeches] = useState<HighlightItem[]>(
    keyHighlights.filter((h, idx) => Boolean(h.isSpeech || idx >= 2))
  );
  const [draftInitiatives, setDraftInitiatives] =
    useState<InitiativeItem[]>(initiatives);
  const [draftResources, setDraftResources] = useState<FlatResourceRow[]>([]);
  const [draftRecentEvents, setDraftRecentEvents] =
    useState<RecentEventItem[]>(recentEvents);
  const [draftUpcomingEvents, setDraftUpcomingEvents] =
    useState<UpcomingEventItem[]>(upcomingEvents);
  const [draftAnnouncements, setDraftAnnouncements] =
    useState<AnnouncementItem[]>(announcements);

  // Sync local drafts when modal opens or context data updates
  useEffect(() => {
    if (!isOpen) return;
    setDraftTestimonials(testimonials);
    setDraftTeam(teamMembers);
    setDraftHero(heroSlides);
    setDraftPortals(keyHighlights.filter((h, idx) => !h.isSpeech && idx < 2));
    setDraftSpeeches(
      keyHighlights.filter((h, idx) => Boolean(h.isSpeech || idx >= 2))
    );
    setDraftInitiatives(initiatives);
    setDraftRecentEvents(recentEvents);
    setDraftUpcomingEvents(upcomingEvents);
    setDraftAnnouncements(announcements);

    const flatDocs: FlatResourceRow[] = [];
    for (const cat of documentsRepository) {
      for (const link of cat.links) {
        flatDocs.push({
          category: cat.category,
          title: link.title,
          pdfUrl: link.pdfUrl,
          hasLocalPdf: link.hasLocalPdf,
          comingSoonHeading: link.comingSoonHeading,
        });
      }
    }
    setDraftResources(flatDocs);
  }, [
    isOpen,
    testimonials,
    teamMembers,
    heroSlides,
    keyHighlights,
    initiatives,
    documentsRepository,
    recentEvents,
    upcomingEvents,
    announcements,
  ]);

  if (!isOpen) return null;

  const canEdit = isAdminUser || previewUnlocked;

  const showMessage = (type: 'success' | 'error', message: string) => {
    setStatusBanner({ type, message });
    window.setTimeout(() => {
      setStatusBanner((prev) => (prev?.message === message ? null : prev));
    }, 5000);
  };

  const handleGoogleSignIn = async () => {
    try {
      setStatusBanner(null);
      await signInAdmin();
      showMessage('success', 'Signed in with Google successfully.');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Google Sign-In could not complete.';
      showMessage(
        'error',
        `Sign-in notice: ${msg}. You can also use "Unlock Local Preview Editor" below to test editing immediately.`
      );
    }
  };

  const handlePhotoUpload = async (
    file: File | undefined,
    onUrlReady: (dataUrl: string) => void
  ) => {
    if (!file) return;
    try {
      const compressed = await compressImageFileToDataUrl(file);
      onUrlReady(compressed);
      showMessage('success', 'Photo uploaded and optimized automatically.');
    } catch (err) {
      showMessage(
        'error',
        err instanceof Error ? err.message : 'Could not process image file.'
      );
    }
  };

  const handleSaveCurrentTab = async () => {
    setStatusBanner(null);
    const persistToCloud = isAdminUser;
    try {
      if (activeTab === 'testimonials') {
        await saveTestimonials(draftTestimonials, persistToCloud);
      } else if (activeTab === 'team') {
        await saveTeamMembers(draftTeam, persistToCloud);
      } else if (activeTab === 'hero') {
        await saveHeroSlides(draftHero, persistToCloud);
      } else if (activeTab === 'highlights' || activeTab === 'speeches') {
        const combinedHighlights: HighlightItem[] = [
          ...draftPortals.map((p) => ({ ...p, isSpeech: false })),
          ...draftSpeeches.map((s) => ({
            ...s,
            isSpeech: true,
            fullText: s.fullText || s.description,
          })),
        ];
        await saveKeyHighlights(combinedHighlights, persistToCloud);
      } else if (activeTab === 'initiatives') {
        await saveInitiatives(draftInitiatives, persistToCloud);
      } else if (activeTab === 'resources') {
        const grouped = new Map<string, DocumentCategory>();
        for (const row of draftResources) {
          const catName = row.category.trim() || 'Reports';
          if (!grouped.has(catName)) {
            grouped.set(catName, { category: catName, links: [] });
          }
          grouped.get(catName)!.links.push({
            title: row.title.trim() || 'Untitled Document',
            path: `/${(row.title || 'doc').toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
            pdfUrl: row.pdfUrl.trim(),
            hasLocalPdf: row.hasLocalPdf,
            comingSoonHeading: row.comingSoonHeading.trim() || row.title.trim(),
            comingSoonStatus: row.hasLocalPdf ? 'Available' : 'Coming soon.....',
          });
        }
        await saveDocumentsRepository(
          Array.from(grouped.values()),
          persistToCloud
        );
      } else if (activeTab === 'events') {
        if (eventsSubTab === 'recent') {
          await saveRecentEvents(draftRecentEvents, persistToCloud);
        } else if (eventsSubTab === 'upcoming') {
          await saveUpcomingEvents(draftUpcomingEvents, persistToCloud);
        } else {
          await saveAnnouncements(draftAnnouncements, persistToCloud);
        }
      }

      showMessage(
        'success',
        persistToCloud
          ? 'Saved and published live to Cloud Firestore!'
          : 'Updated live on the page (sign in with an authorized Google account to persist permanently to Cloud Firestore).'
      );
    } catch (err) {
      showMessage(
        'error',
        err instanceof Error ? err.message : 'Failed to save changes.'
      );
    }
  };

  const navTabs: { id: AdminTabId; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: 'speeches',
      label: 'Keynote Speeches',
      icon: <Sparkles className="w-4 h-4" />,
      count: draftSpeeches.length,
    },
    {
      id: 'testimonials',
      label: 'Testimonials',
      icon: <MessageSquareQuote className="w-4 h-4" />,
      count: draftTestimonials.length,
    },
    {
      id: 'team',
      label: 'Our Team',
      icon: <Users className="w-4 h-4" />,
      count: draftTeam.length,
    },
    {
      id: 'hero',
      label: 'Hero Slider Photos',
      icon: <ImageIcon className="w-4 h-4" />,
      count: draftHero.length,
    },
    {
      id: 'highlights',
      label: 'Featured Portals',
      icon: <Layers className="w-4 h-4" />,
      count: draftPortals.length,
    },
    {
      id: 'initiatives',
      label: 'Projects & Initiatives',
      icon: <Layers className="w-4 h-4" />,
      count: draftInitiatives.length,
    },
    {
      id: 'resources',
      label: 'Resources & PDFs',
      icon: <FileText className="w-4 h-4" />,
      count: draftResources.length,
    },
    {
      id: 'events',
      label: 'Events & Updates',
      icon: <Calendar className="w-4 h-4" />,
      count:
        draftRecentEvents.length +
        draftUpcomingEvents.length +
        draftAnnouncements.length,
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label="Nutrition Fellowship Admin Panel"
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-emerald-950/15"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header Bar */}
          <div className="px-5 sm:px-7 py-4 bg-[#112314] text-white flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#265728] flex items-center justify-center text-[#9AD09C]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display text-lg sm:text-xl font-semibold text-white">
                  Nutrition Fellowship · No-Code Content Manager
                </h2>
                <p className="text-xs text-white/70">
                  Add or edit photos, testimonials, team members, PDFs, and events without touching code
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {currentUser ? (
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs">
                  <span className="text-white/90 truncate max-w-[180px]">
                    {currentUser.email}
                  </span>
                  {isAdminUser ? (
                    <span className="px-2 py-0.5 rounded-md bg-[#265728] text-[#9AD09C] font-semibold text-[10px] uppercase">
                      Verified Admin
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-200 font-semibold text-[10px] uppercase">
                      Read-Only Account
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={signOutAdmin}
                    className="p-1 text-white/70 hover:text-white cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Admin Panel"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Status Banner */}
          {statusBanner && (
            <div
              className={`px-6 py-3 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 ${
                statusBanner.type === 'success'
                  ? 'bg-[#EAF2EA] text-[#1C431E] border-b border-[#265728]/20'
                  : 'bg-red-50 text-red-800 border-b border-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {statusBanner.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#265728] shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{statusBanner.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setStatusBanner(null)}
                className="text-xs underline cursor-pointer shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Authentication Gate or Main Editor */}
          {!canEdit ? (
            <div className="p-8 sm:p-12 bg-[#F7F9F7] flex-1 overflow-y-auto flex flex-col items-center justify-center text-center">
              <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-emerald-950/10 shadow-sm space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-[#EAF2EA] text-[#265728] flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-display text-2xl font-semibold text-[#0F1C12]">
                    Administrator Sign-In
                  </h3>
                  <p className="text-sm text-[#3F5243] leading-relaxed">
                    Sign in with your authorized Google account (
                    <span className="font-semibold text-[#0F1C12]">
                      nutfellowship@gmail.com
                    </span>{' '}
                    or{' '}
                    <span className="font-semibold text-[#0F1C12]">
                      sth.rajon@gmail.com
                    </span>
                    ) to publish changes directly to the live Cloud Firestore database.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-3.5 px-5 rounded-xl bg-[#265728] hover:bg-[#1C431E] text-white font-semibold text-sm transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewUnlocked(true)}
                    className="w-full py-3 px-5 rounded-xl bg-[#F2F6F2] hover:bg-[#EAF2EA] text-[#265728] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Unlock Local Preview Editor (Test Without Sign-In)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden bg-[#F7F9F7]">
              {/* Left Sidebar Navigation */}
              <div className="lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-emerald-950/10 p-3 sm:p-4 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-y-auto shrink-0">
                {navTabs.map((tab) => {
                  const isCurrent = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                        isCurrent
                          ? 'bg-[#265728] text-white shadow-2xs'
                          : 'text-[#3F5243] hover:bg-[#F2F6F2] hover:text-[#0F1C12]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono-tabular ${
                          isCurrent
                            ? 'bg-white/20 text-white'
                            : 'bg-[#F2F6F2] text-[#265728]'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Right Content Editor Pane */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                  {/* TAB 1: TESTIMONIALS */}
                  {activeTab === 'testimonials' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-[#0F1C12]">
                            Manage Testimonials ({draftTestimonials.length})
                          </h3>
                          <p className="text-xs text-[#3F5243]">
                            Upload a portrait photo from your computer or paste an image link, and edit each fellow’s quote.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setDraftTestimonials((prev) => [
                              ...prev,
                              {
                                id: Date.now(),
                                name: 'New Fellow Name',
                                role: 'Role · Generation',
                                photo: '',
                                description: 'Write the testimonial reflection here...',
                              },
                            ])
                          }
                          className="px-4 py-2 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Testimonial</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {draftTestimonials.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-950/10 shadow-2xs space-y-4"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-emerald-950/8 pb-3">
                              <span className="text-xs font-semibold text-[#265728]">
                                Testimonial #{idx + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const copy = [...draftTestimonials];
                                    [copy[idx - 1], copy[idx]] = [
                                      copy[idx],
                                      copy[idx - 1],
                                    ];
                                    setDraftTestimonials(copy);
                                  }}
                                  className="p-1.5 rounded-lg border border-emerald-950/10 text-[#3F5243] hover:text-[#0F1C12] disabled:opacity-35 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === draftTestimonials.length - 1}
                                  onClick={() => {
                                    const copy = [...draftTestimonials];
                                    [copy[idx + 1], copy[idx]] = [
                                      copy[idx],
                                      copy[idx + 1],
                                    ];
                                    setDraftTestimonials(copy);
                                  }}
                                  className="p-1.5 rounded-lg border border-emerald-950/10 text-[#3F5243] hover:text-[#0F1C12] disabled:opacity-35 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraftTestimonials((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                  className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer ml-1"
                                  title="Delete Testimonial"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                              <div className="sm:col-span-3 flex flex-col items-center gap-2">
                                <div className="w-20 h-20 rounded-2xl bg-[#EAF2EA] border border-emerald-950/10 overflow-hidden flex items-center justify-center">
                                  {item.photo ? (
                                    <ResilientImage
                                      src={item.photo}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-[11px] font-semibold text-[#265728]">
                                      No Photo
                                    </span>
                                  )}
                                </div>
                                <label className="w-full px-3 py-1.5 rounded-xl bg-[#EAF2EA] hover:bg-[#d5e7d6] text-[#265728] text-[11px] font-semibold text-center cursor-pointer flex items-center justify-center gap-1">
                                  <Upload className="w-3 h-3" />
                                  <span>Upload Photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handlePhotoUpload(
                                        e.target.files?.[0],
                                        (dataUrl) => {
                                          const copy = [...draftTestimonials];
                                          copy[idx] = {
                                            ...copy[idx],
                                            photo: dataUrl,
                                          };
                                          setDraftTestimonials(copy);
                                        }
                                      )
                                    }
                                  />
                                </label>
                              </div>

                              <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                    Full Name
                                  </label>
                                  <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => {
                                      const copy = [...draftTestimonials];
                                      copy[idx] = {
                                        ...copy[idx],
                                        name: e.target.value,
                                      };
                                      setDraftTestimonials(copy);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                    Role / Generation
                                  </label>
                                  <input
                                    type="text"
                                    value={item.role}
                                    onChange={(e) => {
                                      const copy = [...draftTestimonials];
                                      copy[idx] = {
                                        ...copy[idx],
                                        role: e.target.value,
                                      };
                                      setDraftTestimonials(copy);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                    Photo URL (or use Upload Photo button)
                                  </label>
                                  <input
                                    type="text"
                                    value={item.photo}
                                    placeholder="/KeyHighlights/photo.jpg or https://..."
                                    onChange={(e) => {
                                      const copy = [...draftTestimonials];
                                      copy[idx] = {
                                        ...copy[idx],
                                        photo: e.target.value,
                                      };
                                      setDraftTestimonials(copy);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                    Testimonial Quote
                                  </label>
                                  <textarea
                                    rows={3}
                                    value={item.description}
                                    onChange={(e) => {
                                      const copy = [...draftTestimonials];
                                      copy[idx] = {
                                        ...copy[idx],
                                        description: e.target.value,
                                      };
                                      setDraftTestimonials(copy);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: OUR TEAM */}
                  {activeTab === 'team' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-[#0F1C12]">
                            Manage Our Team ({draftTeam.length})
                          </h3>
                          <p className="text-xs text-[#3F5243]">
                            Organize members into the{' '}
                            <span className="font-semibold text-[#265728]">
                              Guidance Group
                            </span>{' '}
                            (Senior Professionals) and{' '}
                            <span className="font-semibold text-[#265728]">
                              Core Group
                            </span>{' '}
                            (Program Coordinator, Program Officer, Advocacy Coordinator).
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setDraftTeam((prev) => [
                                ...prev,
                                {
                                  id: Date.now(),
                                  name: 'New Senior Professional',
                                  role: 'Senior Nutrition & Public Health Advisor',
                                  group: 'Guidance Group',
                                  photo: '',
                                  description:
                                    'Senior professional providing strategic direction, policy mentorship, and public health nutrition stewardship.',
                                },
                              ])
                            }
                            className="px-3.5 py-2 rounded-xl bg-[#EAF2EA] text-[#265728] border border-[#265728]/25 text-xs font-semibold hover:bg-[#d7e8d8] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add to Guidance Group</span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDraftTeam((prev) => [
                                ...prev,
                                {
                                  id: Date.now() + 1,
                                  name: 'New Core Group Member',
                                  role: 'Program Coordinator',
                                  group: 'Core Group',
                                  photo: '',
                                  description:
                                    'Core working group member leading fellowship operations, program execution, and nutrition advocacy.',
                                },
                              ])
                            }
                            className="px-3.5 py-2 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add to Core Group</span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {draftTeam.map((member, idx) => {
                          const currentGroup =
                            member.group === 'Guidance Group'
                              ? 'Guidance Group'
                              : 'Core Group';
                          return (
                            <div
                              key={member.id || idx}
                              className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-950/10 shadow-2xs space-y-4"
                            >
                              <div className="flex items-center justify-between gap-2 border-b border-emerald-950/8 pb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-[#265728]">
                                    Team Member #{idx + 1}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                      currentGroup === 'Guidance Group'
                                        ? 'bg-amber-50 text-amber-800 border border-amber-300/60'
                                        : 'bg-[#EAF2EA] text-[#265728] border border-[#265728]/20'
                                    }`}
                                  >
                                    {currentGroup}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      const copy = [...draftTeam];
                                      [copy[idx - 1], copy[idx]] = [
                                        copy[idx],
                                        copy[idx - 1],
                                      ];
                                      setDraftTeam(copy);
                                    }}
                                    className="p-1.5 rounded-lg border border-emerald-950/10 text-[#3F5243] hover:text-[#0F1C12] disabled:opacity-35 cursor-pointer"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === draftTeam.length - 1}
                                    onClick={() => {
                                      const copy = [...draftTeam];
                                      [copy[idx + 1], copy[idx]] = [
                                        copy[idx],
                                        copy[idx + 1],
                                      ];
                                      setDraftTeam(copy);
                                    }}
                                    className="p-1.5 rounded-lg border border-emerald-950/10 text-[#3F5243] hover:text-[#0F1C12] disabled:opacity-35 cursor-pointer"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setDraftTeam((prev) =>
                                        prev.filter((_, i) => i !== idx)
                                      )
                                    }
                                    className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer ml-1"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                                <div className="sm:col-span-3 flex flex-col items-center gap-2">
                                  <div className="w-24 h-20 rounded-2xl bg-[#EAF2EA] border border-emerald-950/10 overflow-hidden flex items-center justify-center">
                                    {member.photo ? (
                                      <ResilientImage
                                        src={member.photo}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-[11px] font-semibold text-[#265728]">
                                        No Photo
                                      </span>
                                    )}
                                  </div>
                                  <label className="w-full px-3 py-1.5 rounded-xl bg-[#EAF2EA] hover:bg-[#d5e7d6] text-[#265728] text-[11px] font-semibold text-center cursor-pointer flex items-center justify-center gap-1">
                                    <Upload className="w-3 h-3" />
                                    <span>Upload Photo</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) =>
                                        handlePhotoUpload(
                                          e.target.files?.[0],
                                          (dataUrl) => {
                                            const copy = [...draftTeam];
                                            copy[idx] = {
                                              ...copy[idx],
                                              photo: dataUrl,
                                            };
                                            setDraftTeam(copy);
                                          }
                                        )
                                      }
                                    />
                                  </label>
                                </div>

                                <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                      Team Category
                                    </label>
                                    <select
                                      value={currentGroup}
                                      onChange={(e) => {
                                        const nextGroup = e.target.value as
                                          | 'Guidance Group'
                                          | 'Core Group';
                                        const copy = [...draftTeam];
                                        copy[idx] = {
                                          ...copy[idx],
                                          group: nextGroup,
                                        };
                                        setDraftTeam(copy);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs font-semibold text-[#0F1C12] bg-[#FAF8F3]"
                                    >
                                      <option value="Guidance Group">
                                        Guidance Group (Senior Professionals)
                                      </option>
                                      <option value="Core Group">
                                        Core Group (Core Working Group)
                                      </option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                      Full Name
                                    </label>
                                    <input
                                      type="text"
                                      value={member.name}
                                      onChange={(e) => {
                                        const copy = [...draftTeam];
                                        copy[idx] = {
                                          ...copy[idx],
                                          name: e.target.value,
                                        };
                                        setDraftTeam(copy);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                      Role / Title
                                    </label>
                                    <input
                                      type="text"
                                      value={member.role}
                                      placeholder={
                                        currentGroup === 'Guidance Group'
                                          ? 'Senior Nutrition & Public Health Advisor'
                                          : 'Program Coordinator / Program Officer / Advocacy Coordinator'
                                      }
                                      onChange={(e) => {
                                        const copy = [...draftTeam];
                                        copy[idx] = {
                                          ...copy[idx],
                                          role: e.target.value,
                                        };
                                        setDraftTeam(copy);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                    />
                                  </div>
                                  <div className="sm:col-span-3">
                                    <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                      Photo URL (or use Upload Photo button)
                                    </label>
                                    <input
                                      type="text"
                                      value={member.photo}
                                      placeholder="/KeyHighlights/photo.jpg or https://..."
                                      onChange={(e) => {
                                        const copy = [...draftTeam];
                                        copy[idx] = {
                                          ...copy[idx],
                                          photo: e.target.value,
                                        };
                                        setDraftTeam(copy);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                    />
                                  </div>
                                  <div className="sm:col-span-3">
                                    <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                      Biography / Description
                                    </label>
                                    <textarea
                                      rows={3}
                                      value={member.description}
                                      onChange={(e) => {
                                        const copy = [...draftTeam];
                                        copy[idx] = {
                                          ...copy[idx],
                                          description: e.target.value,
                                        };
                                        setDraftTeam(copy);
                                      }}
                                      className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                    />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* TAB 3: HERO SLIDER PHOTOS */}
                  {activeTab === 'hero' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-[#0F1C12]">
                            Hero Showcase Photos ({draftHero.length})
                          </h3>
                          <p className="text-xs text-[#3F5243]">
                            Manage the featured photos and captions displayed at the top of the homepage.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setDraftHero((prev) => [
                              ...prev,
                              {
                                src: '/ImageSlider/5generations.jpeg',
                                alt: `Slide ${prev.length + 1}`,
                                caption: 'New Fellowship showcase photo caption',
                              },
                            ])
                          }
                          className="px-4 py-2 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Hero Photo</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {draftHero.map((slide, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-950/10 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                          >
                            <div className="sm:col-span-3 flex flex-col items-center gap-2">
                              <div className="w-full h-24 rounded-xl bg-[#9BC48F] overflow-hidden flex items-center justify-center border border-emerald-950/10">
                                <ResilientImage
                                  src={slide.src}
                                  alt={slide.alt}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <label className="w-full px-3 py-1.5 rounded-xl bg-[#EAF2EA] hover:bg-[#d5e7d6] text-[#265728] text-[11px] font-semibold text-center cursor-pointer flex items-center justify-center gap-1">
                                <Upload className="w-3 h-3" />
                                <span>Upload Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handlePhotoUpload(
                                      e.target.files?.[0],
                                      (dataUrl) => {
                                        const copy = [...draftHero];
                                        copy[idx] = { ...copy[idx], src: dataUrl };
                                        setDraftHero(copy);
                                      }
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <div className="sm:col-span-8 space-y-2.5">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Caption (Displayed below the photo in italics)
                                </label>
                                <input
                                  type="text"
                                  value={slide.caption}
                                  onChange={(e) => {
                                    const copy = [...draftHero];
                                    copy[idx] = {
                                      ...copy[idx],
                                      caption: e.target.value,
                                    };
                                    setDraftHero(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Image Path or URL
                                </label>
                                <input
                                  type="text"
                                  value={slide.src}
                                  onChange={(e) => {
                                    const copy = [...draftHero];
                                    copy[idx] = { ...copy[idx], src: e.target.value };
                                    setDraftHero(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-1 flex sm:flex-col items-center justify-end gap-1">
                              <button
                                type="button"
                                disabled={draftHero.length <= 1}
                                onClick={() =>
                                  setDraftHero((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  )
                                }
                                className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-35 cursor-pointer"
                                title="Delete Slide"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB: KEYNOTE SPEECHES (Separated Name, Short Description Outside, Full Text When Clicked) */}
                  {activeTab === 'speeches' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-[#0F1C12]">
                            Manage Keynote Speeches ({draftSpeeches.length})
                          </h3>
                          <p className="text-xs text-[#3F5243]">
                            Each keynote speech has separate sections for Speaker Name, the Short Description shown outside on the photo card, and the Full Speech Text shown when clicked.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setDraftSpeeches((prev) => [
                              ...prev,
                              {
                                id: Date.now(),
                                topic: 'Speaker Name · Speech Title',
                                description:
                                  'Short description of the photo shown on the outside card',
                                fullText:
                                  'Write or paste the full speech text here that appears when a visitor clicks the card to expand and read...',
                                image: '/KeyHighlights/Dr. RP Bichha.jpg',
                                link: '#',
                                isSpeech: true,
                              },
                            ])
                          }
                          className="px-4 py-2 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Keynote Speech</span>
                        </button>
                      </div>

                      <div className="space-y-5">
                        {draftSpeeches.map((speech, idx) => (
                          <div
                            key={speech.id || idx}
                            className="bg-white rounded-2xl p-5 border border-emerald-950/10 shadow-2xs space-y-4"
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-emerald-950/8 pb-3">
                              <span className="text-xs font-semibold text-[#265728]">
                                Keynote Speech #{idx + 1} · {speech.topic}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const copy = [...draftSpeeches];
                                    [copy[idx - 1], copy[idx]] = [
                                      copy[idx],
                                      copy[idx - 1],
                                    ];
                                    setDraftSpeeches(copy);
                                  }}
                                  className="p-1.5 rounded-lg border border-emerald-950/10 text-[#3F5243] hover:text-[#0F1C12] disabled:opacity-35 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === draftSpeeches.length - 1}
                                  onClick={() => {
                                    const copy = [...draftSpeeches];
                                    [copy[idx + 1], copy[idx]] = [
                                      copy[idx],
                                      copy[idx + 1],
                                    ];
                                    setDraftSpeeches(copy);
                                  }}
                                  className="p-1.5 rounded-lg border border-emerald-950/10 text-[#3F5243] hover:text-[#0F1C12] disabled:opacity-35 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraftSpeeches((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                  className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer ml-1"
                                  title="Delete Keynote Speech"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
                              {/* Part 1: Speaker Photo */}
                              <div className="sm:col-span-3 flex flex-col items-center gap-2 bg-[#F7F9F7] p-3 rounded-2xl border border-emerald-950/8">
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#265728] self-start">
                                  1. Speaker Photo
                                </span>
                                <div className="w-full h-32 rounded-xl bg-[#142616] overflow-hidden border border-emerald-950/10">
                                  <ResilientImage
                                    src={speech.image}
                                    alt={speech.topic}
                                    className="w-full h-full object-cover object-top"
                                  />
                                </div>
                                <label className="w-full px-3 py-1.5 rounded-xl bg-[#EAF2EA] hover:bg-[#d5e7d6] text-[#265728] text-[11px] font-semibold text-center cursor-pointer flex items-center justify-center gap-1">
                                  <Upload className="w-3 h-3" />
                                  <span>Upload Photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handlePhotoUpload(
                                        e.target.files?.[0],
                                        (dataUrl) => {
                                          const copy = [...draftSpeeches];
                                          copy[idx] = {
                                            ...copy[idx],
                                            image: dataUrl,
                                          };
                                          setDraftSpeeches(copy);
                                        }
                                      )
                                    }
                                  />
                                </label>
                                <input
                                  type="text"
                                  value={speech.image}
                                  placeholder="Or paste photo URL..."
                                  onChange={(e) => {
                                    const copy = [...draftSpeeches];
                                    copy[idx] = {
                                      ...copy[idx],
                                      image: e.target.value,
                                    };
                                    setDraftSpeeches(copy);
                                  }}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-emerald-950/15 text-[11px] text-[#0F1C12] bg-white"
                                />
                              </div>

                              {/* Parts 2, 3, and 4: Separated Name, Outside Short Description, and Full Text When Clicked */}
                              <div className="sm:col-span-9 space-y-3.5">
                                {/* Part 2: Name / Title */}
                                <div className="bg-[#F7F9F7] p-3.5 rounded-2xl border border-emerald-950/8">
                                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#265728] mb-1.5">
                                    2. Speaker Name / Speech Title
                                  </label>
                                  <input
                                    type="text"
                                    value={speech.topic}
                                    placeholder="e.g., Dr. RP Bichha Speech"
                                    onChange={(e) => {
                                      const copy = [...draftSpeeches];
                                      copy[idx] = {
                                        ...copy[idx],
                                        topic: e.target.value,
                                      };
                                      setDraftSpeeches(copy);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12] bg-white font-medium"
                                  />
                                </div>

                                {/* Part 3: Short Description Seen Outside */}
                                <div className="bg-[#F7F9F7] p-3.5 rounded-2xl border border-emerald-950/8">
                                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#265728] mb-1.5">
                                    3. Short Description of Photo (Seen Outside on Card)
                                  </label>
                                  <input
                                    type="text"
                                    value={speech.description}
                                    placeholder="Short summary shown on the card exterior before clicking..."
                                    onChange={(e) => {
                                      const copy = [...draftSpeeches];
                                      copy[idx] = {
                                        ...copy[idx],
                                        description: e.target.value,
                                      };
                                      setDraftSpeeches(copy);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12] bg-white"
                                  />
                                </div>

                                {/* Part 4: Full Text When Clicked */}
                                <div className="bg-[#F7F9F7] p-3.5 rounded-2xl border border-emerald-950/8">
                                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#265728] mb-1.5">
                                    4. Full Speech Text (Expanded When Visitor Clicks Card)
                                  </label>
                                  <textarea
                                    rows={6}
                                    value={speech.fullText ?? speech.description}
                                    placeholder="Write or paste the complete keynote speech text here. Separate paragraphs with a blank line..."
                                    onChange={(e) => {
                                      const copy = [...draftSpeeches];
                                      copy[idx] = {
                                        ...copy[idx],
                                        fullText: e.target.value,
                                      };
                                      setDraftSpeeches(copy);
                                    }}
                                    className="w-full px-3 py-2.5 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12] bg-white leading-relaxed"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB: FEATURED PORTALS (Top 2 Wide Cards in Key Highlights) */}
                  {activeTab === 'highlights' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-[#0F1C12]">
                            Featured Portals ({draftPortals.length})
                          </h3>
                          <p className="text-xs text-[#3F5243]">
                            Manage the wide featured resource portals (e.g., Nutrition Dashboard & Jan 17 Documents).
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {draftPortals.map((item, idx) => (
                          <div
                            key={item.id || idx}
                            className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-950/10 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-start"
                          >
                            <div className="sm:col-span-3 flex flex-col items-center gap-2">
                              <div className="w-full h-24 rounded-xl bg-[#F2F6F2] overflow-hidden border border-emerald-950/10">
                                <ResilientImage
                                  src={item.image}
                                  alt={item.topic}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <label className="w-full px-3 py-1.5 rounded-xl bg-[#EAF2EA] hover:bg-[#d5e7d6] text-[#265728] text-[11px] font-semibold text-center cursor-pointer flex items-center justify-center gap-1">
                                <Upload className="w-3 h-3" />
                                <span>Upload Photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handlePhotoUpload(
                                      e.target.files?.[0],
                                      (dataUrl) => {
                                        const copy = [...draftPortals];
                                        copy[idx] = {
                                          ...copy[idx],
                                          image: dataUrl,
                                        };
                                        setDraftPortals(copy);
                                      }
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Portal Name / Heading
                                </label>
                                <input
                                  type="text"
                                  value={item.topic}
                                  onChange={(e) => {
                                    const copy = [...draftPortals];
                                    copy[idx] = {
                                      ...copy[idx],
                                      topic: e.target.value,
                                    };
                                    setDraftPortals(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  External Link (URL)
                                </label>
                                <input
                                  type="text"
                                  value={item.link}
                                  onChange={(e) => {
                                    const copy = [...draftPortals];
                                    copy[idx] = {
                                      ...copy[idx],
                                      link: e.target.value,
                                    };
                                    setDraftPortals(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                />
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Short Description
                                </label>
                                <input
                                  type="text"
                                  value={item.description}
                                  onChange={(e) => {
                                    const copy = [...draftPortals];
                                    copy[idx] = {
                                      ...copy[idx],
                                      description: e.target.value,
                                    };
                                    setDraftPortals(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: INITIATIVES */}
                  {activeTab === 'initiatives' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-[#0F1C12]">
                            Projects & Initiatives ({draftInitiatives.length})
                          </h3>
                          <p className="text-xs text-[#3F5243]">
                            Manage the core workstreams and external repository links.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setDraftInitiatives((prev) => [
                              ...prev,
                              {
                                title: 'NEW INITIATIVE',
                                img: '/Initiatives/Gen-N.png',
                                link: 'https://',
                              },
                            ])
                          }
                          className="px-4 py-2 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Initiative</span>
                        </button>
                      </div>

                      <div className="space-y-4">
                        {draftInitiatives.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-950/10 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                          >
                            <div className="sm:col-span-2 flex flex-col items-center gap-2">
                              <div className="w-16 h-16 rounded-xl bg-[#F2F6F2] p-2 border border-emerald-950/10">
                                <ResilientImage
                                  src={item.img}
                                  alt={item.title}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <label className="px-2.5 py-1 rounded-lg bg-[#EAF2EA] text-[#265728] text-[10px] font-semibold cursor-pointer">
                                Upload Icon
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handlePhotoUpload(
                                      e.target.files?.[0],
                                      (dataUrl) => {
                                        const copy = [...draftInitiatives];
                                        copy[idx] = { ...copy[idx], img: dataUrl };
                                        setDraftInitiatives(copy);
                                      }
                                    )
                                  }
                                />
                              </label>
                            </div>

                            <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Initiative Title
                                </label>
                                <input
                                  type="text"
                                  value={item.title}
                                  onChange={(e) => {
                                    const copy = [...draftInitiatives];
                                    copy[idx] = {
                                      ...copy[idx],
                                      title: e.target.value,
                                    };
                                    setDraftInitiatives(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Target Link (Google Drive / URL)
                                </label>
                                <input
                                  type="text"
                                  value={item.link}
                                  onChange={(e) => {
                                    const copy = [...draftInitiatives];
                                    copy[idx] = {
                                      ...copy[idx],
                                      link: e.target.value,
                                    };
                                    setDraftInitiatives(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  setDraftInitiatives((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  )
                                }
                                className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: RESOURCES & PDFs */}
                  {activeTab === 'resources' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-[#0F1C12]">
                            Resources & Publications ({draftResources.length})
                          </h3>
                          <p className="text-xs text-[#3F5243]">
                            Add PDFs, Google Drive links, or upcoming publications under Reports, Policies and Plans, Blogs, or Researches.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setDraftResources((prev) => [
                              ...prev,
                              {
                                category: 'Reports',
                                title: 'New Publication Title',
                                pdfUrl: '/document_pdfs/Nutrition Fellowship Brief.pdf',
                                hasLocalPdf: true,
                                comingSoonHeading: 'Publication Description',
                              },
                            ])
                          }
                          className="px-4 py-2 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Document</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {draftResources.map((row, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-2xl p-4 border border-emerald-950/10 shadow-2xs grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                          >
                            <div className="sm:col-span-3">
                              <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                Category
                              </label>
                              <select
                                value={row.category}
                                onChange={(e) => {
                                  const copy = [...draftResources];
                                  copy[idx] = {
                                    ...copy[idx],
                                    category: e.target.value,
                                  };
                                  setDraftResources(copy);
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12] bg-white"
                              >
                                <option value="Reports">Reports</option>
                                <option value="Policies and Plans">
                                  Policies and Plans
                                </option>
                                <option value="Blogs">Blogs</option>
                                <option value="Researches">Researches</option>
                              </select>
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                Document Title
                              </label>
                              <input
                                type="text"
                                value={row.title}
                                onChange={(e) => {
                                  const copy = [...draftResources];
                                  copy[idx] = {
                                    ...copy[idx],
                                    title: e.target.value,
                                  };
                                  setDraftResources(copy);
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                              />
                            </div>

                            <div className="sm:col-span-3">
                              <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                PDF Path or External URL
                              </label>
                              <input
                                type="text"
                                value={row.pdfUrl}
                                placeholder="/document_pdfs/file.pdf or https://..."
                                onChange={(e) => {
                                  const copy = [...draftResources];
                                  copy[idx] = {
                                    ...copy[idx],
                                    pdfUrl: e.target.value,
                                  };
                                  setDraftResources(copy);
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12]"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                Status
                              </label>
                              <select
                                value={row.hasLocalPdf ? 'available' : 'coming_soon'}
                                onChange={(e) => {
                                  const copy = [...draftResources];
                                  copy[idx] = {
                                    ...copy[idx],
                                    hasLocalPdf: e.target.value === 'available',
                                  };
                                  setDraftResources(copy);
                                }}
                                className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs text-[#0F1C12] bg-white"
                              >
                                <option value="available">PDF Ready</option>
                                <option value="coming_soon">Coming Soon</option>
                              </select>
                            </div>

                            <div className="sm:col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() =>
                                  setDraftResources((prev) =>
                                    prev.filter((_, i) => i !== idx)
                                  )
                                }
                                className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 7: EVENTS & UPDATES */}
                  {activeTab === 'events' && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-1 p-1 bg-white rounded-xl border border-emerald-950/10">
                          {(
                            [
                              {
                                id: 'recent',
                                label: `Recent Events (${draftRecentEvents.length})`,
                              },
                              {
                                id: 'upcoming',
                                label: `Upcoming Events (${draftUpcomingEvents.length})`,
                              },
                              {
                                id: 'announcements',
                                label: `Announcements (${draftAnnouncements.length})`,
                              },
                            ] as const
                          ).map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => setEventsSubTab(sub.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                                eventsSubTab === sub.id
                                  ? 'bg-[#265728] text-white'
                                  : 'text-[#3F5243] hover:text-[#0F1C12]'
                              }`}
                            >
                              {sub.label}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (eventsSubTab === 'recent') {
                              setDraftRecentEvents((prev) => [
                                {
                                  id: Date.now(),
                                  date: '03/15/2025',
                                  img: '/Recentevents/1st meet.jpg',
                                  review: 'New Fellowship Event Title',
                                },
                                ...prev,
                              ]);
                            } else if (eventsSubTab === 'upcoming') {
                              setDraftUpcomingEvents((prev) => [
                                ...prev,
                                {
                                  name: 'New Upcoming Event',
                                  date: '2025',
                                  description: 'Details of the upcoming event.',
                                },
                              ]);
                            } else {
                              setDraftAnnouncements((prev) => [
                                ...prev,
                                {
                                  title: 'New Announcement',
                                  date: '03/15/2025',
                                  details: 'Announcement details.',
                                },
                              ]);
                            }
                          }}
                          className="px-4 py-2 rounded-xl bg-[#265728] text-white text-xs font-semibold hover:bg-[#1C431E] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Entry</span>
                        </button>
                      </div>

                      {eventsSubTab === 'recent' && (
                        <div className="space-y-3">
                          {draftRecentEvents.map((ev, idx) => (
                            <div
                              key={ev.id || idx}
                              className="bg-white rounded-2xl p-4 border border-emerald-950/10 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center"
                            >
                              <div className="sm:col-span-3 flex flex-col items-center gap-2">
                                <div className="w-full h-20 rounded-xl bg-[#F2F6F2] overflow-hidden border border-emerald-950/10">
                                  <ResilientImage
                                    src={ev.img}
                                    alt={ev.review}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <label className="w-full px-3 py-1 rounded-lg bg-[#EAF2EA] text-[#265728] text-[11px] font-semibold text-center cursor-pointer">
                                  Upload Event Photo
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handlePhotoUpload(
                                        e.target.files?.[0],
                                        (dataUrl) => {
                                          const copy = [...draftRecentEvents];
                                          copy[idx] = {
                                            ...copy[idx],
                                            img: dataUrl,
                                          };
                                          setDraftRecentEvents(copy);
                                        }
                                      )
                                    }
                                  />
                                </label>
                              </div>

                              <div className="sm:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                    Date (MM/DD/YYYY)
                                  </label>
                                  <input
                                    type="text"
                                    value={ev.date}
                                    onChange={(e) => {
                                      const copy = [...draftRecentEvents];
                                      copy[idx] = {
                                        ...copy[idx],
                                        date: e.target.value,
                                      };
                                      setDraftRecentEvents(copy);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs"
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                    Event Title
                                  </label>
                                  <input
                                    type="text"
                                    value={ev.review}
                                    onChange={(e) => {
                                      const copy = [...draftRecentEvents];
                                      copy[idx] = {
                                        ...copy[idx],
                                        review: e.target.value,
                                      };
                                      setDraftRecentEvents(copy);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs"
                                  />
                                </div>
                                <div className="sm:col-span-3">
                                  <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                    Photo Path or URL
                                  </label>
                                  <input
                                    type="text"
                                    value={ev.img}
                                    onChange={(e) => {
                                      const copy = [...draftRecentEvents];
                                      copy[idx] = {
                                        ...copy[idx],
                                        img: e.target.value,
                                      };
                                      setDraftRecentEvents(copy);
                                    }}
                                    className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs"
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-1 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraftRecentEvents((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {eventsSubTab === 'upcoming' && (
                        <div className="space-y-3">
                          {draftUpcomingEvents.map((ev, idx) => (
                            <div
                              key={idx}
                              className="bg-white rounded-2xl p-4 border border-emerald-950/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                            >
                              <div className="sm:col-span-4">
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Event Name
                                </label>
                                <input
                                  type="text"
                                  value={ev.name}
                                  onChange={(e) => {
                                    const copy = [...draftUpcomingEvents];
                                    copy[idx] = {
                                      ...copy[idx],
                                      name: e.target.value,
                                    };
                                    setDraftUpcomingEvents(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Date / Schedule
                                </label>
                                <input
                                  type="text"
                                  value={ev.date}
                                  onChange={(e) => {
                                    const copy = [...draftUpcomingEvents];
                                    copy[idx] = {
                                      ...copy[idx],
                                      date: e.target.value,
                                    };
                                    setDraftUpcomingEvents(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-4">
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Description
                                </label>
                                <input
                                  type="text"
                                  value={ev.description}
                                  onChange={(e) => {
                                    const copy = [...draftUpcomingEvents];
                                    copy[idx] = {
                                      ...copy[idx],
                                      description: e.target.value,
                                    };
                                    setDraftUpcomingEvents(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-1 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraftUpcomingEvents((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {eventsSubTab === 'announcements' && (
                        <div className="space-y-3">
                          {draftAnnouncements.map((ann, idx) => (
                            <div
                              key={idx}
                              className="bg-white rounded-2xl p-4 border border-emerald-950/10 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                            >
                              <div className="sm:col-span-4">
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={ann.title}
                                  onChange={(e) => {
                                    const copy = [...draftAnnouncements];
                                    copy[idx] = {
                                      ...copy[idx],
                                      title: e.target.value,
                                    };
                                    setDraftAnnouncements(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Date
                                </label>
                                <input
                                  type="text"
                                  value={ann.date}
                                  onChange={(e) => {
                                    const copy = [...draftAnnouncements];
                                    copy[idx] = {
                                      ...copy[idx],
                                      date: e.target.value,
                                    };
                                    setDraftAnnouncements(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-4">
                                <label className="block text-[11px] font-semibold text-[#3F5243] mb-1">
                                  Details
                                </label>
                                <input
                                  type="text"
                                  value={ann.details}
                                  onChange={(e) => {
                                    const copy = [...draftAnnouncements];
                                    copy[idx] = {
                                      ...copy[idx],
                                      details: e.target.value,
                                    };
                                    setDraftAnnouncements(copy);
                                  }}
                                  className="w-full px-3 py-2 rounded-xl border border-emerald-950/15 text-xs"
                                />
                              </div>
                              <div className="sm:col-span-1 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDraftAnnouncements((prev) =>
                                      prev.filter((_, i) => i !== idx)
                                    )
                                  }
                                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Sticky Bottom Action Bar */}
                <div className="px-6 py-4 bg-white border-t border-emerald-950/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-[#3F5243]">
                    {isAdminUser ? (
                      <span className="text-[#265728] font-medium">
                        Connected to Cloud Firestore · Changes will be published permanently for all visitors
                      </span>
                    ) : (
                      <span>
                        Preview Mode ·{' '}
                        <button
                          type="button"
                          onClick={handleGoogleSignIn}
                          className="text-[#265728] font-semibold underline cursor-pointer"
                        >
                          Sign in with Google
                        </button>{' '}
                        to publish permanently to Cloud Firestore
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl border border-emerald-950/15 text-xs font-semibold text-[#3F5243] hover:text-[#0F1C12] cursor-pointer"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={handleSaveCurrentTab}
                      className="px-5 py-2.5 rounded-xl bg-[#265728] hover:bg-[#1C431E] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {isSyncing
                          ? 'Saving...'
                          : isAdminUser
                          ? 'Save & Publish to Website'
                          : 'Apply Changes to Page'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
