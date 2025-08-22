const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const questionsDataPath = path.join(__dirname, '../modules/journeybook/questions-data.js');
const questionsDataContent = fs.readFileSync(questionsDataPath, 'utf8');
const match = questionsDataContent.match(/const JOURNEYBOOK_QUESTIONS = ({[\s\S]*?});/);
const JOURNEYBOOK_QUESTIONS = eval('(' + match[1] + ')');

async function restoreOriginalImages() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_local_dev'
        });
        
        console.log('Restoring original image paths...');
        
        let restored = 0;
        
        for (const [section, subgroups] of Object.entries(JOURNEYBOOK_QUESTIONS)) {
            for (const [subgroup, questions] of Object.entries(subgroups)) {
                for (const question of questions) {
                    if (question.image) {
                        await connection.execute(
                            'UPDATE journeybook_pages SET image_url = ? WHERE section = ? AND subgroup = ? AND question = ?',
                            [question.image, section, subgroup, question.question]
                        );
                        restored++;
                    }
                }
            }
        }
        
        console.log(`Restored ${restored} original image paths`);
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

restoreOriginalImages();