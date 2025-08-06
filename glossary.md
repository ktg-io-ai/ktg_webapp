# KTG.IO Platform Glossary

## Core Terms

**KTG** - Karma the Game, the main platform brand and default theme mode

**Karma the Game of Destiny** - Full platform name, the social gaming experience

**Life Tokens** - Digital currency for platform activities (1-life, 3-life, 6-life, 9-life)

**Diamond Token** - Premium $999 token for certified diamond purchases and high-value gameplay

**Avatar** - User's digital representation in the game, terminable and recreatable

**Wallet** - User's token storage and transaction system with 30-day expiration cycles

**Zap** - Primary game action to remove unwanted profiles (10 zaps per token per 30 days)

**Hide** - Secondary action to remove profiles after zap limit reached

**Portal** - Navigation interface in rightconsole for game flow (opening, newwallet, newavatar, etc.)

## UI Components

**Standard Submenu** - Traditional vertical list layout used in main pages (gameconsole sidebar)

**Portal Submenu** - 3-column grid layout with square buttons used in rightconsole iframes

**Modal Overlay** - Popup system with rgba(0,0,0,0.7) background for wallets and configs

**Theme-Aware Icons** - Icons that change based on theme (KTG/light/dark variants)

**Iframe Console** - Split-screen layout with leftconsole and rightconsole frames

## UI Components Structure

### **Desktop Layout (Standard)**
**Main HTML Frame** - Primary page container with main URL (not sub iframe file)
- **Top Frame** - Fixed header containing:
  - Music player link button
  - Page title (center)
  - Play/pause icon with "Playing: [song title]" text
- **Sidebar** - Left navigation panel with:
  - Page-specific navigation icons
  - Standard submenus (vertical list layout)
- **Left Console** (iframe) - Detail information panel:
  - Shows details from rightconsole selections
  - Gameconsole: starts with "MY AVATAR" then user can pick others
- **Right Console** (iframe) - Main content area:
  - Grid/List view of multiple items
  - Fixed title bar (non-scrolling) with Grid/List toggle buttons
  - Optional right sidebar with social links
  - Scrollable data content below title bar

### **Alternative Layouts**
**Main Console** - Single content area when left/right split not needed
- Used for singular content types
- Replaces dual console approach

### **Mobile Layout (Responsive)**
**Main Console** - Merged left/right console information with 3-view system:
- **Grid View** - Multiple items in grid format
- **List View** - Multiple items in list format  
- **Single View** - Detail view of selected item (replaces leftconsole purpose)
- View switching via title bar buttons
- Touch-optimized navigation

## Theme System

**KTG Mode** - Default cyberpunk theme with Courier New font, animations, and video backgrounds

**Light Mode** - Professional Apple/Notion-style with Arial font, no animations, white background

**Dark Mode** - Elegant dark professional with Arial font, beige accents, no animations

## Game Mechanics

**Door Selection** - Choose your world: Values (Blue), Compatibility (Yellow), Intimacy (Red)

**3-Generation Limit** - Avatar creation system: basic info → 2 custom prompts → cycling

**30-Day Expiration** - All tokens expire monthly to encourage active gameplay

**Wallet-Level Separation** - Zapped users never see each other again

**Second Chances** - Zapped users can still play with other participants

## Technical Architecture

**Framework Structure** - Modular `/ktg_framework/` with shared components and module-specific files

**Firebase Integration** - Backend for authentication, wallet data, and game state management

**Language System** - Multi-language support with `data-translate` attributes and JSON files

**Responsive Design** - `min()` CSS functions for viewport-based scaling

**Grid/List Toggle** - Fixed title bar buttons for switching content view modes

**Console Communication** - Iframe message passing between left/right consoles

**Click-Outside-to-Close** - Standard behavior for all submenus and popups

## File Organization

**Main Pages** - Core HTML files (dashboard.html, gameconsole.html, etc.)

**Modules** - Organized features (/ai/, /music/, /destiny/, /lifestyles/)

**Shared Resources** - Common JS, CSS, languages, and assets

**Public Assets** - Icons, images, videos, audio files

**Rightconsole Files** - Portal navigation pages (opening, newwallet, newavatar, etc.)

## Design Standards

**Icon Sizes** - 24px sidebar, 20px submenu, 30px music controls, 32px portal buttons

**20% Size Reduction** - Applied to all portal elements for compact appearance

**Border Standards** - 5px KTG mode, 1px light/dark modes

**Color Variables** - CSS custom properties for theme consistency

**Animation Rules** - Full animations in KTG mode only, subtle effects in light/dark

## User Flow

**Registration** - Email/password → wallet creation → starter tokens → avatar creation

**Game Entry** - Token selection → avatar customization → door choice → gameplay

**Token Economy** - Purchase → 30-day usage → expiration → renewal cycle

**Avatar Lifecycle** - Create → customize (3 generations) → play → terminate → recreate

## Platform Features

**AI Integration** - Avatar generation, video stories, music recommendations

**Social Elements** - Chat, groups, safe links, classified ad proxy system

**VR Ready** - Concert and event integration (desktop compatible)

**Crypto Wallet Support** - External wallet linking for advanced users

**Multi-Language** - Global platform with comprehensive translation system

## Development Workflow

**Blueprint-First** - Analyze root workspace → map relationships → framework implementation

**Theme Consistency** - Apply design system → test cross-theme compatibility

**Iframe Communication** - Message passing for theme/language synchronization

**Firebase Backend** - Authentication → data management → real-time updates

**Quality Standards** - Performance optimization, accessibility compliance, cross-browser support