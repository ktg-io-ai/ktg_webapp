# KTG.IO Platform Master Plan

## Table of Contents
1. [Platform Overview](#platform-overview)
2. [Core System Components](#core-system-components)
3. [Design System](#design-system)
4. [Landing Page Architecture](#landing-page-architecture)
5. [Game Rules & Token Economics](#game-rules--token-economics)
6. [Data Models & Backend](#data-models--backend)
7. [User Flow & Navigation](#user-flow--navigation)
8. [Technical Implementation](#technical-implementation)
9. [Development Workflow](#development-workflow)
10. [Glossary](#glossary)

---

## Platform Overview

The KTG.IO platform is a gamified lifestyle and destiny platform integrating AI, events, creators/influencers, and token-based access. Participants engage in games, classified interactions, and live events. The system is built with Firebase (Firestore, Functions, Authentication) and integrates AI agents (Lucy, Guru, Alter.) for marketing and backend automation.

**Core Philosophy**: The platform is a live studio lifestyle production and advertising company, **not** a public social network. Profile limits protect against funneling, scams, fraud, and human trafficking.

---

## Core System Components

### 1. Wallet Manager (wallet-manager.js)
✅ **Token Management**: Handles 1, 3, 6 and 9 life tokens ($1.99-$9.99 each) plus Special Diamond Token ($999.00) for certified diamond purchases
✅ **30-Day Expiration**: Automatic token expiration and cleanup with renewal warnings
✅ **Persistent Storage**: Firebase integration for wallet data
✅ **Crypto Wallet Support**: Field for linking external crypto wallets
✅ **Transaction History**: Tracks all token usage and additions

### 2. Game Registration Manager
✅ **Destiny Registration**: Uses 3-life token by default, any token accepted
✅ **Chess Registration**: 1 Life Token ($1.99) per AI opponent
✅ **Session Management**: Tracks active games and expiration
✅ **Token Validation**: Ensures sufficient tokens before registration

### 3. Avatar Manager
✅ **3 Generation Limit**: First gen from basic info, 2 more with custom prompts
✅ **Gender Memory**: System prompt remembers gender choice
✅ **Image Cycling**: After 3 gens, cycles through existing images
✅ **Wallet Persistence**: Avatar linked to wallet with token usage tracking

### 4. Registration Flow
✅ **Opening Page**: Token selection interface with wallet display
✅ **New Wallet**: Firebase integration with starter tokens
✅ **Avatar Creation**: Gender selection, name & tagline, live preview
✅ **Avatar Customization**: 3 generation system with custom prompts

### 5. Key Features
✅ **Zap System Logic**: Wallet-level separation, 10 zaps per token per 30-day cycle
✅ **Second Chances**: Zappee has remaining lives with other players
✅ **Token Economics**: Flexible pricing with 30-day expiration
✅ **Avatar System**: Classified ad proxy, terminable, persistent wallet

---

## Architecture Overview

This framework organizes the KTG platform into a scalable, maintainable structure:

### Core Structure
- **src/**: Source code and components
- **public/**: Static assets and media
- **config/**: Configuration files
- **modules/**: Feature modules (AI, Music, Destiny, etc.)
- **shared/**: Shared utilities and components

### Modules
- **AI**: KTG.AI functionality and interfaces
- **Music**: KTG.MUSIC player and audio management
- **Destiny**: Game mechanics and user interactions
- **Influencers**: Social media and promotion tools
- **Investors**: Business and financial interfaces
- **Lifestyle**: Listings and social features
- **Metaphysics**: Tarot and spiritual content
- **VR/AR/XR**: Virtual reality experiences
- **Web3**: Blockchain and crypto features

### Key Features
- Modular architecture for easy maintenance
- Responsive design for mobile and desktop
- Centralized asset management
- Configuration-driven development
- API-ready structure

---

## Design System

### Theme System
- **KTG Mode (Default)**: Dark cyberpunk with #2f27c8 accent, Courier New font, full animations, video backgrounds, submenus #111 backgrounds 90% opacity and 4px boarder with #2f27c8 accent
- **Light Mode**: Professional Apple/Notion-style with Arial font, no animations, white background, thin gray boarder submenus with 90% opacity background off-white
- **Dark Mode**: Elegant dark professional with Arial font, beige accents, no animations, thin light gray boarder submenu with dark mode background 90% opacity

Important! Use CSS Var not additional light or dark html pages

### Icon Standards
- **Sidebar Icons**: 24px × 24px
- **Submenu Icons**: 20px × 20px  
- **Button Icons**: 30px × 30px (music controls)
- **Portal Icons**: 32px × 32px (20% smaller for compact appearance)

### Submenu Types
- **Standard Submenu**: Vertical list layout for main pages (gameconsole sidebar)
- **Portal Submenu**: 3-column grid layout with square buttons for rightconsole iframes only

### CSS Variable System
```css
:root {
  --bg-primary: #111;
  --bg-secondary: rgba(1, 1, 1, 0.9);
  --text-primary: #fff;
  --text-secondary: #ccc;
  --accent-color: #2f27c8;
  --accent-hover: #4fb6c1;
}
```

### Standard Scrollbar Styling
```css
.scrollable-container::-webkit-scrollbar {
    width: 1px !important;
}
.scrollable-container::-webkit-scrollbar-thumb {
    background: var(--accent-color) !important;
}
```

---

## Landing Page Architecture

### Landing Page Categories
| Type | Layout | Elements | Portal Menu | Navigation | Content |
|------|--------|----------|-------------|------------|---------|
| **Minimalist** | Single Frame | Topframe + Main | Floating Portal | Minimal | Form/Content Only |
| **Console** | Left + Right | Left Content + Right Social | Right Console Header | Social Icons | Game/App Interface |
| **Grid** | Multi-Frame | Topframe + Left + Right | Right Console Header | Independent Frames | General + Navigation |
| **Grid List** | Multi-Frame + Views | Topframe + Left + Right | Right Console Header | View Toggle | List/Grid/Single Views |

### Desktop Layout Structure
**Main HTML Frame** - Primary page container
- **Top Frame**: Music player, page title, play/pause controls
- **Sidebar**: Page-specific navigation with standard submenus
- **Left Console** (iframe): Detail information panel
- **Right Console** (iframe): Main content with grid/list toggle

### Mobile Layout (Responsive)
**Main Console** - Merged information with 3-view system:
- **Grid View**: Multiple items in grid format
- **List View**: Multiple items in list format
- **Single View**: Detail view (replaces leftconsole)

---

## Game Rules & Token Economics

### Lives & Tokens
- **Token Prices**: $1.99 (1 Life), $3.99 (3 Lives), $6.99 (6 Lives), $9.99 (9 Lives)
- **Diamond Token**: $999.99 for certified diamond purchases
- **30-Day Expiration**: All tokens expire unless renewed
- **Zap Limit**: 10 zaps per token per 30-day cycle

### Game Actions
- **ZAP**: Consumes 1 life, blocks mutual visibility permanently
- **HIDE**: Hides participant without consuming life
- **Play the Star, Truth or Bomb, Door #4**: Event-triggered actions
- **Let's Go Out**: Opt-in for live game show outings

### Platform Roles
- **Participants**: Standard players with token-based access
- **Creators & Influencers**: Level 2+ Super Ambassadors with broadcast capabilities
- **Game Masters**: Admin privileges with 1000 starter tokens
- **AI Agents**: Lucy (marketing), Guru (backend), Alter (content)

---

## Data Models & Backend

### User Model
```json
{
  "user_id": "unique_uid",
  "email": "user@example.com",
  "walletId": "wallet_uid",
  "role": "player | gamemaster | admin",
  "avatarName": "1st Wizard",
  "tagline": "Ready for adventure",
  "door": "blue | yellow | red",
  "createdAt": "timestamp",
  "provider": "email | google"
}
```

### Wallet Model
```json
{
  "walletId": "wallet_uid",
  "tokens": {
    "life_1": 10,
    "life_3": 5,
    "life_6": 2,
    "life_9": 1,
    "diamond": 0
  },
  "expiry": "2025-08-27T00:00:00Z",
  "transactions": []
}
```

### Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /Wallet/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## User Flow & Navigation

### Destiny Module User Flow
**New User Registration Flow:**
1. `opening.html` → `newwallet.html` → `newavatar.html` → `makeavatar.html` → `chooseyourdoor.html` → `gameconsole.html`

**Existing User Login Flow:**
2. `opening.html` → `login.html` → `gameconsole.html`

### Flow Details
- **Opening**: Entry point with registration/login options
- **New Wallet**: Email/password registration with Firebase Auth
- **New Avatar**: Avatar creation with Leonardo AI integration, pollination.ai secondary, name, role, JourneyBook initialization
- **Make Avatar**: Avatar customization with 3-generation system and AI image generation
- **Choose Your Door**: Door selection (Values/Compatibility/Intimacy)
- **Game Console**: Main game interface with progress tracking
- **Login**: Existing user authentication

### Avatar Creation System
- **Gender Selection**: Male/Female/Other with visual selection
- **AI Integration**: Leonardo AI primary, Pollinations fallback
- **3 Generation Limit**: Basic info → 2 custom prompts → cycling
- **Live Preview**: Real-time avatar generation as user types
- **Role Selection**: Player, Game Master, Admin with appropriate permissions

---

## Technical Implementation

### Framework Structure
```
ktg_framework/
├── modules/
│   ├── destiny/ (Avatar creation, game console)
│   ├── games/ (4PlayChess, Dignbling)
│   ├── ai/ (KTG.AI integration)
│   ├── music/ (KTG.MUSIC player)
│   └── admin/ (Dashboard, user management)
├── shared/
│   ├── js/ (Firebase, themes, language)
│   ├── styles/ (Global CSS)
│   └── languages/ (Translation files)
└── public/
    ├── assets/ (Icons, images, videos)
    └── data/ (Participant data)
```

### Firebase Integration
- **Authentication**: Email/password with Game Master detection
- **Firestore**: User profiles, wallet data, avatar information
- **Storage**: Avatar images, generated content
- **Functions**: Token management, game logic, AI integration

### AI Service Integration
```javascript
// Leonardo AI primary service
const leonardoConfig = {
    apiKey: process.env.LEONARDO_API_KEY,
    modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
    fallbackService: "pollinations"
};

// Avatar generation with fallback
async function generateAvatar(prompt, gender) {
    try {
        return await leonardoAI.generate(prompt, gender);
    } catch (error) {
        return await pollinations.generate(prompt, gender);
    }
}
```

### Theme & Language System
- **Theme Persistence**: localStorage with iframe synchronization
- **Language Files**: JSON-based translation system
- **Message Passing**: Parent-iframe communication for theme changes
- **Responsive Design**: `min()` CSS functions for viewport scaling

---

## Development Workflow

### Blueprint-First Approach
1. **Analyze Root Workspace**: Review existing structure and relationships (BLUEPRINT_WIREFRAME)
2. **Map Data Relationships**: Understand file connections and dependencies
3. **Framework Implementation**: Build organized modular structure
4. **Apply Design System**: Implement theme and language systems (DESIGN AND LANDINGS)
5. **Console Integration**: Ensure iframe communication and sync

### Implementation Steps
```
Step 1: Root Workspace Analysis (BLUEPRINT_WIREFRAME)
- Map complete file structure and relationships
- Identify data models and existing functionality
- Document UI patterns and asset inventory

Step 2: Framework Architecture  
- Organize files into modular ktg_framework structure
- Preserve data relationships and dependencies
- Create shared components and utilities

Step 3: Data Integration
- Implement Firebase backend with existing data
- Add authentication and user management
- Maintain backward compatibility

Step 4: Design System Application
- Apply theme variables to all components
- Implement icon size standards and animations
- Ensure cross-browser compatibility
-ENSURE LANDING STYLE OF PAGE IS IMPLEMENTED WITH PROPER FRAMES STRUCTURE

Step 5: Language and Console Integration
- Add translation keys to language files
- Implement iframe message passing
- Test cross-component communication
```

### Quality Standards
- **Performance**: Lazy loading, efficient rendering, memory management
- **Accessibility**: 24px minimum touch targets, WCAG compliance, keyboard navigation
- **Cross-Browser**: Opera optimization, Chrome/Firefox standard, Safari WebKit considerations

---

## Glossary

### Core Terms
- **KTG**: Karma the Game and KTG.IO, main platform brand and default theme
- **Life Tokens**: Digital currency (1-life, 3-life, 6-life, 9-life)
- **Diamond Token**: Premium $999 token for certified diamonds
- **Avatar**: User's digital representation, terminable and recreatable
- **Wallet**: Token, Avatar Info storage with 30-day expiration cycles - fund button in wallet
- **Zap**: Remove unwanted profiles (10 per token per 30 days)
- **Portal**: Navigation interface in rightconsole or mainconsole and on Minimalist it on the main page

### UI Components
- **Standard Submenu**: Vertical list layout for main pages
- **Portal Submenu**: 3-column grid for rightconsole iframes
- **Modal Overlay**: Popup system with rgba background
- **Theme-Aware Icons**: Icons that change based on theme
- **Iframe Console**: Split-screen left/right layout and sometime single mainconsole

### Game Mechanics
- **Door Selection**: Values (Blue), Compatibility (Yellow), Intimacy (Red)
- **3-Generation Limit**: Avatar creation system progression
- **30-Day Expiration**: Monthly token renewal cycle
- **Wallet-Level Separation**: Permanent zap blocking
- **Second Chances**: Zapped users can play with others

### Technical Architecture
- **Framework Structure**: Modular `/ktg_framework/` organization
- **Firebase Integration**: Backend for auth, data, game state
- **Language System**: Multi-language with `data-translate`
- **Console Communication**: Iframe message passing
- **Click-Outside-to-Close**: Standard submenu behavior

---

---

## Development Update - December 19, 2024

### Current Status Assessment
✅ **Platform Foundation Complete**
- Modular architecture implemented and functional
- Database integration working for avatars and core functionality
- Theme system (KTG/Light/Dark) operational
- Authentication flow with wallet/avatar creation complete
- Game console interface operational
- JourneyBook modal system implemented (needs database fixes)

### Priority Development Roadmap

#### **Phase 1: Lucy AI Core Implementation** (Immediate Priority)
- **Location**: `modules/io/lucy-ai/`
- **Integration**: Use existing models in `modules/io/` (Riona, Notte)
- **Admin Controls**: Interactive management in `modules/admin/admin-dashboard`
- **Database**: Implement Lucy AI character system and external campaign tracking
- **Focus**: External platform integration, viral content creation, user acquisition

#### **Phase 2: Token Economics Completion** (High Priority)
- Diamond Token system ($999 certified diamond purchases)
- 30-day expiration cycles with renewal warnings
- Zap system refinement (10 zaps per token per cycle)
- VR concert/event integration with token payments

#### **Phase 3: JourneyBook System Enhancement** (Medium Priority)
- Fix database loading issues for `journeybook_pages` table
- Complete modal system for viewing other avatars' responses
- Implement proper image loading and question categorization

#### **Phase 4: Gaming Module Expansion** (Medium Priority)
- 4PlayChess full implementation with AI opponents
- Dignbling diamond mining game mechanics
- VR integration for desktop and VR headset experiences
- Live event system for game shows and outings

#### **Phase 5: Creator Platform Foundation** (Future Priority)
- Music/video creator lands template system
- Revenue sharing framework
- Creator analytics dashboard
- Content management system

### Technical Implementation Notes
- **Lucy AI**: Start with Riona model for social media automation, then integrate Notte for browser automation
- **Admin Dashboard**: Add Lucy AI controls, agent status monitoring, and campaign management
- **Database Schema**: Extend with AI characters, external campaigns, and door invitation tracking tables
- **API Integration**: Social media connectors (Twitter, Instagram, TikTok) for viral content distribution

---

This master plan serves as the comprehensive blueprint for all KTG.IO platform development, ensuring consistency, quality, and adherence to the established architecture and design principles.