/**
 * Phase 0 Security Verification Suite for Firestore Rules (Dirty Dozen Payloads)
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const rulesText = fs.readFileSync(new URL('./firestore.rules', import.meta.url), 'utf8');

test('Dirty Dozen Security Invariants in firestore.rules', () => {
  // 1. Default-deny catch-all
  assert.match(rulesText, /match \/\{document=\*\*\} \{\s*allow read, write: if false;\s*\}/);

  // 2. Email verification required for admin check (blocks unverified email spoofing)
  assert.match(rulesText, /request\.auth\.token\.email_verified == true/);

  // 3. No blanket list queries allowed
  assert.doesNotMatch(rulesText, /allow list:\s*if true/);
  assert.match(rulesText, /allow list:\s*if false;/);

  // 4. Strict key validation (hasAll + hasOnly) in validation blueprints
  assert.match(rulesText, /data\.keys\(\)\.hasAll\(/);
  assert.match(rulesText, /data\.keys\(\)\.hasOnly\(/);

  // 5. Author identity binding to request.auth.uid
  assert.match(rulesText, /data\.authorId == request\.auth\.uid/);

  // 6. Relational parent manifest check via exists()
  assert.match(rulesText, /exists\(\/databases\/\$\(database\)\/documents\/cms_manifests\/\$\(incoming\(\)\.sectionId\)\)/);

  // 7. Server timestamp enforcement on create and update
  assert.match(rulesText, /incoming\(\)\.createdAt == request\.time/);
  assert.match(rulesText, /incoming\(\)\.updatedAt == request\.time/);

  // 8. Immutability of createdAt and sectionId on update
  assert.match(rulesText, /incoming\(\)\.createdAt == existing\(\)\.createdAt/);
  assert.match(rulesText, /incoming\(\)\.sectionId == existing\(\)\.sectionId/);

  // 9. Bounded array size and first-element type check on itemIds
  assert.match(rulesText, /data\.itemIds is list && data\.itemIds\.size\(\) <= 25/);
  assert.match(rulesText, /data\.itemIds\[0\] is string/);

  // 10. Path variable hardening via isValidId
  assert.match(rulesText, /isValidId\(manifestId\)/);
  assert.match(rulesText, /isValidId\(itemId\)/);
});
