# Security Specification for Firestore

## 1. Data Invariants
- **Profiles**: Only the authenticated user matching the document ID can write to their own profile. Publicly readable.
- **Articles**: Only admins can create/update/delete articles. Publicly readable.
- **Comments**: Any authenticated user can create a comment. Only the author or an admin can delete/update? (Actually, usually comments are public-create, or auth-create). Let's say auth-required to create.
- **Works**: Only admins can manage works. Publicly readable.
- **Messages**: Any user can create a message. Only admins can read/update (reply) messages.

## 2. The "Dirty Dozen" Payloads (Testing Denials)

1. **Spoofed Article Creation**: Attempting to create an article as a non-admin.
2. **Anonymous Comment**: Attempting to create a comment without being signed in.
3. **Profile Hijacking**: User A attempting to update User B's profile.
4. **Message Theft**: User A attempting to read messages sent by User B.
5. **Article Deletion**: Non-admin attempting to delete an article.
6. **Work Modification**: Non-admin attempting to update a work description.
7. **Junk ID Poisoning**: Creating a document with a 2KB string as ID.
8. **Shadow Field Injection**: Adding `isAdmin: true` to a profile update.
9. **Relational Orphan**: Creating a comment for a non-existent article.
10. **Timestamp Fraud**: Providing a manual `createdAt` string instead of `serverTimestamp()`.
11. **Negative Likes**: Attempting to update `likes` to a negative number.
12. **Unauthorized Reply**: Non-admin attempting to fill `replyContent` in a message.

## 3. Test Runner Concept
The tests will ensure that these payloads are rejected by the security rules.
