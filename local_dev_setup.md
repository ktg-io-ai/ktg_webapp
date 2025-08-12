# KTG Local Development Setup

## Step 1: Database Setup (XAMPP)

1. **Start XAMPP Services**
   - Start Apache
   - Start MySQL

2. **Create Database**
   - Open phpMyAdmin: http://localhost/phpmyadmin
   - Click "Import" tab
   - Choose file: `setup_local_db.sql`
   - Click "Go" to execute

## Step 2: Install Dependencies

```bash
cd ktg_webapp/ktg_framework
npm install
```

## Step 3: Environment Configuration

Create `.env` file in `ktg_framework/`:
```
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ktg_local_dev
DB_PORT=3306
PORT=3000
```

## Step 4: Start Development Server

```bash
npm run dev
```

## Step 5: Test Setup

- Server: http://localhost:3000
- API Health: http://localhost:3000/api/health
- Lucy Status: http://localhost:3000/api/lucy/status

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/:id/tokens` - Get user tokens

### Lucy AI
- `GET /api/lucy/status` - Lucy AI status
- `POST /api/lucy/campaign` - Create campaign

### Gaming
- `POST /api/destiny/session` - Create Destiny session

## Database Tables Created

- `countries` - Country reference data
- `users` - User accounts and profiles
- `user_tokens` - Gaming tokens (1life, 3life, etc.)
- `destiny_sessions` - Destiny game sessions
- `ai_characters` - Lucy AI character data
- `external_campaigns` - Social media campaigns
- `door_invitations` - User acquisition tracking

## Development Workflow

1. Make changes to code
2. Server auto-restarts (nodemon)
3. Test via API endpoints
4. Check database via phpMyAdmin
5. Deploy to production when ready