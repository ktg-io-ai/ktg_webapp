
# KTG.IO Platform Backend & Game Logic Plan

## Overview
The KTG.IO platform is a gamified lifestyle and destiny platform integrating AI, events, creators/influencers, and token-based access.  
Participants engage in games, classified interactions, and live events.  
The system is built with Firebase (Firestore, Functions, Authentication) and integrates AI agents (Lucy, Guru, etc.) for marketing and backend automation.

---

## Game Rules
- **Lives & Tokens:** 
  - Tokens correspond to "Lives": $1.99 (1 Life), $3.99 (3 Lives), $6.99 (6 Lives), $9.99 (9 Lives).
  - Each life expires after 30 days unless renewed.
  - If a participant is "ZAPPED" the number of times equal to their active lives, they are removed (wallet-level block).
- **ZAP:** 
  - Consumes 1 life of the recipient and blocks mutual visibility between participants permanently.
- **HIDE:** 
  - Hides a participant without consuming a life.
- **Other Actions:** 
  - **Play the Star, Truth or Bomb, Door #4** – Derived from game pop-ups and event triggers.
  - **Let's Go Out:** Opt-in for public game show outings.
  - **Creators & Influencers (Level 2+ Super Ambassadors):** Can view outings like Uber drivers view rides, claim them, broadcast on KTG.TV, and promote venues.

- **Memories & Ownership:**
  - When a proxy avatar terminates, all memory data is returned to the wallet owner.
  - Deleted from the system unless policy/law violations exist.

- **Platform Role:**
  - The platform is a live studio lifestyle production and advertising company, **not** a public social network.
  - Profile limits protect against funneling, scams, fraud, and human trafficking.

---

## Data Models (Firestore)

### **User**
```json
{
  "user_id": "unique_uid",
  "name": "Player Name",
  "role": "participant | creator | admin | AI",
  "lives": 3,
  "lives_expiry": "2025-08-27T00:00:00Z",
  "zaps": 1,
  "wallet": "wallet_address",
  "level": "1 | 2 | ... | 11",
  "created_at": "timestamp"
}
```

### **Listing (Destiny Classifieds)**
```json
{
  "listing_id": "unique_id",
  "title": "Dinner at Sunset",
  "description": "An epic date challenge",
  "creator_id": "creator_uid",
  "price": "1 token",
  "status": "active",
  "created_at": "timestamp"
}
```

### **Outings**
```json
{
  "outing_id": "unique_id",
  "venue": "The Jazz Club",
  "creator_id": "creator_uid",
  "participants": ["user_1", "user_2"],
  "status": "claimed | pending | completed",
  "broadcast": true,
  "created_at": "timestamp"
}
```

---

## Cloud Functions

### **purchaseLife**
```javascript
exports.purchaseLife = functions.https.onCall(async (data, context) => {
  const userId = context.auth.uid;
  const livesToAdd = data.lives || 1;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 30); // 30-day expiration

  await admin.firestore().collection('lives').doc(userId).set({
    user_id: userId,
    purchased: admin.firestore.FieldValue.increment(livesToAdd),
    remaining: admin.firestore.FieldValue.increment(livesToAdd),
    expiry_date: expiryDate.toISOString()
  }, { merge: true });

  return { success: true, message: `${livesToAdd} lives purchased.` };
});
```

### **zapUser**
```javascript
exports.zapUser = functions.https.onCall(async (data, context) => {
  const { targetUserId } = data;
  const userId = context.auth.uid;

  const userRef = admin.firestore().collection('lives').doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists || userDoc.data().remaining <= 0) {
    throw new functions.https.HttpsError('failed-precondition', 'No lives left.');
  }

  await userRef.update({
    remaining: admin.firestore.FieldValue.increment(-1),
    zaps: admin.firestore.FieldValue.arrayUnion({ from_user: targetUserId, date: new Date().toISOString() })
  });

  const blockRef = admin.firestore().collection('blocks').doc(`${userId}_${targetUserId}`);
  await blockRef.set({ userId, targetUserId, blocked_at: new Date().toISOString() });

  return { success: true, message: `ZAP applied to ${targetUserId}` };
});
```

---

## Firebase Security Rules (Draft)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    match /lives/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    match /destiny_listings/{listingId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role in ['creator', 'admin'];
    }

    match /outings/{outingId} {
      allow read: if true;
      allow write: if request.auth.token.role in ['creator_level_2', 'admin'];
    }
  }
}
```

---

## Roadmap
1. **Phase 1: Authentication + Lives**
   - Implement Firebase Auth.
   - Connect purchase flows for lives & token renewal.
2. **Phase 2: Destiny Classifieds**
   - CRUD for listings.
   - Tokenized participation with AI opponents.
3. **Phase 3: KTG.TV & Creator Levels**
   - Outing claims.
   - Broadcast integration.
4. **Phase 4: Lucy AI & Guru**
   - AI-driven marketing agent (Lucy).
   - Backend AI orchestration assistant.

---

## Notes
- Wireframe mockups of Destiny (with fake avatars and listings) show the target UI/UX flow.
- Lives and tokens auto-expire after 30 days unless renewed.
- All user data is modular for AI and gamification hooks.

---
