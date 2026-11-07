import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  ANNOUNCEMENTS,
  AnnouncementItem,
  DOCUMENTS_REPOSITORY,
  DocumentCategory,
  HERO_SLIDER_IMAGES,
  HighlightItem,
  INITIATIVES,
  InitiativeItem,
  KEY_HIGHLIGHTS,
  RECENT_EVENTS,
  RecentEventItem,
  TEAM_MEMBERS,
  TeamMemberItem,
  TESTIMONIALS,
  TestimonialItem,
  UPCOMING_EVENTS,
  UpcomingEventItem,
} from '../data/siteContent';

export interface HeroSlideItem {
  src: string;
  alt: string;
  caption: string;
}

export type CmsSectionId =
  | 'hero'
  | 'highlights'
  | 'initiatives'
  | 'resources'
  | 'recent_events'
  | 'upcoming_events'
  | 'announcements'
  | 'testimonials'
  | 'team';

export interface NormalizedCmsItemInput {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  category: string;
}

interface SiteContentContextValue {
  heroSlides: HeroSlideItem[];
  keyHighlights: HighlightItem[];
  initiatives: InitiativeItem[];
  documentsRepository: DocumentCategory[];
  recentEvents: RecentEventItem[];
  upcomingEvents: UpcomingEventItem[];
  announcements: AnnouncementItem[];
  testimonials: TestimonialItem[];
  teamMembers: TeamMemberItem[];
  currentUser: FirebaseUser | null;
  isAdminUser: boolean;
  isAuthReady: boolean;
  isSyncing: boolean;
  signInAdmin: () => Promise<void>;
  signOutAdmin: () => Promise<void>;
  saveHeroSlides: (slides: HeroSlideItem[], persistToCloud: boolean) => Promise<void>;
  saveKeyHighlights: (items: HighlightItem[], persistToCloud: boolean) => Promise<void>;
  saveInitiatives: (items: InitiativeItem[], persistToCloud: boolean) => Promise<void>;
  saveDocumentsRepository: (categories: DocumentCategory[], persistToCloud: boolean) => Promise<void>;
  saveRecentEvents: (items: RecentEventItem[], persistToCloud: boolean) => Promise<void>;
  saveUpcomingEvents: (items: UpcomingEventItem[], persistToCloud: boolean) => Promise<void>;
  saveAnnouncements: (items: AnnouncementItem[], persistToCloud: boolean) => Promise<void>;
  saveTestimonials: (items: TestimonialItem[], persistToCloud: boolean) => Promise<void>;
  saveTeamMembers: (items: TeamMemberItem[], persistToCloud: boolean) => Promise<void>;
}

const AUTHORIZED_ADMIN_EMAILS = [
  'sth.rajon@gmail.com',
  'nutfellowship@gmail.com',
];

const SiteContentContext = createContext<SiteContentContextValue | undefined>(
  undefined
);

function sanitizeString(value: string | undefined | null, maxLen: number, fallback = ''): string {
  const str = (value ?? '').trim();
  if (!str) return fallback;
  return str.slice(0, maxLen);
}

function makeSafeDocId(prefix: string, index: number): string {
  const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  return `${cleanPrefix}_item_${index + 1}`;
}

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [heroSlides, setHeroSlides] = useState<HeroSlideItem[]>(HERO_SLIDER_IMAGES);
  const [keyHighlights, setKeyHighlights] = useState<HighlightItem[]>(KEY_HIGHLIGHTS);
  const [initiatives, setInitiatives] = useState<InitiativeItem[]>(INITIATIVES);
  const [documentsRepository, setDocumentsRepository] = useState<DocumentCategory[]>(
    DOCUMENTS_REPOSITORY
  );
  const [recentEvents, setRecentEvents] = useState<RecentEventItem[]>(RECENT_EVENTS);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventItem[]>(UPCOMING_EVENTS);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(ANNOUNCEMENTS);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(TESTIMONIALS);
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>(TEAM_MEMBERS);

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Track Firebase Auth state and check admin authorization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (!user) {
        setIsAdminUser(false);
        setIsAuthReady(true);
        return;
      }

      const email = (user.email || '').toLowerCase();
      if (user.emailVerified && AUTHORIZED_ADMIN_EMAILS.includes(email)) {
        setIsAdminUser(true);
        setIsAuthReady(true);
        return;
      }

      try {
        const adminPath = `admins/${user.uid}`;
        const adminSnap = await getDoc(doc(db, 'admins', user.uid));
        setIsAdminUser(Boolean(user.emailVerified && adminSnap.exists()));
      } catch {
        setIsAdminUser(false);
      } finally {
        setIsAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Helper to fetch a single section manifest and its items using single-document getDoc calls
  const fetchSectionItems = async (
    sectionId: CmsSectionId
  ): Promise<NormalizedCmsItemInput[] | null> => {
    const manifestPath = `cms_manifests/${sectionId}`;
    let manifestSnap;
    try {
      manifestSnap = await getDoc(doc(db, 'cms_manifests', sectionId));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, manifestPath);
    }

    if (!manifestSnap || !manifestSnap.exists()) {
      return null;
    }

    const data = manifestSnap.data();
    const itemIds: string[] = Array.isArray(data?.itemIds)
      ? data.itemIds.filter((id): id is string => typeof id === 'string').slice(0, 25)
      : [];

    if (itemIds.length === 0) {
      return [];
    }

    const docs = await Promise.all(
      itemIds.map(async (itemId) => {
        const itemPath = `cms_items/${itemId}`;
        try {
          const snap = await getDoc(doc(db, 'cms_items', itemId));
          if (!snap.exists()) return null;
          const d = snap.data();
          return {
            id: snap.id,
            title: String(d.title || ''),
            subtitle: String(d.subtitle || ''),
            description: String(d.description || ''),
            imageUrl: String(d.imageUrl || ''),
            linkUrl: String(d.linkUrl || ''),
            category: String(d.category || ''),
          } satisfies NormalizedCmsItemInput;
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, itemPath);
        }
      })
    );

    return docs.filter((item): item is NormalizedCmsItemInput => item !== null);
  };

  // Load any saved CMS sections from Firestore on startup
  useEffect(() => {
    let isMounted = true;

    const loadAllSections = async () => {
      try {
        const [
          heroData,
          highlightsData,
          initiativesData,
          resourcesData,
          recentEventsData,
          upcomingEventsData,
          announcementsData,
          testimonialsData,
          teamData,
        ] = await Promise.all([
          fetchSectionItems('hero'),
          fetchSectionItems('highlights'),
          fetchSectionItems('initiatives'),
          fetchSectionItems('resources'),
          fetchSectionItems('recent_events'),
          fetchSectionItems('upcoming_events'),
          fetchSectionItems('announcements'),
          fetchSectionItems('testimonials'),
          fetchSectionItems('team'),
        ]);

        if (!isMounted) return;

        if (heroData && heroData.length > 0) {
          setHeroSlides(
            heroData.map((item) => ({
              src: item.imageUrl,
              alt: item.title,
              caption: item.description || item.subtitle,
            }))
          );
        }

        if (highlightsData && highlightsData.length > 0) {
          setKeyHighlights(
            highlightsData.map((item, idx) => {
              const isSpeechItem =
                item.category === 'speech' || idx >= 2;
              return {
                id: idx + 1,
                topic: item.title,
                description: item.subtitle || item.description,
                fullText: isSpeechItem
                  ? item.description || item.subtitle
                  : undefined,
                isSpeech: isSpeechItem,
                image: item.imageUrl,
                link: item.linkUrl || '#',
              };
            })
          );
        }

        if (initiativesData && initiativesData.length > 0) {
          setInitiatives(
            initiativesData.map((item) => ({
              title: item.title,
              img: item.imageUrl,
              link: item.linkUrl || '#',
            }))
          );
        }

        if (resourcesData && resourcesData.length > 0) {
          const defaultCategoryOrder = [
            'Reports',
            'Policies and Plans',
            'Blogs',
            'Researches',
          ];
          const grouped = new Map<string, DocumentCategory>();
          for (const cat of defaultCategoryOrder) {
            grouped.set(cat, { category: cat, links: [] });
          }
          for (const item of resourcesData) {
            const catName = item.category || 'Reports';
            if (!grouped.has(catName)) {
              grouped.set(catName, { category: catName, links: [] });
            }
            const hasLocalPdf = item.subtitle === 'available' && Boolean(item.linkUrl);
            grouped.get(catName)!.links.push({
              title: item.title,
              path: `/${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '')}`,
              pdfUrl: item.linkUrl || '/pdfs/coming-soon.pdf',
              hasLocalPdf,
              comingSoonHeading: item.description || item.title,
              comingSoonStatus: hasLocalPdf ? 'Available' : 'Coming soon.....',
            });
          }
          const nonEmpty = Array.from(grouped.values()).filter(
            (c) => c.links.length > 0
          );
          if (nonEmpty.length > 0) {
            setDocumentsRepository(nonEmpty);
          }
        }

        if (recentEventsData && recentEventsData.length > 0) {
          setRecentEvents(
            recentEventsData.map((item, idx) => ({
              id: idx + 1,
              date: item.subtitle,
              img: item.imageUrl,
              review: item.title,
            }))
          );
        }

        if (upcomingEventsData && upcomingEventsData.length > 0) {
          setUpcomingEvents(
            upcomingEventsData.map((item) => ({
              name: item.title,
              date: item.subtitle,
              description: item.description,
            }))
          );
        }

        if (announcementsData && announcementsData.length > 0) {
          setAnnouncements(
            announcementsData.map((item) => ({
              title: item.title,
              date: item.subtitle,
              details: item.description,
            }))
          );
        }

        if (testimonialsData && testimonialsData.length > 0) {
          setTestimonials(
            testimonialsData.map((item, idx) => ({
              id: idx + 1,
              name: item.title,
              role: item.subtitle,
              photo: item.imageUrl,
              description: item.description,
            }))
          );
        }

        if (teamData && teamData.length > 0) {
          setTeamMembers(
            teamData.map((item, idx) => ({
              id: idx + 1,
              name: item.title,
              role: item.subtitle,
              photo: item.imageUrl,
              description: item.description,
              group:
                item.category === 'Guidance Group'
                  ? 'Guidance Group'
                  : 'Core Group',
            }))
          );
        }
      } catch (err) {
        console.error('Failed loading CMS sections from Firestore:', err);
      }
    };

    loadAllSections();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist a section's items to Firestore following all blueprint & security rules constraints
  const persistSectionToFirestore = async (
    sectionId: CmsSectionId,
    rawItems: NormalizedCmsItemInput[]
  ) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Please sign in with an authorized Google account to publish changes.');
    }

    setIsSyncing(true);
    try {
      const boundedItems = rawItems.slice(0, 25);
      const itemIds = boundedItems.map((_, idx) => makeSafeDocId(sectionId, idx));
      const manifestRef = doc(db, 'cms_manifests', sectionId);
      const manifestPath = `cms_manifests/${sectionId}`;

      // 1. Check if manifest already exists so we preserve createdAt on update, or create it first to satisfy Master Gate exists()
      let existingManifestSnap;
      try {
        existingManifestSnap = await getDoc(manifestRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, manifestPath);
      }

      if (!existingManifestSnap || !existingManifestSnap.exists()) {
        try {
          await setDoc(manifestRef, {
            sectionId,
            itemIds: [],
            authorId: user.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, manifestPath);
        }
      }

      // 2. Write each CmsItem document
      for (let i = 0; i < boundedItems.length; i++) {
        const item = boundedItems[i];
        const itemId = itemIds[i];
        const itemRef = doc(db, 'cms_items', itemId);
        const itemPath = `cms_items/${itemId}`;

        let existingItemSnap;
        try {
          existingItemSnap = await getDoc(itemRef);
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, itemPath);
        }

        const sanitizedPayload = {
          sectionId,
          title: sanitizeString(item.title, 300, 'Untitled'),
          subtitle: sanitizeString(item.subtitle, 300, ''),
          description: sanitizeString(item.description, 25000, ''),
          imageUrl: sanitizeString(item.imageUrl, 300000, ''),
          linkUrl: sanitizeString(item.linkUrl, 1000, ''),
          category: sanitizeString(item.category, 120, ''),
          authorId: user.uid,
          createdAt:
            existingItemSnap && existingItemSnap.exists()
              ? existingItemSnap.data().createdAt
              : serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        try {
          await setDoc(itemRef, sanitizedPayload);
        } catch (error) {
          handleFirestoreError(
            error,
            existingItemSnap && existingItemSnap.exists()
              ? OperationType.UPDATE
              : OperationType.CREATE,
            itemPath
          );
        }
      }

      // 3. Update manifest with the final ordered itemIds array
      const refreshedManifestSnap = await getDoc(manifestRef);
      const manifestCreatedAt =
        refreshedManifestSnap.exists() && refreshedManifestSnap.data().createdAt
          ? refreshedManifestSnap.data().createdAt
          : serverTimestamp();

      try {
        await setDoc(manifestRef, {
          sectionId,
          itemIds,
          authorId: user.uid,
          createdAt: manifestCreatedAt,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, manifestPath);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const signInAdmin = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signOutAdmin = async () => {
    await signOut(auth);
  };

  const saveHeroSlides = async (slides: HeroSlideItem[], persistToCloud: boolean) => {
    setHeroSlides(slides);
    if (persistToCloud) {
      await persistSectionToFirestore(
        'hero',
        slides.map((s) => ({
          title: s.alt || 'Slide',
          subtitle: s.caption || '',
          description: s.caption || '',
          imageUrl: s.src,
          linkUrl: '',
          category: 'hero',
        }))
      );
    }
  };

  const saveKeyHighlights = async (items: HighlightItem[], persistToCloud: boolean) => {
    setKeyHighlights(items);
    if (persistToCloud) {
      await persistSectionToFirestore(
        'highlights',
        items.map((h, idx) => {
          const isSpeechItem = Boolean(h.isSpeech || idx >= 2);
          return {
            title: h.topic,
            subtitle: h.description,
            description: isSpeechItem
              ? h.fullText || h.description
              : h.description,
            imageUrl: h.image,
            linkUrl: h.link || '#',
            category: isSpeechItem ? 'speech' : 'portal',
          };
        })
      );
    }
  };

  const saveInitiatives = async (items: InitiativeItem[], persistToCloud: boolean) => {
    setInitiatives(items);
    if (persistToCloud) {
      await persistSectionToFirestore(
        'initiatives',
        items.map((ini) => ({
          title: ini.title,
          subtitle: '',
          description: '',
          imageUrl: ini.img,
          linkUrl: ini.link,
          category: 'initiative',
        }))
      );
    }
  };

  const saveDocumentsRepository = async (
    categories: DocumentCategory[],
    persistToCloud: boolean
  ) => {
    setDocumentsRepository(categories);
    if (persistToCloud) {
      const flatItems: NormalizedCmsItemInput[] = [];
      for (const cat of categories) {
        for (const link of cat.links) {
          flatItems.push({
            title: link.title,
            subtitle: link.hasLocalPdf ? 'available' : 'coming_soon',
            description: link.comingSoonHeading || link.title,
            imageUrl: '',
            linkUrl: link.pdfUrl,
            category: cat.category,
          });
        }
      }
      await persistSectionToFirestore('resources', flatItems);
    }
  };

  const saveRecentEvents = async (items: RecentEventItem[], persistToCloud: boolean) => {
    setRecentEvents(items);
    if (persistToCloud) {
      await persistSectionToFirestore(
        'recent_events',
        items.map((ev) => ({
          title: ev.review,
          subtitle: ev.date,
          description: ev.review,
          imageUrl: ev.img,
          linkUrl: '',
          category: 'recent_event',
        }))
      );
    }
  };

  const saveUpcomingEvents = async (items: UpcomingEventItem[], persistToCloud: boolean) => {
    setUpcomingEvents(items);
    if (persistToCloud) {
      await persistSectionToFirestore(
        'upcoming_events',
        items.map((ev) => ({
          title: ev.name,
          subtitle: ev.date,
          description: ev.description,
          imageUrl: '',
          linkUrl: '',
          category: 'upcoming_event',
        }))
      );
    }
  };

  const saveAnnouncements = async (items: AnnouncementItem[], persistToCloud: boolean) => {
    setAnnouncements(items);
    if (persistToCloud) {
      await persistSectionToFirestore(
        'announcements',
        items.map((ann) => ({
          title: ann.title,
          subtitle: ann.date,
          description: ann.details,
          imageUrl: '',
          linkUrl: '',
          category: 'announcement',
        }))
      );
    }
  };

  const saveTestimonials = async (items: TestimonialItem[], persistToCloud: boolean) => {
    setTestimonials(items);
    if (persistToCloud) {
      await persistSectionToFirestore(
        'testimonials',
        items.map((t) => ({
          title: t.name,
          subtitle: t.role,
          description: t.description,
          imageUrl: t.photo,
          linkUrl: '',
          category: 'testimonial',
        }))
      );
    }
  };

  const saveTeamMembers = async (items: TeamMemberItem[], persistToCloud: boolean) => {
    setTeamMembers(items);
    if (persistToCloud) {
      await persistSectionToFirestore(
        'team',
        items.map((m) => ({
          title: m.name,
          subtitle: m.role,
          description: m.description,
          imageUrl: m.photo,
          linkUrl: '',
          category: m.group || 'Core Group',
        }))
      );
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
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
        isAuthReady,
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
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export function useSiteContent(): SiteContentContextValue {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return ctx;
}
