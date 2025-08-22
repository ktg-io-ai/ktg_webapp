const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Read the complete questions data file
const questionsDataPath = path.join(__dirname, '../modules/journeybook/questions-data.js');
const questionsDataContent = fs.readFileSync(questionsDataPath, 'utf8');

// Extract the JOURNEYBOOK_QUESTIONS object
const match = questionsDataContent.match(/const JOURNEYBOOK_QUESTIONS = ({[\s\S]*?});/);
if (!match) {
    console.error('Could not extract JOURNEYBOOK_QUESTIONS from file');
    process.exit(1);
}

const JOURNEYBOOK_QUESTIONS = eval('(' + match[1] + ')');

async function importCompleteJourneyBookImages() {
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
        let totalUpdated = 0;
        let notFound = 0;
        
        // Process each section
        for (const [section, subgroups] of Object.entries(JOURNEYBOOK_QUESTIONS)) {
            console.log(`\nProcessing section: ${section}`);
            
            for (const [subgroup, questions] of Object.entries(subgroups)) {
                console.log(`  Processing subgroup: ${subgroup} (${questions.length} questions)`);
                
                for (const question of questions) {
                    if (question.image) {
                        totalProcessed++;
                        
                        try {
                            const [result] = await connection.execute(
                                'UPDATE journeybook_pages SET image_url = ? WHERE section = ? AND subgroup = ? AND question = ?',
                                [question.image, section, subgroup, question.question]
                            );
                            
                            if (result.affectedRows > 0) {
                                totalUpdated++;
                                console.log(`    ✓ ${question.question.substring(0, 50)}...`);
                            } else {
                                notFound++;
                                console.log(`    ✗ NOT FOUND: ${question.question.substring(0, 50)}...`);
                            }
                        } catch (error) {
                            console.error(`    ERROR: ${question.question.substring(0, 30)}... - ${error.message}`);
                        }
                    }
                }
            }
        }
        
        console.log(`\n=== COMPLETE IMPORT SUMMARY ===`);
        console.log(`Total questions with images processed: ${totalProcessed}`);
        console.log(`Successfully updated: ${totalUpdated}`);
        console.log(`Not found in database: ${notFound}`);
        console.log(`Success rate: ${((totalUpdated/totalProcessed)*100).toFixed(1)}%`);
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

importCompleteJourneyBookImages();