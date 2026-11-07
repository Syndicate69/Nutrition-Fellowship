# Security Specification (Phase 0: Payload-First Security TDD)

## 1. Data Invariants
1. **Default-Deny Catch-All**: All paths not explicitly matched (`/databases/{database}/documents/{document=**}`) deny all `read` and `write` operations (`if false`).
2. **No Unbounded List Queries**: Every collection (`/admins/{adminId}`, `/cms_manifests/{manifestId}`, `/cms_items/{itemId}`) disables `allow list` (`allow list: if false;`). Public visitors fetch known section manifests via single-document `get` (`doc(db, 'cms_manifests', sectionId)`) and fetch referenced items via single-document `get` (`doc(db, 'cms_items', itemId)`).
3. **Verified Admin RBAC Gate**: All write operations (`create`, `update`, `delete`) on `/cms_manifests/{manifestId}` and `/cms_items/{itemId}` require `isAdmin()`, which strictly enforces `request.auth != null && request.auth.token.email_verified == true` and checks either `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or the bootstrapped admin emails (`sth.rajon@gmail.com` or `nutfellowship@gmail.com`).
4. **Relational Integrity (Master Gate)**: A `CmsItem` (`/cms_items/{itemId}`) cannot be created or updated unless its `sectionId` corresponds to an existing `CmsManifest` document (`exists(/databases/$(database)/documents/cms_manifests/$(incoming().sectionId))`).
5. **Strict Key & Type Blueprints (`Anti-Update-Gap`)**: Both `create` and `update` call `isValidCmsManifest(incoming())` or `isValidCmsItem(incoming())`, enforcing exact required and allowed keys (`hasAll` and `hasOnly`), string length boundaries, regex ID validation (`isValidId`), bounded array checks (`itemIds.size() <= 25`), immutable `createdAt`/`authorId`/`sectionId`, and server timestamp equality (`request.time`).

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 (Unauthenticated Write to Manifest)**:
   `auth = null`, `create /cms_manifests/hero` -> `PERMISSION_DENIED`
2. **Payload 2 (Unverified Admin Email Spoofing)**:
   `auth = { uid: 'attacker1', email: 'sth.rajon@gmail.com', email_verified: false }`, `create /cms_manifests/hero` -> `PERMISSION_DENIED`
3. **Payload 3 (Non-Admin Authenticated User Write)**:
   `auth = { uid: 'user1', email: 'visitor@example.com', email_verified: true }`, `create /cms_items/item_1` -> `PERMISSION_DENIED`
4. **Payload 4 (Shadow Field Injection on Create)**:
   Admin sends valid `CmsItem` payload plus `"isSuperAdmin": true` -> `PERMISSION_DENIED` (blocked by `hasOnly`).
5. **Payload 5 (Author UID Spoofing on Create)**:
   Admin (`uid: 'admin1'`) sends `CmsItem` with `authorId: 'someone_else'` -> `PERMISSION_DENIED` (blocked by `data.authorId == request.auth.uid`).
6. **Payload 6 (Orphaned CmsItem Creation without Parent Manifest)**:
   Admin creates `/cms_items/item_orphan` referencing `sectionId: 'nonexistent_section'` -> `PERMISSION_DENIED` (blocked by `exists(/databases/$(database)/documents/cms_manifests/$(incoming().sectionId))`).
7. **Payload 7 (Client-Forged Timestamp on Create)**:
   Admin creates `/cms_items/item_1` with `createdAt: Timestamp.fromMillis(1000)` (`!= request.time`) -> `PERMISSION_DENIED`.
8. **Payload 8 (Immutable Field Mutation on Update)**:
   Admin updates `/cms_items/item_1` changing `createdAt` or `authorId` -> `PERMISSION_DENIED`.
9. **Payload 9 (Value Poisoning on Update)**:
   Admin updates `/cms_items/item_1` setting `title: ""` (empty string) or `title` exceeding 300 chars -> `PERMISSION_DENIED` (blocked by `isValidCmsItem(incoming())`).
10. **Payload 10 (Unbounded Array Exhaustion on Manifest)**:
    Admin updates `/cms_manifests/hero` with 30 `itemIds` (`> 25`) or non-string first element `[123]` -> `PERMISSION_DENIED`.
11. **Payload 11 (Path ID Poisoning Attack)**:
    Request to `get` or `create` `/cms_items/invalid$id!with*spaces` -> `PERMISSION_DENIED` (blocked by `isValidId(itemId)`).
12. **Payload 12 (Unauthorized Collection Scraping via `list` or Admin Read by Non-Owner)**:
    Authenticated user attempts `list /cms_items` or `get /admins/other_admin_uid` -> `PERMISSION_DENIED`.
