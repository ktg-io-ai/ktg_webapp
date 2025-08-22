# KTG Destiny Module - Foundation Documentation

## Overview
The Destiny module now has a complete working foundation with proper user authentication, avatar management, and game console functionality.

## Database Schema

### Core Tables
```sql
-- Users table (existing)
users (id, email, password_hash, username, first_name, last_name, wallet_id, created_at)

-- Wallets table
wallets (id, user_id, wallet_id, created_at)

-- Avatars table (enhanced)
avatars (id, wallet_id, name, gender, tagline, image_url, door_choice, is_active, generation_count, created_at, updated_at)
```

### Key Enhancement
- Added `door_choice ENUM('blue', 'yellow', 'red') DEFAULT 'blue'` to avatars table
- This stores each avatar's chosen door for proper game console display

## User Flow

### Registration/Login Flow
1. **Opening** → User introduction
2. **newwallet** → Email/password registration
3. **newavatar** → Avatar selection from existing avatars
4. **makeavatar** → Avatar customization (name, tagline, door choice)
5. **gameconsole** → Main game interface

### Data Storage
- User credentials: `users` table
- Avatar selection: `localStorage.ktg_selected_avatar`
- User session: `localStorage.ktg_user`

## Game Console Architecture

### Three-Panel Layout
1. **Main Console** (`gameconsole.html`) - Navigation and controls
2. **Left Console** (`leftconsole.html`) - User's avatar profile
3. **Right Console** (`rightconsole.html`) - Grid of all player avatars

### Data Flow
```
gameconsole.html
├── Initializes with stored user data
├── Fetches wallet data via /api/wallet?email=
└── Sends data to iframes via postMessage

leftconsole.html
├── Displays user's own avatar with "(You)" indicator
├── Shows door choice, tagline, safe links
└── Updates when other avatars are clicked

rightconsole.html
├── Fetches all avatars via /api/users/avatars
├── Displays 3x3 grid of avatar images
├── Sends click events to left console
└── Fallback to sample data if database empty
```

## API Endpoints

### Working Endpoints
- `GET /api/users/avatars` - Returns all active avatars with door_choice
- `GET /api/wallet?email=` - Returns user's wallet and avatars
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `POST /api/users/avatar` - Create new avatar

### Data Structure
```javascript
// Avatar object
{
  id: number,
  name: string,
  image_url: string,
  tagline: string,
  door_choice: 'blue'|'yellow'|'red',
  is_active: boolean,
  created_at: timestamp
}
```

## Key Features Working

### ✅ Authentication System
- Email/password registration and login
- User session persistence via localStorage
- Proper error handling and validation

### ✅ Avatar Management
- Avatar creation with name, tagline, door choice
- Image generation via Leonardo AI integration
- Multiple avatars per user wallet

### ✅ Game Console
- Real-time avatar display from database
- Interactive avatar selection
- Door choice visualization with color coding
- Responsive grid and list views

### ✅ UI/UX
- Consistent sidebar styling matching dashboard
- Proper hover effects and animations
- Theme support (KTG/Light/Dark modes)
- Mobile-responsive design

## File Structure
```
modules/destiny/
├── opening.html          # Introduction page
├── newwallet.html        # Registration
├── newavatar.html        # Avatar selection
├── makeavatar.html       # Avatar creation
├── gameconsole.html      # Main game interface
├── leftconsole.html      # User profile display
├── rightconsole.html     # Avatar grid
└── login.html           # User login

database/
├── wallet_avatar_schema.sql    # Core schema
└── add_door_choice_field.sql   # Door choice enhancement

routes/
├── users.js             # User and avatar APIs
└── wallet.js           # Wallet management APIs
```

## Critical Success Factors

### 1. Data Persistence
- User data stored in database with proper relationships
- Avatar data includes all necessary game elements
- Session management via localStorage

### 2. Real-time Updates
- Game console loads live data from database
- Avatar interactions update immediately
- Fallback mechanisms for offline/empty states

### 3. Scalable Architecture
- Modular iframe-based console design
- Clean API separation
- Extensible database schema

## Next Steps for Enhancement

### Immediate Priorities
1. **JourneyBook Integration** - Connect progress bars to actual questionnaire data
2. **Safe Links** - Implement user-defined social links
3. **Avatar Interactions** - Add messaging, zapping, and social features

### Future Enhancements
1. **Real-time Messaging** - WebSocket integration for live chat
2. **Game Mechanics** - Implement door-based game logic
3. **Social Features** - Friend systems, groups, events
4. **Mobile Optimization** - Enhanced mobile game console

## Backup and Recovery
This foundation represents a stable, working base. Key components:
- Database schema with proper relationships
- Working authentication flow
- Functional game console with real data
- Consistent UI/UX patterns

**Recommendation**: Create database backup before major changes and maintain this documentation as the system evolves.