const mysql = require('mysql2/promise');

async function addImageLinkField() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_local_dev'
        });
        
        // Add image_link column if it doesn't exist
        await connection.execute(`
            ALTER TABLE journeybook_pages 
            ADD COLUMN IF NOT EXISTS image_link VARCHAR(500) DEFAULT NULL
        `);
        
        console.log('Added image_link field to journeybook_pages table');
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

addImageLinkField();