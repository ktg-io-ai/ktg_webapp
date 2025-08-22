const mysql = require('mysql2/promise');

async function updateToAIImages() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_local_dev'
        });
        
        console.log('Updating image URLs to use Pollinations.ai...');
        
        // Get all questions
        const [questions] = await connection.execute('SELECT id, section, subgroup, question, image_url FROM journeybook_pages');
        
        let updated = 0;
        
        for (const question of questions) {
            // Create AI prompt from question
            const prompt = `${question.question} - journeybook illustration, clean simple design`;
            const encodedPrompt = encodeURIComponent(prompt);
            const seed = Math.abs(question.question.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
            
            // Generate Pollinations.ai URL
            const aiImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=512&seed=${seed}`;
            
            // Update database
            await connection.execute(
                'UPDATE journeybook_pages SET image_url = ? WHERE id = ?',
                [aiImageUrl, question.id]
            );
            
            updated++;
            if (updated % 50 === 0) {
                console.log(`Updated ${updated} questions...`);
            }
        }
        
        console.log(`\nCompleted! Updated ${updated} questions with AI-generated image URLs.`);
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

updateToAIImages();