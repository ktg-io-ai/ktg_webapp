# KTG.IO Platform Design System

## Overview
This document establishes the comprehensive design system for the KTG.IO platform, covering themes, icons, animations, language implementation, and development workflow.

---

## Theme System

### **KTG Mode (Default)**
- **Colors**: Dark cyberpunk aesthetic with #2f27c8 accent
- **Font**: Courier New monospace throughout
- **Background**: Cyberpunk video with rgba overlays
- **Animations**: Full animations enabled (slide-in, fade-in, hover effects)
- **Icons**: 24px with hover animations and scale effects
- **Borders**: 5px solid #2f27c8 for submenus
- **Experience**: Immersive gaming environment

### **Light Mode**
- **Colors**: Clean white/light gray Apple/Notion-style
- **Font**: Arial sans-serif (professional)
- **Background**: Solid white, no video
- **Animations**: Disabled for clean professional look
- **Icons**: 24px with subtle hover effects only
- **Borders**: 1px solid #e9ecef with subtle shadows
- **Experience**: Professional business interface

### **Dark Mode**
- **Colors**: Dark gray with beige (#f5f5dc) accents
- **Font**: Arial sans-serif (professional)
- **Background**: Solid dark, no video
- **Animations**: Disabled for clean professional look
- **Icons**: 24px with subtle hover effects only
- **Borders**: 1px solid #404040 with subtle shadows
- **Experience**: Elegant dark professional interface

---

## Icon Standards

### **Size Standards**
- **Sidebar Icons**: 24px × 24px (professional standard)
- **Submenu Icons**: 20px × 20px
- **Button Icons**: 30px × 30px (music controls)
- **Small UI Icons**: 25px × 25px (console buttons)

### **Animation Rules**
- **KTG Mode**: Full animations (scale, transform, hover effects)
- **Light/Dark Mode**: Subtle hover effects only (opacity, background color)

### **Icon Inventory**
```
Navigation Icons (24px):
- about_icon.png (About/Creator)
- social_icon.png (Influencers/Share)
- game_icon.png (Advertisers/Play)
- detail_icon.png (Investors/Decide)
- mystuff_icon.png (My Stuff)

Action Icons (20px):
- search_icon.png, listing_icon.png, name_icon.png
- skills_icon.png, location_icon.png, tagline_icon.png
- intro_icon.png, chat_icon.png, group_icon.png, safe_icon.png
- zap_icon.png, hide_icon.png, door4_icon.png, stars_icon.png, truth_icon.png

System Icons (30px):
- music_player_icon.png, play_pause.png
- portal_icon.png, grid_icon.png, list_icon.png
```

---

## Development Workflow

### **Blueprint-First Approach**
1. **Analyze Root Workspace**: Review existing file structure, relationships, and data models
   - Examine `/data/participant.json` - 16 participants with name, image, tagline, safeLinks
   - Review `/DESTINY/` folder structure - complete game console implementation
   - Study `/assets/` - comprehensive icon and media library
   - Understand `/ktg_framework/` - organized modular framework structure

2. **Map Data Relationships**: Understand how root files connect
   - `participant.json` → `DESTINY/rightconsole.html` → participant grid display
   - `assets/icons/` → UI components → consistent icon usage
   - `DESTINY/leftconsole.html` → participant profile display
   - Root folder patterns → `ktg_framework/modules/` organized structure

3. **Framework Implementation**: Build organized framework from root blueprint
   - Copy and refactor root files into modular `/ktg_framework/` structure
   - Maintain data relationships and file dependencies
   - Preserve existing functionality while organizing architecture

4. **Apply Design System**: Implement theme and language systems
   - Theme variables and animation rules per design.md standards
   - Language file integration with translation keys
   - Icon size standards (24px sidebar, 20px submenu, etc.)

5. **Console Integration**: Ensure iframe communication and synchronization
   - Theme changes propagate to all iframe consoles
   - Language switching affects all components
   - Data consistency across parent and child components

### **Implementation Steps**
```
Step 1: Root Workspace Analysis
- Map complete file structure and relationships
- Identify data models (participant.json, songs.json, etc.)
- Document existing functionality and UI patterns
- Catalog asset inventory (icons, images, videos, audio)

Step 2: Framework Architecture
- Organize root files into modular ktg_framework structure
- Preserve data relationships and dependencies
- Create shared components and utilities
- Establish consistent file naming and organization

Step 3: Data Integration
- Implement real data from participant.json (16 participants)
- Connect Firebase backend with existing data structure
- Maintain backward compatibility with root implementations
- Add authentication and user management layers

Step 4: Design System Application
- Apply theme variables (KTG/Light/Dark) to all components
- Implement icon size standards (24px sidebar icons)
- Add animation rules (KTG gets animations, Light/Dark don't)
- Ensure cross-browser compatibility (Opera optimizations)

Step 5: Language and Console Integration
- Add comprehensive translation keys to language files
- Implement iframe message passing for theme/language sync
- Test cross-component communication and data flow
- Validate complete user experience across all themes
```

---

## Language Implementation

### **Language File Structure**
```json
{
  "destiny": {
    "gameconsole": {
      "search": "Search",
      "share": "Share",
      "play": "Play",
      "decide": "Decide",
      "mystuff": "My Stuff",
      "leftconsole": {
        "title": "Participant Profile"
      },
      "rightconsole": {
        "title": "The Grid"
      },
      "safeLinks": "SAFE LINKS",
      "door": "DOOR",
      "journeybook": "JOURNEYBOOK"
    }
  }
}
```

### **Language Application Rules**
- **Main Pages**: Direct language.js integration with data-lang attributes
- **Iframe Consoles**: Message-based language sync from parent
- **Dynamic Content**: JavaScript-based translation for generated elements
- **Theme Consistency**: Language changes trigger theme re-sync

---

## CSS Variable System

### **KTG Mode Variables**
```css
:root {
  --bg-primary: #111;
  --bg-secondary: rgba(1, 1, 1, 0.9);
  --text-primary: #fff;
  --text-secondary: #ccc;
  --border-color: #2f27c8;
  --hover-bg: #222;
  --submenu-bg: rgba(255, 255, 255, 0.1);
  --sidebar-bg: #111;
  --topbar-bg: #111;
}
```

### **Light Mode Variables**
```css
[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: rgba(248, 249, 250, 0.9);
  --text-primary: #1a1a1a;
  --text-secondary: #6c757d;
  --border-color: #e9ecef;
  --hover-bg: #f1f3f4;
  --submenu-bg: #ffffff;
  --sidebar-bg: #ffffff;
  --topbar-bg: #ffffff;
}
```

### **Dark Mode Variables**
```css
[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: rgba(45, 45, 45, 0.9);
  --text-primary: #f5f5dc;
  --text-secondary: #b8b8b8;
  --border-color: #404040;
  --hover-bg: #3a3a3a;
  --submenu-bg: #333333;
  --sidebar-bg: #2d2d2d;
  --topbar-bg: #2d2d2d;
}
```

---

## Component Architecture

### **Main Page Structure**
- **Top Bar**: Fixed header with music controls and title
- **Sidebar**: Navigation with theme-appropriate icons and animations
- **Main Content**: Split iframe layout (left/right consoles)
- **Submenus**: Theme-specific styling and behavior

### **Iframe Console Structure**
- **Theme Inheritance**: CSS variables from parent
- **Message Handling**: Theme and language change listeners
- **Content Rendering**: Dynamic participant data display
- **Responsive Design**: Adapts to parent theme changes

### **Firebase Integration**
- **Authentication**: Wallet-first with email/password fallback
- **Data Management**: Real-time participant and game data
- **Theme Persistence**: localStorage with cross-component sync
- **Language Persistence**: localStorage with iframe propagation

---

## Quality Standards

### **Performance**
- **Lazy Loading**: Staggered image loading for Opera compatibility
- **Efficient Rendering**: Minimal DOM manipulation
- **Memory Management**: Proper event listener cleanup

### **Accessibility**
- **Icon Sizes**: 24px minimum for touch targets
- **Color Contrast**: WCAG compliant contrast ratios
- **Keyboard Navigation**: Full keyboard accessibility

### **Cross-Browser Compatibility**
- **Opera Optimization**: Special handling for image loading
- **Chrome/Firefox**: Standard implementation
- **Safari**: WebKit-specific considerations

---

## Future Considerations

### **Scalability**
- **Component Library**: Reusable UI components
- **Theme Extensions**: Easy addition of new themes
- **Language Expansion**: Support for additional languages

### **Maintenance**
- **Version Control**: Systematic updates to design system
- **Documentation**: Keep design.md updated with changes
- **Testing**: Cross-theme and cross-language testing protocols

---

This design system ensures consistency, maintainability, and scalability across the entire KTG.IO platform while providing distinct experiences for different user preferences and use cases.