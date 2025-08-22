# JourneyBook Answer Persistence Fix

## Problem
Avatar answers in the JourneyBook were not being saved or loaded properly. Only "how much do you weigh" was being recorded, and when users returned, their previous answers were not displayed.

## Root Cause
There was a mismatch between the frontend question key format and the database schema:

1. **Frontend** was sending question keys like `page_123` 
2. **Database functions** were trying to extract numeric IDs and store them in a `page_id` column
3. **API routes** were using a different table (`avatar_answers`) instead of the correct table (`avatar_journeybook_responses`)
4. **Loading function** was reconstructing keys as `page_${page_id}` but the original keys didn't match this pattern

## Solution

### 1. Updated Database Schema
- Added `question_key` column to `avatar_journeybook_responses` table
- Changed unique constraint from `(avatar_id, page_id)` to `(avatar_id, question_key)`
- Added index on `question_key` for performance

### 2. Fixed Database Functions
**Before:**
```javascript
// Tried to extract page_id from questionKey
let pageId = parseInt(questionKey.split('page_')[1]) || 1;
// Stored in page_id column
```

**After:**
```javascript
// Store questionKey directly
const sql = `INSERT INTO avatar_journeybook_responses (avatar_id, question_key, answer) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE answer = VALUES(answer)`;
```

### 3. Fixed API Routes
**Before:**
```javascript
// Used wrong table and extracted question_id
const questionId = questionKey.replace('page_', '');
await Database.query(`INSERT INTO avatar_answers...`);
```

**After:**
```javascript
// Use correct Database helper function
await Database.saveJourneyBookAnswer(avatarId, questionKey, answer);
```

### 4. Migration Script
Created `scripts/check-journeybook-table.js` to:
- Check current table structure
- Add `question_key` column if missing
- Migrate existing data
- Update constraints and indexes
- Test the functions

## Files Modified

1. **config/database.js**
   - `saveJourneyBookAnswer()` - Store questionKey directly
   - `getJourneyBookAnswers()` - Return answers with original questionKey format
   - `getAvatarJourneyBook()` - Updated to use question_key column

2. **routes/users.js**
   - `/journeybook/answer` POST route - Use Database helper function
   - `/journeybook/:avatarId` GET route - Use Database helper function

3. **database/fix_journeybook_responses_schema.sql**
   - Migration script to update table structure

4. **scripts/check-journeybook-table.js**
   - Automated migration and testing script

## Testing
Run the migration script:
```bash
node scripts/check-journeybook-table.js
```

## Expected Behavior After Fix
1. ✅ All avatar answers are saved to database with correct question keys
2. ✅ When user returns to JourneyBook, all previously selected answers are displayed
3. ✅ Multiple choice options show as selected
4. ✅ Text inputs show previously entered values
5. ✅ Progress is maintained across sessions

## Database Schema Changes
```sql
-- Add question_key column
ALTER TABLE avatar_journeybook_responses 
ADD COLUMN question_key VARCHAR(255) NOT NULL AFTER avatar_id;

-- Update unique constraint
ALTER TABLE avatar_journeybook_responses 
DROP INDEX unique_avatar_page,
ADD UNIQUE KEY unique_avatar_question (avatar_id, question_key);

-- Add performance index
CREATE INDEX idx_avatar_responses_question ON avatar_journeybook_responses(question_key);
```