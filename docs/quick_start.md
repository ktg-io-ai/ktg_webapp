# KTG Quick Start Guide

## Problem: phpMyAdmin Not Accessible

Try these alternatives:

### Option 1: MySQL Command Line
1. Open Command Prompt as Administrator
2. Navigate to MySQL bin folder:
   ```
   cd C:\xampp\mysql\bin
   ```
3. Connect to MySQL:
   ```
   mysql -u root -p
   ```
4. Copy/paste commands from `create_db_manual.sql` one by one

### Option 2: Fix phpMyAdmin
1. Check XAMPP Control Panel - ensure Apache is running
2. Try: http://127.0.0.1/phpmyadmin
3. Check Windows Firewall settings
4. Restart XAMPP services

### Option 3: Alternative Database Tool
1. Download HeidiSQL or MySQL Workbench
2. Connect to localhost:3306, user: root, no password
3. Import `setup_local_db.sql`

## Once Database is Ready:

1. **Install Node.js dependencies:**
   ```bash
   cd ktg_webapp/ktg_framework
   npm install express mysql2 cors bcryptjs jsonwebtoken dotenv nodemon
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Test endpoints:**
   - http://localhost:3001/api/health
   - http://localhost:3001/api/lucy/status

## Minimal Test Setup

If you want to test without full database:

1. Create simple test file:
   ```javascript
   // test_server.js
   const express = require('express');
   const app = express();
   
   app.get('/api/health', (req, res) => {
       res.json({ status: 'OK', message: 'KTG Server Running' });
   });
   
   app.listen(3001, () => {
       console.log('Server running on http://localhost:3001');
   });
   ```

2. Run: `node test_server.js`
3. Visit: http://localhost:3000/api/health