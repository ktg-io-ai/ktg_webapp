# AI Assistant Guidelines for KTG Project

## 🤖 Important Instructions for AI Assistants

### File Organization Rules
- **ALL documentation files (.md) belong in the `docs/` folder**
- **NEVER create .md files in the root directory** (except README.md)
- When creating documentation, always use path: `docs/filename.md`
- When referencing docs, look in `docs/` folder first

### Project Structure Understanding
```
ktg_webapp/
├── README.md                    # Only .md file allowed in root
├── AI_READ_THIS.md             # This file - AI guidelines
├── docs/                       # ALL documentation goes here
│   ├── DESTINY_FOUNDATION.md   # Working Destiny module docs
│   ├── DESIGN.md              # UI/UX guidelines
│   ├── DEVELOPMENT.md         # Dev setup and workflows
│   └── [other .md files]      # All project documentation
├── modules/destiny/           # Working game console system
├── database/                  # Schema and SQL files
├── routes/                    # API endpoints
└── [other project folders]
```

### Key Working Systems (as of current state)
1. **Destiny Module** - Complete user/avatar/gameconsole system
2. **Database Schema** - Users, wallets, avatars with door_choice field
3. **Authentication** - Email/password with localStorage sessions
4. **Game Console** - Three-panel interface with real-time data

### Critical Files to Preserve
- `modules/destiny/gameconsole.html` - Main game interface
- `modules/destiny/leftconsole.html` - User profile display  
- `modules/destiny/rightconsole.html` - Avatar grid
- `routes/users.js` - User/avatar API endpoints
- `database/wallet_avatar_schema.sql` - Core database structure

### Development Principles
- **Minimal code changes** - Only modify what's necessary
- **Preserve working systems** - Don't break existing functionality
- **Database-first** - Store data properly, not just in localStorage
- **Clean architecture** - Modular, scalable design patterns

### When Working on This Project
1. Check `docs/DESTINY_FOUNDATION.md` for current working state
2. Understand the user flow: opening → newwallet → newavatar → makeavatar → gameconsole
3. Test changes against the working authentication and avatar systems
4. Document significant changes in appropriate `docs/` files

### Common Tasks
- **UI fixes**: Usually in CSS within HTML files
- **Data flow**: Check API endpoints in `routes/` folder
- **Database**: SQL files in `database/` folder
- **New features**: Build on existing foundation, don't rebuild

Remember: This project has a working foundation. Build upon it, don't replace it.