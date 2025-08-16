# PROJECT DIRECTIVE - KTG WEBAPP

## PRIMARY GOAL
**COMPLETE MIGRATION FROM FIREBASE TO MYSQL**
- Full autonomy on MySQL database
- NO Firebase dependencies
- All data (users, avatars, questions) in MySQL

## CURRENT STATUS
- ✅ MySQL database structure created
- ✅ New users/avatars storing in MySQL  
- ❌ Questions still loading from Firebase
- ❌ Game console not loading MySQL avatars
- ❌ JourneyBook using Firebase (REVERT THIS)

## IMMEDIATE TASKS
1. Fix JourneyBook to load questions from MySQL API
2. Fix game console to load avatars from MySQL
3. Migrate existing Firebase questions to MySQL
4. Remove all Firebase dependencies

## FORBIDDEN ACTIONS
- ❌ DO NOT suggest Firebase solutions
- ❌ DO NOT create hybrid Firebase/MySQL approaches
- ❌ DO NOT revert to Firebase when MySQL APIs fail

## WHEN MYSQL APIs FAIL
- Fix the MySQL API endpoint
- Debug database connection
- Check SQL queries
- DO NOT fallback to Firebase

## FILE ORGANIZATION
- Documentation: `/docs/` folder only
- No markdown files in root directory
- Consolidate all project docs in `/docs/`

## ADDITIONAL INFORMATION
- Documentation: `/docs/MASTER_PLAN.MD` 
- Documentation: `/docs/DEVELOPMENT.MD`
- Documentation: `/docs/DESIGN.MD`