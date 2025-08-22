const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const questionsDataPath = path.join(__dirname, '../modules/journeybook/questions-data.js');
const questionsDataContent = fs.readFileSync(questionsDataPath, 'utf8');
const match = questionsDataContent.match(/const JOURNEYBOOK_QUESTIONS = ({[\s\S]*?});/);
const JOURNEYBOOK_QUESTIONS = eval('(' + match[1] + ')');

async function importAllQuestions() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_local_dev'
        });
        
        console.log('Connected to database');
        
        let totalProcessed = 0;
        let inserted = 0;
        let updated = 0;
        
        for (const [section, subgroups] of Object.entries(JOURNEYBOOK_QUESTIONS)) {
            console.log(`\nProcessing section: ${section}`);
            
            for (const [subgroup, questions] of Object.entries(subgroups)) {
                console.log(`  Processing subgroup: ${subgroup} (${questions.length} questions)`);
                
                for (const question of questions) {
                    totalProcessed++;
                    
                    try {
                        const pageNumber = `${section}_${subgroup}_${question.question}`.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
                        
                        // Check if exists
                        const [existing] = await connection.execute(
                            'SELECT id FROM journeybook_pages WHERE section = ? AND subgroup = ? AND question = ?',
                            [section, subgroup, question.question]
                        );
                        
                        if (existing.length > 0) {
                            // Update with image if available
                            if (question.image) {
                                await connection.execute(
                                    'UPDATE journeybook_pages SET image_url = ? WHERE id = ?',
                                    [question.image, existing[0].id]
                                );
                            }
                            updated++;
                        } else {
                            // Insert new question
                            await connection.execute(
                                'INSERT INTO journeybook_pages (section, subgroup, question, options, image_url, page_number) VALUES (?, ?, ?, ?, ?, ?)',
                                [section, subgroup, question.question, JSON.stringify(question.options || []), question.image || '', pageNumber]
                            );
                            inserted++;
                            console.log(`    + Added: ${question.question.substring(0, 50)}...`);
                        }
                        
                    } catch (error) {
                        console.error(`    ERROR: ${question.question.substring(0, 30)}... - ${error.message}`);
                    }
                }
            }
        }
        
        console.log(`\n=== IMPORT SUMMARY ===`);
        console.log(`Total questions processed: ${totalProcessed}`);
        console.log(`New questions inserted: ${inserted}`);
        console.log(`Existing questions updated: ${updated}`);
        
        // Final count
        const [finalCount] = await connection.execute('SELECT COUNT(*) as total FROM journeybook_pages');
        console.log(`Total questions in database: ${finalCount[0].total}`);
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

importAllQuestions();