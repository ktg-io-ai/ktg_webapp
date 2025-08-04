# KTG Framework Development Guide

## Getting Started

### Installation
```bash
cd ktg_framework
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Architecture

### Core Components

1. **Application Core** (`src/core/`)
   - `app.js`: Main application class
   - `dashboard.js`: Dashboard controller

2. **Modules** (`modules/`)
   - Self-contained feature modules
   - Each module has its own routes, views, and logic

3. **Shared Resources** (`shared/`)
   - `components/`: Reusable components
   - `utils/`: Utility functions
   - `styles/`: Global CSS
   - `assets/`: Shared media files

4. **Configuration** (`config/`)
   - `app.config.js`: Main configuration file

## Creating a New Module

### 1. Create Module Directory
```bash
mkdir modules/mymodule
```

### 2. Create Module Backend
```javascript
// modules/mymodule/index.js
const BaseModule = require('../../shared/components/BaseModule');

class MyModule extends BaseModule {
  setupRoutes() {
    this.addRoute('get', '/', this.getDashboard.bind(this));
    this.addRoute('get', '/info', this.getInfo.bind(this));
  }

  getDashboard(req, res) {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
  }

  getInfo(req, res) {
    res.sendFile(path.join(__dirname, 'info.html'));
  }
}

module.exports = MyModule;
```

### 3. Create Module Views
```html
<!-- modules/mymodule/dashboard.html -->
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="/shared/styles/global.css">
</head>
<body>
    <h1>My Module Dashboard</h1>
    <!-- Module content -->
</body>
</html>
```

### 4. Register Module
```javascript
// config/app.config.js
modules: {
  mymodule: { enabled: true, path: '/mymodule' }
}
```

## Styling Guidelines

### CSS Variables
Use the global CSS variables for consistency:
```css
:root {
  --primary-bg: #111;
  --secondary-bg: #222;
  --accent-color: #2f27c8;
  --accent-hover: #4fb6c1;
  --text-primary: #fff;
  --text-secondary: #ccc;
}
```

### Component Classes
Use the KTG framework classes:
```css
.ktg-btn          /* Standard button */
.ktg-btn-primary  /* Primary button */
.ktg-container    /* Main container */
.ktg-sidebar      /* Sidebar navigation */
```

### Animations
Use the built-in animation classes:
```css
.slide-in-left    /* Slide from left */
.fade-in          /* Fade in effect */
.slide-up         /* Slide up effect */
```

## API Development

### Creating Endpoints
```javascript
// In your module's index.js
setupRoutes() {
  this.addRoute('get', '/api/data', this.getData.bind(this));
  this.addRoute('post', '/api/save', this.saveData.bind(this));
}

getData(req, res) {
  res.json({ data: 'example' });
}
```

### Using APIs in Frontend
```javascript
// Fetch data from module API
async function loadModuleData() {
  const response = await fetch('/mymodule/api/data');
  const data = await response.json();
  return data;
}
```

## Asset Management

### Adding Assets
1. Place files in appropriate `public/assets/` subdirectory
2. Reference using absolute paths: `/assets/images/myimage.png`
3. Use the asset configuration in `app.config.js`

### Asset Types
- **Images**: `/assets/images/` - PNG, JPG, GIF, WebP
- **Videos**: `/assets/videos/` - MP4, WebM
- **Audio**: `/assets/audio/` - MP3, WAV, OGG
- **Icons**: `/assets/icons/` - PNG, SVG
- **Covers**: `/assets/covers/` - Album/content covers

## Testing

### Unit Tests
```bash
npm test
```

### Module Testing
Each module should include tests:
```javascript
// modules/mymodule/test.js
const request = require('supertest');
const app = require('../../src/core/app');

describe('MyModule', () => {
  test('should load dashboard', async () => {
    const response = await request(app).get('/mymodule/');
    expect(response.status).toBe(200);
  });
});
```

## Deployment

### Environment Variables
```bash
NODE_ENV=production
PORT=3000
```

### Production Checklist
- [ ] All modules tested
- [ ] Assets optimized
- [ ] Configuration reviewed
- [ ] Error handling implemented
- [ ] Security headers configured

## Best Practices

### Code Organization
- Keep modules focused and single-purpose
- Use consistent naming conventions
- Document complex functionality
- Handle errors gracefully

### Performance
- Lazy load modules when possible
- Optimize images and videos
- Use caching for static assets
- Minimize JavaScript bundle size

### Security
- Validate all user inputs
- Use HTTPS in production
- Implement proper authentication
- Sanitize data before storage

## Troubleshooting

### Common Issues

1. **Module Not Loading**
   - Check module is enabled in config
   - Verify file paths are correct
   - Check console for errors

2. **Assets Not Found**
   - Verify asset paths start with `/assets/`
   - Check file exists in `public/assets/`
   - Clear browser cache

3. **API Errors**
   - Check route registration
   - Verify HTTP methods match
   - Check request/response format