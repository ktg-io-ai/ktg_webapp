const mysql = require('mysql2/promise');

async function verifyJourneyBookImages() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_local_dev'
        });
        
        // Get total questions
        const [totalResult] = await connection.execute('SELECT COUNT(*) as total FROM journeybook_pages');
        const totalQuestions = totalResult[0].total;
        
        // Get questions with images
        const [withImagesResult] = await connection.execute('SELECT COUNT(*) as count FROM journeybook_pages WHERE image_url IS NOT NULL AND image_url != ""');
        const questionsWithImages = withImagesResult[0].count;
        
        // Get breakdown by section
        const [sectionBreakdown] = await connection.execute(`
            SELECT 
                section,
                subgroup,
                COUNT(*) as total,
                SUM(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 ELSE 0 END) as with_images
            FROM journeybook_pages 
            GROUP BY section, subgroup 
            ORDER BY section, subgroup
        `);
        
        console.log('=== JOURNEYBOOK IMAGE STATUS ===');
        console.log(`Total questions in database: ${totalQuestions}`);
        console.log(`Questions with images: ${questionsWithImages}`);
        console.log(`Questions without images: ${totalQuestions - questionsWithImages}`);
        console.log(`Image coverage: ${((questionsWithImages/totalQuestions)*100).toFixed(1)}%`);
        
        console.log('\n=== BREAKDOWN BY SECTION ===');
        sectionBreakdown.forEach(row => {
            const coverage = ((row.with_images/row.total)*100).toFixed(1);
            console.log(`${row.section}/${row.subgroup}: ${row.with_images}/${row.total} (${coverage}%)`);
        });
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

verifyJourneyBookImages();