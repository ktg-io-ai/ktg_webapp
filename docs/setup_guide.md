# KTG Enhanced Platform Setup Guide

## Local Development Setup

### 1. Install Local Database
- Install XAMPP/WAMP/MAMP
- Import `enhanced_schema.sql` to local MySQL
- Database name: `ktg_enhanced_local`

### 2. Run Locally
```bash
cd ktg_framework
npm install
npm run dev
```
Access: `http://localhost:3000`

## Server Deployment

### 1. Upload Files
- Upload entire `ktg_framework` folder to your hosting
- Keep your existing cPanel database: `karmath1_ktg_enhanced`

### 2. Environment Variables (cPanel)
Create `.env` file:
```
NODE_ENV=production
DB_HOST=localhost
DB_USER=karmath1_user
DB_PASSWORD=your_password
DB_NAME=karmath1_ktg_enhanced
BASE_URL=https://yourdomain.com
```

### 3. Start Server
```bash
npm install
npm run prod
```

## Dual Setup Benefits
✅ **Local**: Fast development, testing, offline work
✅ **Server**: Live platform, user access, production data
✅ **Sync**: Develop locally, deploy to server
✅ **Backup**: Local copy protects against server issues

## File Structure
```
ktg_framework/
├── config/environment.js    ← Auto-detects local vs server
├── database/               ← Same schema for both
├── modules/               ← Your existing portals
└── server.js             ← Runs on both environments
```