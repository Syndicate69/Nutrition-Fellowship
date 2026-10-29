import {
  DOCUMENTS_REPOSITORY,
  DocumentCategory,
  RECENT_EVENTS,
  RecentEventItem,
} from '../data/siteContent';

export interface ThoughtsFormInput {
  name: string;
  email: string;
  message: string;
}

export interface ThoughtsValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    email?: string;
    message?: string;
  };
}

/**
 * Filter document categories by selected category name ('All' returns all categories).
 */
export function filterDocumentsByCategory(
  categories: DocumentCategory[],
  selectedCategory: string
): DocumentCategory[] {
  if (!selectedCategory || selectedCategory === 'All') {
    return categories;
  }
  return categories.filter((c) => c.category === selectedCategory);
}

/**
 * Calculate circular slice of recent events for carousel windowing.
 */
export function getVisibleEventsWindow(
  events: RecentEventItem[],
  startIndex: number,
  windowSize: number
): RecentEventItem[] {
  if (events.length === 0 || windowSize <= 0) {
    return [];
  }
  const normalizedStart =
    ((startIndex % events.length) + events.length) % events.length;
  const count = Math.min(windowSize, events.length);
  const result: RecentEventItem[] = [];
  for (let i = 0; i < count; i++) {
    result.push(events[(normalizedStart + i) % events.length]);
  }
  return result;
}

/**
 * Step carousel index forward or backward with modulo wrapping.
 */
export function stepCarouselIndex(
  currentIndex: number,
  delta: number,
  total: number
): number {
  if (total <= 0) return 0;
  return (((currentIndex + delta) % total) + total) % total;
}

/**
 * Validate Place Your Thoughts form inputs without silent fallbacks.
 */
export function validateThoughtsForm(
  input: ThoughtsFormInput
): ThoughtsValidationResult {
  const errors: ThoughtsValidationResult['errors'] = {};
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim();
  const trimmedMessage = input.message.trim();

  if (!trimmedName) {
    errors.name = 'Please enter your full name.';
  }

  if (!trimmedEmail) {
    errors.email = 'Please enter your email address.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!trimmedMessage) {
    errors.message = 'Please share your thoughts or questions.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Extract download filename from a PDF path.
 */
export function getDownloadFilename(pdfUrl: string): string {
  const parts = pdfUrl.split('/').filter(Boolean);
  return parts.length > 0 ? parts[parts.length - 1] : 'document.pdf';
}

/**
 * Verify all required site sections and data invariants.
 */
export function getSiteContentSummary() {
  const totalDocLinks = DOCUMENTS_REPOSITORY.reduce(
    (acc, cat) => acc + cat.links.length,
    0
  );
  return {
    categoriesCount: DOCUMENTS_REPOSITORY.length,
    totalDocLinks,
    recentEventsCount: RECENT_EVENTS.length,
  };
}
