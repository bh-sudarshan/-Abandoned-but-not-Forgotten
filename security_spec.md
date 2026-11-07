# Security Specification: NASA Space Snake

## 1. Data Invariants
- `users`:
  - A user document can only be written by the authenticated owner (`request.auth.uid == userId`) or an admin.
  - A user cannot promote themselves to admin or forge other users' high scores arbitrarily.
  - `uid` must match `request.auth.uid`.
- `users/{userId}/discoveries`:
  - Discoveries belong directly to the user's subcollection.
  - Any creation requires `request.auth.uid == userId` and `incoming().userId == request.auth.uid`.
- `abandoned_objects`:
  - Master catalog of Moon and Mars abandoned missions.
  - Readable by anyone (or any authenticated user) to enable in-game radar, telemetry, and galleries.
  - Writable, updatable, and deletable ONLY by verified Admins (including bootstrapped `bhsudarshan0@gmail.com`).
- `vehicles`:
  - Master roster of NASA rovers selectable by players.
  - Readable by all users.
  - Writable, updatable, and deletable ONLY by verified Admins.

## 2. The Dirty Dozen Payloads
1. Unauthorized User Creation (spoofing someone else's uid)
2. Shadow field injection into UserProfile (`role: "admin"`)
3. Anonymous write attempt to `/abandoned_objects`
4. Non-admin write attempt to `/vehicles`
5. Non-admin deletion of an abandoned object
6. Cross-user discovery creation (User A writing to User B's `/discoveries`)
7. Malformed discovery payload missing required `objectName` or `targetBody`
8. Target body injection with invalid enum (e.g. `targetBody: "JUPITER"`)
9. Payload with excessive strings exceeding size limits (>1000 chars)
10. Unauthenticated read of sensitive user private settings if restricted
11. Admin spoofing via unverified email token
12. Attempt to tamper with another user's high score or discoveries count

## 3. RBAC & Access Control Logic
- Bootstrapped Admin: `request.auth.token.email == 'bhsudarshan0@gmail.com' && request.auth.token.email_verified == true` or existence in `/admins/{uid}`.
