# KTG File Upload System Documentation

## Overview
This document outlines the proper file upload system to replace base64 encoding, which was causing 413 Payload Too Large errors.

## Implementation Requirements

### 1. Server-Side Upload Handler
```javascript
// Add to server.js
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload endpoint
app.post('/api/upload/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});
```

### 2. Frontend Upload Implementation
```javascript
// Replace base64 encoding with FormData
async function uploadImage(fileInput) {
  const formData = new FormData();
  formData.append('image', fileInput.files[0]);
  
  try {
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    if (result.success) {
      return result.imageUrl;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}
```

### 3. Directory Structure
```
public/
├── uploads/           # New upload directory
│   ├── avatars/      # Avatar images
│   ├── listings/     # Listing images
│   └── profiles/     # Profile images
```

### 4. Database Updates
- Store image URLs as `/uploads/filename.ext` instead of base64 data
- Update existing base64 fields to URL fields
- Add image metadata tracking if needed

## Migration Steps

1. **Install Dependencies**
   ```bash
   npm install multer
   ```

2. **Create Upload Directory**
   ```bash
   mkdir public/uploads
   mkdir public/uploads/avatars
   mkdir public/uploads/listings
   mkdir public/uploads/profiles
   ```

3. **Update Forms**
   - Replace base64 encoding with file input
   - Use FormData for submissions
   - Handle upload progress if needed

4. **Update Database Schema**
   - Change TEXT fields to VARCHAR(255) for URLs
   - Migrate existing base64 data if any

## Security Considerations

- File type validation (images only)
- File size limits (5MB recommended)
- Filename sanitization
- Virus scanning for production
- Rate limiting on upload endpoints

## Performance Benefits

- Reduced payload sizes (no more 413 errors)
- Faster form submissions
- Better browser memory usage
- Cacheable image assets
- CDN-ready file structure

## Usage in Modules

### Creator Dashboard
- Replace image compression with direct file upload
- Update listing creation form
- Modify profile image upload

### Avatar Creation
- Replace Leonardo AI base64 with file upload
- Store generated images as files
- Update makeavatar.html form

### Admin Dashboard
- Update image management interfaces
- Add bulk upload capabilities
- Implement image optimization pipeline