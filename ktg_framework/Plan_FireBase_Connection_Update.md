# Plan.md - Updated GameConsole & Firebase Integration

## ✅ Current Status

* Firebase and Firestore initialized ✅
* Files uploaded to Firebase project ✅
* Firestore active with project structure syncing ✅
* `Plan.md` now includes Firebase schema and connection steps ✅

## 🔥 NEW: GameConsole + Wallet-First Logic

### 🎮 GameConsole Core Logic

* **Game actions** include: ZAP, HIDE, TRUTH, DOOR4, BOMB, STAR
* Game logic ties to `wallet_id`
* Each player action updates Firestore under `GameSessions`

### 💼 Wallet-Based Architecture

* Email tied to wallet
* Wallet is the identity anchor for all game logic
* All data related to user (lives, assets, zaps, sessions) is nested in the Wallet document

---

## 📦 Firestore Collections Structure

### 1. `Users`

```json
{
  "wallet_id": "abc123",
  "email": "user@email.com",
  "role": "participant",
  "lives": 3,
  "zaps_received": 1,
  "profile_status": "active",
  "game_history": ["game_001", "game_009"]
}
```

### 2. `Avatars`

```json
{
  "owner_wallet": "abc123",
  "persona_data": {...},
  "expires_at": "timestamp",
  "encapsulated_data": "ipfs://...",
  "visibility": "public"
}
```

### 3. `GameSessions`

```json
{
  "participants": ["abc123", "def456"],
  "status": "ended",
  "actions": [{"actor": "abc123", "action": "ZAP"}],
  "termination": "manual",
  "memories_to_wallet": true
}
```

### 4. `Outings`

```json
{
  "location": "NYC",
  "scheduled_at": "timestamp",
  "claimed_by_creator": "creator123",
  "prize_type": "ticket",
  "media_assets": [...],
  "claimed": true
}
```

### 5. `Wallet`

```json
{
  "wallet_id": "abc123",
  "token_balance": 0, 
  "one_life_token_balance": 1,
  "three_life_token_balance": 1,
  "six_life_token_balance": 1,
  "nine_life_token_balance": 1,
  "one_thousand_life_token_balance": 1,
  "diamonds_balance": 1,
  "connected_email": "user@email.com",
  "profile_level": 2,
  "encapsulated_memories": ["mem_001"]
}
```

---

## 🔐 Role System

* `0`: Participant
* `1–10`: Creator Tiers
* `11`: AmbassadorX
* `99`: Master Admin (you)
* `subadmin`: assignable via dashboard

---

## 📂 Dashboard Needs

* Legacy backend integration
* Admin overview of:

  * All Users
  * Live GameSessions
  * Outings Claimed
  * Wallet Flows

---

## 🖥️ Firebase: Upload & Review Checklist

* ✅ Firebase tools setup
* ✅ Project files uploaded to cloud
* ✅ Firestore populated with structure
* 🔄 Auto updates trigger after schema/file changes
* 🔜 Share data access link with Claude

---

## 🎯 Immediate Next Steps

* [ ] Connect GameConsole to Firestore live data
* [ ] Establish auth flow tied to wallet + email
* [ ] Activate role-based dashboard views
* [ ] Build Creator claim system for "Let’s Go Out"
* [ ] Share Firebase schema + endpoint info with Claude for logic build

---

🔥 *KTG enters testable architecture phase. Game on.*
