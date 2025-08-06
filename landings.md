# KTG Landing Page Types

## Landing Page Categories

| Landing Type | Layout Structure | Elements | Portal Menu | Navigation | Content Display |
|--------------|------------------|----------|-------------|------------|-----------------|
| **Minimalist** | Single Frame | Topframe + Main Content | Floating Portal Button | Minimal | Form/Content Only |
| **Grid** | Multi-Frame | Topframe + Left + Right | Right Console Header | Independent Frames | General + Navigation |
| **Grid List** | Multi-Frame + Views | Topframe + Left + Right | Right Console Header | View Toggle Buttons | List/Grid/Single Views |

## Minimalist Landing Pages

**Structure:**
- Topframe: Title bar with music controls
- Portal Menu: Floating button above second header
- Main Content: Single frame with form or content
- No sidebar delineation (no leftconsole/rightconsole/social bar)

**Examples:**
- Login Page (`login.html`)
- Terms of Service (`terms.html`)
- Privacy Policy (`privacy.html`)
- Rules of the Game (`rules.html`)

## Grid Landing Pages

**Structure:**
- Topframe: Music player popout + title + music controls (play/pause + track name)
- Left Console: General content display
- Right Console: Navigation and controls
- Independent frame operation

**Examples:**
- Dashboard (`dashboard.html`)
- About Pages (Creator, etc.)

## Grid List Landing Pages

**Structure:**
- Same as Grid layout
- Right Console Header: Grid/List/Single view toggle buttons
- Portal Menu: Same design as Login (in right console header)
- Content Views:
  - List View: Card data display
  - Grid View: Grid data display
  - Single View: Mobile-optimized single column
- Left Console: Content display or mobile single view

**Examples:**
- Music Player (`ktgmusic.html`)
- All Portal Button destinations
- Listings Console
- Lifestyles Console

## Portal Menu Specifications

**Design Consistency:**
- Same portal submenu design across all landing types
- Location varies by landing type:
  - Minimalist: Floating above second header
  - Grid/Grid List: Right console header
- 3-column responsive grid layout
- Theme-aware icons (KTG/Light/Dark)
- Click-outside-to-close functionality

## Landing Page Elements

### Common Elements
- Theme system support (KTG/Light/Dark)
- Language system integration
- Music controls (where applicable)
- Portal navigation access

### Frame Structure
- **Minimalist**: 1 main frame
- **Grid**: 3 frames (top + left + right)
- **Grid List**: 3 frames + view controls

### Navigation Patterns
- Portal Menu: Universal navigation
- View Controls: Grid List specific
- Music Controls: Context-dependent
- Theme Toggle: Universal (in appropriate locations)

## Implementation Notes

- All landings use consistent CSS variables for theming
- Portal submenu maintains same functionality across all implementations
- Mobile responsiveness handled through view toggles in Grid List type
- Music integration varies by landing context