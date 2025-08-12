# cPanel/phpMyAdmin Installation Guide

## Quick Setup Steps:

### 1. **Create Database via cPanel**
- Login to cPanel
- Go to "MySQL Databases"
- Create new database: `ktg_enhanced`
- Create database user with full privileges

### 2. **Import via phpMyAdmin**
- Open phpMyAdmin
- Select your new database
- Go to "Import" tab
- Upload: `enhanced_ktg_database_schema.sql`
- Click "Go"

### 3. **Update Your Current Config**
Add to your existing `ktg_framework/config/app.config.js`:

```javascript
// Enhanced database connection
const enhancedDbConfig = {
    host: 'localhost',
    database: 'ktg_enhanced', // Your new database name
    user: 'your_db_user',
    password: 'your_db_password'
};
```

## Integration with Current Structure

The enhanced database **extends** your current system:
- ✅ Keeps all existing portals (Destiny, Chess, AI, Music, etc.)
- ✅ Maintains current file structure
- ✅ Adds social features to existing modules
- ✅ Enhances current wallet/token system

## No Migration Needed
Since you don't need old data:
- Skip the migration script
- Use fresh enhanced database
- Keep current frontend unchanged
- Add new features gradually