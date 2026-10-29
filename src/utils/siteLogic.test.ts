import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterDocumentsByCategory,
  getVisibleEventsWindow,
  stepCarouselIndex,
  validateThoughtsForm,
  getDownloadFilename,
  getSiteContentSummary,
} from './siteLogic';
import {
  DOCUMENTS_REPOSITORY,
  RECENT_EVENTS,
  KEY_HIGHLIGHTS,
  INITIATIVES,
  ABOUT_US_CONTENT,
} from '../data/siteContent';

test('site content preserves all original nutfellowship.com records', () => {
  const summary = getSiteContentSummary();
  assert.equal(summary.categoriesCount, 4);
  assert.equal(summary.totalDocLinks, 6);
  assert.equal(summary.recentEventsCount, 7);
  assert.equal(KEY_HIGHLIGHTS.length, 5);
  assert.equal(INITIATIVES.length, 3);
  assert.equal(ABOUT_US_CONTENT.ourVision.pillars.length, 5);
});

test('filterDocumentsByCategory returns all or matching category', () => {
  const all = filterDocumentsByCategory(DOCUMENTS_REPOSITORY, 'All');
  assert.equal(all.length, 4);

  const reports = filterDocumentsByCategory(DOCUMENTS_REPOSITORY, 'Reports');
  assert.equal(reports.length, 1);
  assert.equal(reports[0].links.length, 2);
  assert.equal(reports[0].links[0].title, 'Newsletter');
});

test('stepCarouselIndex wraps around forward and backward', () => {
  assert.equal(stepCarouselIndex(0, -1, 7), 6);
  assert.equal(stepCarouselIndex(6, 1, 7), 0);
  assert.equal(stepCarouselIndex(2, 2, 7), 4);
});

test('getVisibleEventsWindow returns circular slice of events', () => {
  const win = getVisibleEventsWindow(RECENT_EVENTS, 5, 4);
  assert.equal(win.length, 4);
  assert.equal(win[0].date, '01/20/2025');
  assert.equal(win[1].date, '02/19/2025');
  assert.equal(win[2].date, '08/01/2024');
  assert.equal(win[3].date, '12/26/2024');
});

test('validateThoughtsForm rejects empty or invalid email and accepts valid input', () => {
  const emptyResult = validateThoughtsForm({ name: ' ', email: '', message: '' });
  assert.equal(emptyResult.valid, false);
  assert.ok(emptyResult.errors.name);
  assert.ok(emptyResult.errors.email);
  assert.ok(emptyResult.errors.message);

  const badEmail = validateThoughtsForm({
    name: 'Aarav Sharma',
    email: 'not-an-email',
    message: 'Great fellowship initiative!',
  });
  assert.equal(badEmail.valid, false);
  assert.ok(badEmail.errors.email);

  const validResult = validateThoughtsForm({
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    message: 'Excited to join the next Nutrition Data Camp.',
  });
  assert.equal(validResult.valid, true);
  assert.deepEqual(validResult.errors, {});
});

test('getDownloadFilename extracts file name accurately', () => {
  assert.equal(
    getDownloadFilename('/document_pdfs/Nutrition Fellowship Brief.pdf'),
    'Nutrition Fellowship Brief.pdf'
  );
});
