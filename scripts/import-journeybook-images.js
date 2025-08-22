const mysql = require('mysql2/promise');

async function importJourneyBookImages() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_local_dev'
        });
        
        console.log('Connected to database');
        
        // Sample questions with images from the original data
        const questionsWithImages = [
            { section: 'values', subgroup: 'TRAIT', question: 'Your age is UNDER', image: '../../JOURNEYBOOK/Values/age.jpg' },
            { section: 'values', subgroup: 'TRAIT', question: 'Your GENDER IS', image: '../../JOURNEYBOOK/Values/groupphoto01.jpg' },
            { section: 'values', subgroup: 'Core', question: 'Is Race Important?', image: '../../JOURNEYBOOK/Values/race.jpg' },
            { section: 'compatibility', subgroup: 'Intellect', question: 'Alchemy', image: '../../JOURNEYBOOK/Compatibility/alchemy.png' },
            { section: 'intimacy', subgroup: 'Basic', question: 'Is Quantity as Important as Quality', image: '../../JOURNEYBOOK/Intimacy/jbimage_xx (1).jpg' }
        ];
        
        let totalUpdated = 0;
        
        for (const item of questionsWithImages) {
            try {
                const [result] = await connection.execute(
                    'UPDATE journeybook_pages SET image_url = ? WHERE section = ? AND subgroup = ? AND question = ?',
                    [item.image, item.section, item.subgroup, item.question]
                );
                
                if (result.affectedRows > 0) {
                    console.log(`Updated: ${item.section}/${item.subgroup}/${item.question}`);
                    totalUpdated++;
                } else {
                    console.log(`Not found: ${item.section}/${item.subgroup}/${item.question}`);
                }
            } catch (error) {
                console.error(`Error updating ${item.question}:`, error.message);
            }
        }
        
        console.log(`\nTotal questions updated with images: ${totalUpdated}`);
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

importJourneyBookImages();