// Database Configuration for Local Development
const mysql = require('mysql2/promise');

const dbConfig = {
    development: {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'ktg_local_dev',
        port: 3306,
        charset: 'utf8mb4',
        timezone: '+00:00'
    },
    production: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'ktg_user',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'ktg_production',
        port: process.env.DB_PORT || 3306,
        charset: 'utf8mb4',
        timezone: '+00:00'
    }
};

const environment = process.env.NODE_ENV || 'development';
const config = dbConfig[environment];

// Create connection pool
const pool = mysql.createPool({
    ...config,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000
});

// Database helper functions
class Database {
    static async query(sql, params = []) {
        try {
            const [rows] = await pool.execute(sql, params);
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    }

    static async getConnection() {
        return await pool.getConnection();
    }

    static async transaction(callback) {
        const connection = await this.getConnection();
        try {
            await connection.beginTransaction();
            const result = await callback(connection);
            await connection.commit();
            return result;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // User operations
    static async createUser(userData) {
        const sql = `INSERT INTO users (email, password_hash, wallet_id, username, first_name, last_name) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        return await this.query(sql, [
            userData.email,
            userData.password_hash,
            userData.wallet_id,
            userData.username || null,
            userData.first_name || null,
            userData.last_name || null
        ]);
    }

    static async getUserByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const users = await this.query(sql, [email]);
        return users[0] || null;
    }

    static async getUserById(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const users = await this.query(sql, [id]);
        return users[0] || null;
    }

    // Lucy AI operations
    static async getLucyCharacter() {
        const sql = 'SELECT * FROM ai_characters WHERE name = "Lucy" AND is_active = 1';
        const characters = await this.query(sql);
        return characters[0] || null;
    }

    static async createCampaign(campaignData) {
        const sql = `INSERT INTO external_campaigns (lucy_id, platform, campaign_type, content_data, status) 
                     VALUES (?, ?, ?, ?, ?)`;
        return await this.query(sql, [
            campaignData.lucy_id,
            campaignData.platform,
            campaignData.campaign_type,
            JSON.stringify(campaignData.content_data),
            campaignData.status || 'active'
        ]);
    }

    // Gaming operations
    static async createDestinySession(sessionData) {
        const sql = `INSERT INTO destiny_sessions (user_id, session_name, lives_used, doors_chosen, door_results, session_data) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        return await this.query(sql, [
            sessionData.user_id,
            sessionData.session_name,
            sessionData.lives_used,
            JSON.stringify(sessionData.doors_chosen),
            JSON.stringify(sessionData.door_results),
            JSON.stringify(sessionData.session_data)
        ]);
    }

    static async getUserTokens(userId) {
        const sql = 'SELECT * FROM user_tokens WHERE user_id = ?';
        return await this.query(sql, [userId]);
    }

    // Wallet operations
    static async createWallet(userId, walletId) {
        const sql = `INSERT INTO wallets (user_id, wallet_id) VALUES (?, ?)`;
        return await this.query(sql, [userId, walletId]);
    }

    static async getWalletByUserId(userId) {
        const sql = 'SELECT * FROM wallets WHERE user_id = ?';
        const wallets = await this.query(sql, [userId]);
        return wallets[0] || null;
    }

    // Avatar operations
    static async createAvatar(avatarData) {
        const sql = `INSERT INTO avatars (wallet_id, name, gender, tagline, image_url, generation_count) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        return await this.query(sql, [
            avatarData.walletId,
            avatarData.name,
            avatarData.gender,
            avatarData.tagline,
            avatarData.imageUrl,
            avatarData.generationCount || 1
        ]);
    }

    static async getAllActiveAvatars() {
        const sql = `SELECT a.*, w.user_id, u.email, u.user_image, u.account_title 
                     FROM avatars a 
                     JOIN wallets w ON a.wallet_id = w.wallet_id 
                     JOIN users u ON w.user_id = u.id 
                     WHERE a.is_active = TRUE 
                     ORDER BY a.created_at DESC`;
        return await this.query(sql);
    }

    static async updateUserProfile(userId, profileData) {
        const sql = `UPDATE users SET user_image = ?, account_title = ? WHERE id = ?`;
        return await this.query(sql, [
            profileData.userImage || null,
            profileData.accountTitle || null,
            userId
        ]);
    }

    // Ideas operations
    static async createIdea(ideaData) {
        const sql = `INSERT INTO ideas (user_id, title, description, location, image, category, tags) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        return await this.query(sql, [
            ideaData.user_id,
            ideaData.title,
            ideaData.description,
            ideaData.location,
            ideaData.image,
            ideaData.category,
            JSON.stringify(ideaData.tags || [])
        ]);
    }

    static async getIdeas(limit = 50) {
        const sql = 'SELECT * FROM ideas WHERE is_active = TRUE ORDER BY created_at DESC LIMIT ?';
        return await this.query(sql, [limit]);
    }

    // JourneyBook operations
    static async saveJourneyBookAnswer(avatarId, questionKey, answer) {
        // Extract page ID from questionKey if it contains page ID, otherwise hash it
        let pageId;
        if (questionKey.includes('page_')) {
            pageId = parseInt(questionKey.split('page_')[1]) || 1;
        } else {
            // Hash questionKey to create unique page_id
            pageId = Math.abs(questionKey.split('').reduce((a, b) => {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a;
            }, 0));
        }
        
        const sql = `INSERT INTO avatar_journeybook_responses (avatar_id, page_id, answer) 
                     VALUES (?, ?, ?) 
                     ON DUPLICATE KEY UPDATE answer = VALUES(answer), updated_at = CURRENT_TIMESTAMP`;
        return await this.query(sql, [avatarId, pageId, answer]);
    }

    static async getJourneyBookAnswers(avatarId) {
        const sql = 'SELECT page_id, answer FROM avatar_journeybook_responses WHERE avatar_id = ?';
        const results = await this.query(sql, [avatarId]);
        const answers = {};
        results.forEach(row => {
            answers[`page_${row.page_id}`] = row.answer;
        });
        return answers;
    }

    static async getPublicJourneyBooks() {
        const sql = `SELECT a.id as avatar_id, a.name, a.gender, a.tagline, a.image_url, 
                            COUNT(jr.id) as answer_count
                     FROM avatars a 
                     LEFT JOIN avatar_journeybook_responses jr ON a.id = jr.avatar_id 
                     WHERE a.is_active = TRUE 
                     GROUP BY a.id 
                     HAVING answer_count > 0 
                     ORDER BY answer_count DESC`;
        return await this.query(sql);
    }

    static async getAvatarJourneyBook(avatarId) {
        const sql = `SELECT a.name, a.gender, a.tagline, a.image_url,
                            jr.page_id, jr.answer
                     FROM avatars a 
                     LEFT JOIN avatar_journeybook_responses jr ON a.id = jr.avatar_id 
                     WHERE a.id = ? AND a.is_active = TRUE`;
        return await this.query(sql, [avatarId]);
    }

    // JourneyBook Page Template operations
    static async saveJourneyBookPage(section, subgroup, question, options, imageUrl, pageNumber) {
        const sql = `INSERT INTO journeybook_pages (section, subgroup, question, options, image_url, page_number) 
                     VALUES (?, ?, ?, ?, ?, ?) 
                     ON DUPLICATE KEY UPDATE image_url = VALUES(image_url), updated_at = CURRENT_TIMESTAMP`;
        return await this.query(sql, [section, subgroup, question, JSON.stringify(options), imageUrl, pageNumber]);
    }

    // JourneyBook Image operations
    static async saveJourneyBookImage(avatarId, pageNumber, imageUrl, prompt) {
        const sql = `INSERT INTO journeybook_images (avatar_id, page_number, image_url, prompt_used) 
                     VALUES (?, ?, ?, ?) 
                     ON DUPLICATE KEY UPDATE image_url = VALUES(image_url), prompt_used = VALUES(prompt_used), updated_at = CURRENT_TIMESTAMP`;
        return await this.query(sql, [avatarId, pageNumber, imageUrl, prompt]);
    }

    static async getJourneyBookImages(avatarId) {
        const sql = 'SELECT page_number, image_url, prompt_used FROM journeybook_images WHERE avatar_id = ? ORDER BY page_number';
        return await this.query(sql, [avatarId]);
    }

    static async getJourneyBookImage(avatarId, pageNumber) {
        const sql = 'SELECT image_url, prompt_used FROM journeybook_images WHERE avatar_id = ? AND page_number = ?';
        const results = await this.query(sql, [avatarId, pageNumber]);
        return results[0] || null;
    }

    static async getJourneyBookPageImage(pageNumber) {
        const sql = 'SELECT image_url FROM journeybook_pages WHERE page_number = ?';
        const results = await this.query(sql, [pageNumber]);
        return results[0] || null;
    }
}

module.exports = { Database, pool, config };