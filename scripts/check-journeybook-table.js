const { Database } = require('../config/database');

async function checkAndFixJourneybookTable() {
    try {
        console.log('Checking avatar_journeybook_responses table structure...');
        
        // Check if table exists and get its structure
        const tableInfo = await Database.query(`
            DESCRIBE avatar_journeybook_responses
        `);
        
        console.log('Current table structure:');
        tableInfo.forEach(column => {
            console.log(`- ${column.Field}: ${column.Type} ${column.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${column.Key ? `(${column.Key})` : ''}`);
        });
        
        // Check if question_key column exists
        const hasQuestionKey = tableInfo.some(column => column.Field === 'question_key');
        
        if (!hasQuestionKey) {
            console.log('\nAdding question_key column...');
            
            // Add question_key column
            await Database.query(`
                ALTER TABLE avatar_journeybook_responses 
                ADD COLUMN question_key VARCHAR(255) AFTER avatar_id
            `);
            
            // Update existing records to use question_key format
            await Database.query(`
                UPDATE avatar_journeybook_responses 
                SET question_key = CONCAT('page_', page_id) 
                WHERE question_key IS NULL
            `);
            
            // Make question_key NOT NULL
            await Database.query(`
                ALTER TABLE avatar_journeybook_responses 
                MODIFY COLUMN question_key VARCHAR(255) NOT NULL
            `);
            
            // Drop old unique constraint if it exists
            try {
                await Database.query(`
                    ALTER TABLE avatar_journeybook_responses 
                    DROP INDEX unique_avatar_page
                `);
            } catch (e) {
                console.log('Old unique constraint not found (this is OK)');
            }
            
            // Add new unique constraint
            await Database.query(`
                ALTER TABLE avatar_journeybook_responses 
                ADD UNIQUE KEY unique_avatar_question (avatar_id, question_key)
            `);
            
            // Add index for faster queries
            await Database.query(`
                CREATE INDEX idx_avatar_responses_question ON avatar_journeybook_responses(question_key)
            `);
            
            console.log('✅ Table migration completed successfully!');
        } else {
            console.log('✅ Table already has question_key column');
        }
        
        // Test the functions
        console.log('\nTesting database functions...');
        
        // Test saving an answer
        await Database.saveJourneyBookAnswer(1, 'test_question_key', 'test answer');
        console.log('✅ Save function works');
        
        // Test loading answers
        const answers = await Database.getJourneyBookAnswers(1);
        console.log('✅ Load function works, found answers:', Object.keys(answers));
        
        console.log('\n🎉 All tests passed!');
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        process.exit(0);
    }
}

checkAndFixJourneybookTable();