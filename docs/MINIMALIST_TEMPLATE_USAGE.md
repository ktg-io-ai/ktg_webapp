# Minimalist Template Usage Guide

## Overview
The minimalist template provides a clean, reusable foundation for KTG modules with consistent theming, navigation, and structure.

## Template Placeholders

### Required Replacements
- `{{PAGE_TITLE}}` - HTML page title
- `{{PAGE_HEADING}}` - Main heading text
- `{{TITLE_TRANSLATE}}` - Translation key for heading
- `{{PLAYING_TEXT}}` - Music player text
- `{{PLAYING_TRANSLATE}}` - Translation key for music text
- `{{VIDEO_SOURCE}}` - Background video path
- `{{AUDIO_SOURCE}}` - Background music path
- `{{MAIN_CONTENT}}` - Main content area HTML

### Optional Replacements
- `{{ADDITIONAL_STYLES}}` - Extra CSS styles
- `{{ADDITIONAL_SCRIPTS}}` - Extra JavaScript
- `{{TERMS_TRANSLATE}}` - Translation key for terms link
- `{{PRIVACY_TRANSLATE}}` - Translation key for privacy link
- `{{RULES_TRANSLATE}}` - Translation key for rules link

## Usage Example

### For Web3 Module:
```javascript
// Replace placeholders with actual content
const template = minimalistTemplate
  .replace('{{PAGE_TITLE}}', 'KTG Web3')
  .replace('{{PAGE_HEADING}}', 'KTG Web3 Platform')
  .replace('{{TITLE_TRANSLATE}}', 'web3.title')
  .replace('{{PLAYING_TEXT}}', 'PLAYING: Casino Loading')
  .replace('{{PLAYING_TRANSLATE}}', 'web3.playing')
  .replace('{{VIDEO_SOURCE}}', '../../public/assets/videos/crypto.mp4')
  .replace('{{AUDIO_SOURCE}}', '../../public/assets/ktgmusic/audio/casino_loading.mp3')
  .replace('{{MAIN_CONTENT}}', mainConsoleContent)
  .replace('{{ADDITIONAL_STYLES}}', web3Styles)
  .replace('{{ADDITIONAL_SCRIPTS}}', web3Scripts);
```

## Features Included

### ✅ Built-in Features
- Theme support (KTG/Light/Dark)
- Language system integration
- Portal navigation menu
- Music controls with persistence
- Responsive design
- Animation system
- Background video support

### ✅ Consistent Structure
- Top bar with title and music controls
- Second bar with portal button
- Main content area (flexible)
- Footer with legal links
- Portal submenu overlay

## Integration Methods

### Method 1: Template Replacement
Replace the entire file content with processed template

### Method 2: Content Injection
Keep template structure, inject main console content directly instead of iframe

### Method 3: Hybrid Approach
Use template for shell, load specific module content dynamically

## File Structure
```
docs/
├── minimalist_template.html     # Base template
└── MINIMALIST_TEMPLATE_USAGE.md # This guide

modules/[module_name]/
├── dashboard_[module].html      # Main module file
└── mainconsole_[module].html    # Content to inject
```

## Benefits
- Consistent UI/UX across modules
- Reduced code duplication
- Centralized theme management
- Easy maintenance and updates
- Faster development of new modules