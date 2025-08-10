# KTG Webapp API

Node.js Express server with PostgreSQL authentication for KTG webapp.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Update `.env` with your PostgreSQL credentials
   - Generate JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

3. **Setup database:**
   - Create PostgreSQL database
   - Run `database.sql` to create tables

4. **Start server:**
   ```bash
   npm start          # Production
   npm run dev        # Development with nodemon
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User Management
- `GET /api/user/profile` - Get user profile (requires auth)
- `PUT /api/user/avatar` - Update avatar data (requires auth)
- `POST /api/user/journeybook` - Save JourneyBook response (requires auth)
- `GET /api/user/all` - Get all users (admin)

### Health Check
- `GET /api/health` - Server status

## Frontend Integration

Replace Firebase calls with fetch requests:

```javascript
// Login
const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email, password})
});

// Authenticated requests
const response = await fetch('/api/user/profile', {
    headers: {'Authorization': `Bearer ${token}`}
});
```