const mysql = require('mysql2/promise');

async function createAvatarAnswersTable() {
    let connection;
    
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_local_dev'
        });
        
        // Create avatar_answers table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS avatar_answers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                avatar_id INT NOT NULL,
                question_id INT NOT NULL,
                answer TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (avatar_id) REFERENCES avatars(id) ON DELETE CASCADE,
                FOREIGN KEY (question_id) REFERENCES journeybook_pages(id) ON DELETE CASCADE,
                UNIQUE KEY unique_avatar_question (avatar_id, question_id)
            )
        `);
        
        console.log('Created avatar_answers table successfully');
        
    } catch (error) {
        console.error('Database error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

createAvatarAnswersTable();