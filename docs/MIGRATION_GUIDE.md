# KTG Framework Migration Guide

This guide helps you migrate your existing KTG webapp to the new framework structure.

## Overview

The new framework provides:
- **Modular Architecture**: Each feature is a self-contained module
- **Centralized Configuration**: All settings in one place
- **API-First Design**: RESTful endpoints for all functionality
- **Responsive Layout**: Mobile and desktop optimized
- **Asset Management**: Organized media and resource handling

## Migration Steps

### 1. Asset Migration

Your existing assets in `/assets/` are organized into:
```
ktg_framework/public/assets/
├── images/          # All image files
├── videos/          # Video backgrounds and content
├── audio/           # Music and sound effects
├── icons/           # UI icons and logos
└── covers/          # Album and content covers
```

### 2. Module Migration

Each major section becomes a module:

| Original Folder | New Module | Description |
|----------------|------------|-------------|
| `/ABOUT/` | `modules/about/` | Platform information |
| `/KTGAI/` | `modules/ai/` | AI functionality |
| `/KTGMUSIC/` | `modules/music/` | Music player and tracks |
| `/DESTINY/` | `modules/destiny/` | Game mechanics |
| `/INFLUENCERS/` | `modules/influencers/` | Social features |
| `/INVESTORS/` | `modules/investors/` | Business content |
| `/LIFESTYLES/` | `modules/lifestyle/` | Listings and social |
| `/METAPHYSICS/` | `modules/metaphysics/` | Tarot and spiritual |
| `/VRARXR/` | `modules/vr/` | Virtual reality |
| `/WEB3/` | `modules/web3/` | Blockchain features |

### 3. Configuration Migration

Your existing functionality is now configured in `config/app.config.js`:

```javascript
modules: {
  ai: { enabled: true, path: '/ai' },
  music: { enabled: true, path: '/music' },
  // ... other modules
}
```

### 4. Layout Migration

The new framework uses a consistent layout:
- **Sidebar Navigation**: Module switching
- **Header Bar**: Music controls and branding
- **Content Panels**: Left and right frames for module content
- **Background**: Video or image backgrounds

### 5. API Integration

All data interactions now use REST APIs:
```javascript
// Get module data
fetch('/api/v1/modules/music/tracks')

// Update user preferences
fetch('/api/v1/user/preferences', {
  method: 'POST',
  body: JSON.stringify(preferences)
})
```

## Benefits of Migration

### For Developers
- **Maintainable Code**: Clear separation of concerns
- **Scalable Architecture**: Easy to add new modules
- **Modern Standards**: ES6+, REST APIs, responsive design
- **Testing Ready**: Modular structure supports unit testing

### For Users
- **Consistent Experience**: Unified navigation and design
- **Better Performance**: Optimized loading and caching
- **Mobile Friendly**: Responsive design for all devices
- **Faster Loading**: Modular loading reduces initial load time

## Backward Compatibility

The framework maintains compatibility with your existing:
- **Asset URLs**: All media files work with new paths
- **Functionality**: All features preserved and enhanced
- **User Experience**: Familiar interface with improvements
- **Data**: Existing JSON data files integrated

## Next Steps

1. **Review the Framework**: Explore the new structure
2. **Test Modules**: Verify all functionality works
3. **Customize**: Modify modules for your specific needs
4. **Deploy**: Use the new framework for production

## Support

For migration assistance:
- Review module examples in `/modules/`
- Check API documentation in `/docs/API.md`
- Examine configuration options in `/config/`