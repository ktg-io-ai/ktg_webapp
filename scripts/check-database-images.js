const mysql = require('mysql2/promise');

async function checkDatabaseImages() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_local_dev'
        });
        
        // Get sample questions with their image URLs
        const [samples] = await connection.execute(`
            SELECT section, subgroup, question, image_url 
            FROM journeybook_pages 
            WHERE section = 'values' AND subgroup = 'TRAIT'
            LIMIT 5
        `);
        
        console.log('=== SAMPLE DATABASE RECORDS ===');
        samples.forEach(row => {
            console.log(`${row.section}/${row.subgroup}: ${row.question}`);
            console.log(`Image URL: ${row.image_url || 'NULL'}`);
            console.log('---');
        });
        
        // Check if any images are missing
        const [missing] = await connection.execute(`
            SELECT COUNT(*) as count 
            FROM journeybook_pages 
            WHERE image_url IS NULL OR image_url = ''
        `);
        
        console.log(`Questions without images: ${missing[0].count}`);
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkDatabaseImages();