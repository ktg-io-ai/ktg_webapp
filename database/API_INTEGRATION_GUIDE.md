# KTG Enhanced Database API Integration Guide

This guide provides examples of how to integrate the enhanced database schema with your KTG webapp APIs.

## Table of Contents
1. [User Management](#user-management)
2. [Social Features](#social-features)
3. [Gaming System](#gaming-system)
4. [Ideas & Experiences](#ideas--experiences)
5. [JourneyBook System](#journeybook-system)
6. [Chat & Messaging](#chat--messaging)
7. [Media & Playlists](#media--playlists)

## User Management

### Enhanced User Registration
```javascript
// Enhanced user registration with profile data
async function registerUser(userData) {
    const query = `
        INSERT INTO users (
            email, password_hash, wallet_id, username, first_name, last_name,
            phone, country_id, tagline, about_me, birth_date, gender,
            relationship_status, profile_visibility
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const walletId = `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const values = [
        userData.email,
        await bcrypt.hash(userData.password, 10),
        walletId,
        userData.username,
        userData.firstName,
        userData.lastName,
        userData.phone,
        userData.countryId,
        userData.tagline || null,
        userData.aboutMe || null,
        userData.birthDate || null,
        userData.gender || null,
        userData.relationshipStatus || 'single',
        userData.profileVisibility || 'public'
    ];
    
    return await db.execute(query, values);
}
```

### Get User Profile with Stats
```javascript
async function getUserProfile(userId) {
    const query = `
        SELECT 
            u.*,
            COUNT(DISTINCT CASE WHEN uc.status = 'accepted' AND uc.connection_type = 'friend' THEN uc.id END) as friends_count,
            COUNT(DISTINCT up.id) as posts_count,
            COUNT(DISTINCT ua.id) as achievements_count,
            COUNT(DISTINCT ut.id) as total_tokens
        FROM users u
        LEFT JOIN user_connections uc ON (u.id = uc.requester_id OR u.id = uc.addressee_id)
        LEFT JOIN user_posts up ON u.id = up.user_id
        LEFT JOIN user_achievements ua ON u.id = ua.user_id
        LEFT JOIN user_tokens ut ON u.id = ut.user_id
        WHERE u.id = ?
        GROUP BY u.id
    `;
    
    const [rows] = await db.execute(query, [userId]);
    return rows[0];
}
```

## Social Features

### Friend Request System
```javascript
// Send friend request
async function sendFriendRequest(requesterId, addresseeId) {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Insert friend request
        await connection.execute(
            `INSERT INTO user_connections (requester_id, addressee_id, status, connection_type) 
             VALUES (?, ?, 'pending', 'friend')`,
            [requesterId, addresseeId]
        );
        
        // Create notification
        await connection.execute(
            `INSERT INTO user_notifications (user_id, type, title, content, related_user_id) 
             VALUES (?, 'friend_request', 'New Friend Request', ?, ?)`,
            [
                addresseeId,
                `${await getUserName(requesterId)} sent you a friend request`,
                requesterId
            ]
        );
        
        await connection.commit();
        return { success: true };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Accept friend request
async function acceptFriendRequest(connectionId, userId) {
    const query = `
        UPDATE user_connections 
        SET status = 'accepted', updated_at = NOW() 
        WHERE id = ? AND addressee_id = ? AND status = 'pending'
    `;
    
    return await db.execute(query, [connectionId, userId]);
}

// Get user's friends
async function getUserFriends(userId, limit = 50, offset = 0) {
    const query = `
        SELECT 
            u.id, u.username, u.first_name, u.last_name, u.tagline,
            ua.avatar_image, uc.created_at as friends_since
        FROM user_connections uc
        JOIN users u ON (
            CASE 
                WHEN uc.requester_id = ? THEN u.id = uc.addressee_id
                ELSE u.id = uc.requester_id
            END
        )
        LEFT JOIN user_avatars ua ON u.id = ua.user_id AND ua.is_active = TRUE
        WHERE (uc.requester_id = ? OR uc.addressee_id = ?)
        AND uc.status = 'accepted' AND uc.connection_type = 'friend'
        ORDER BY uc.created_at DESC
        LIMIT ? OFFSET ?
    `;
    
    const [rows] = await db.execute(query, [userId, userId, userId, limit, offset]);
    return rows;
}
```

### User Posts & Social Feed
```javascript
// Create a new post
async function createPost(userId, postData) {
    const query = `
        INSERT INTO user_posts (user_id, content, media_attachments, post_type, privacy)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    const values = [
        userId,
        postData.content,
        JSON.stringify(postData.mediaAttachments || []),
        postData.postType || 'status',
        postData.privacy || 'public'
    ];
    
    return await db.execute(query, values);
}

// Get social feed for user
async function getSocialFeed(userId, limit = 20, offset = 0) {
    const query = `
        SELECT 
            p.*, u.username, u.first_name, u.last_name,
            ua.avatar_image,
            COUNT(DISTINCT pl.id) as likes_count,
            COUNT(DISTINCT pc.id) as comments_count,
            EXISTS(SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = ?) as user_liked
        FROM user_posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN user_avatars ua ON u.id = ua.user_id AND ua.is_active = TRUE
        LEFT JOIN post_likes pl ON p.id = pl.post_id
        LEFT JOIN post_comments pc ON p.id = pc.post_id
        WHERE (
            p.privacy = 'public' OR 
            p.user_id = ? OR
            EXISTS(
                SELECT 1 FROM user_connections uc 
                WHERE ((uc.requester_id = ? AND uc.addressee_id = p.user_id) OR 
                       (uc.addressee_id = ? AND uc.requester_id = p.user_id))
                AND uc.status = 'accepted'
            )
        )
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    `;
    
    const [rows] = await db.execute(query, [userId, userId, userId, userId, limit, offset]);
    return rows;
}
```

## Gaming System

### Destiny Game Session Management
```javascript
// Start new Destiny session
async function startDestinySession(userId, livesUsed) {
    const query = `
        INSERT INTO destiny_sessions (user_id, lives_used, final_outcome, session_data)
        VALUES (?, ?, 'in_progress', ?)
    `;
    
    const sessionData = {
        doors_available: [1, 2, 3, 4],
        current_round: 1,
        total_rounds: 3,
        doors_chosen: [],
        door_results: []
    };
    
    const [result] = await db.execute(query, [userId, livesUsed, JSON.stringify(sessionData)]);
    return result.insertId;
}

// Update Destiny session with door choice
async function chooseDoor(sessionId, doorNumber, userId) {
    // Get current session
    const [sessions] = await db.execute(
        'SELECT session_data FROM destiny_sessions WHERE id = ? AND user_id = ?',
        [sessionId, userId]
    );
    
    if (!sessions.length) throw new Error('Session not found');
    
    const sessionData = JSON.parse(sessions[0].session_data);
    sessionData.doors_chosen.push(doorNumber);
    
    // Simulate door result (replace with your game logic)
    const doorResult = {
        door: doorNumber,
        outcome: Math.random() > 0.5 ? 'win' : 'lose',
        tokens_won: Math.random() > 0.5 ? Math.floor(Math.random() * 10) + 1 : 0,
        timestamp: new Date()
    };
    
    sessionData.door_results.push(doorResult);
    sessionData.current_round++;
    
    // Update session
    await db.execute(
        'UPDATE destiny_sessions SET session_data = ?, updated_at = NOW() WHERE id = ?',
        [JSON.stringify(sessionData), sessionId]
    );
    
    return doorResult;
}

// Complete Destiny session
async function completeDestinySession(sessionId, userId, finalOutcome) {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        // Get session data
        const [sessions] = await connection.execute(
            'SELECT session_data FROM destiny_sessions WHERE id = ? AND user_id = ?',
            [sessionId, userId]
        );
        
        const sessionData = JSON.parse(sessions[0].session_data);
        const totalTokensWon = sessionData.door_results.reduce((sum, result) => sum + result.tokens_won, 0);
        
        // Update session
        await connection.execute(
            `UPDATE destiny_sessions 
             SET final_outcome = ?, tokens_won = ?, ended_at = NOW() 
             WHERE id = ?`,
            [finalOutcome, totalTokensWon, sessionId]
        );
        
        // Award tokens if won
        if (totalTokensWon > 0) {
            await connection.execute(
                `INSERT INTO user_tokens (user_id, token_type, quantity, purchase_price) 
                 VALUES (?, 'diamond', ?, 0)`,
                [userId, totalTokensWon]
            );
        }
        
        // Award achievement if first win
        if (finalOutcome === 'win') {
            await connection.execute(
                `INSERT IGNORE INTO user_achievements (user_id, achievement_type, achievement_data)
                 VALUES (?, 'destiny_winner', ?)`,
                [userId, JSON.stringify({ first_win: new Date(), tokens_won: totalTokensWon })]
            );
        }
        
        await connection.commit();
        return { success: true, tokens_won: totalTokensWon };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}
```

### Chess Game Management
```javascript
// Start chess game
async function startChessGame(userId, opponentType, opponentId = null, aiDifficulty = null) {
    const query = `
        INSERT INTO chess_sessions (user_id, opponent_type, opponent_user_id, ai_difficulty, game_state)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    const initialGameState = {
        board: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', // FEN notation
        current_player: 'white',
        moves: [],
        captured_pieces: { white: [], black: [] }
    };
    
    const values = [
        userId,
        opponentType,
        opponentId,
        aiDifficulty,
        JSON.stringify(initialGameState)
    ];
    
    const [result] = await db.execute(query, values);
    return result.insertId;
}

// Make chess move
async function makeChessMove(sessionId, userId, move) {
    const [sessions] = await db.execute(
        'SELECT game_state, moves_count FROM chess_sessions WHERE id = ? AND (user_id = ? OR opponent_user_id = ?)',
        [sessionId, userId, userId]
    );
    
    if (!sessions.length) throw new Error('Game not found');
    
    const gameState = JSON.parse(sessions[0].game_state);
    gameState.moves.push(move);
    
    // Update game state (implement chess logic here)
    const newMovesCount = sessions[0].moves_count + 1;
    
    await db.execute(
        'UPDATE chess_sessions SET game_state = ?, moves_count = ?, updated_at = NOW() WHERE id = ?',
        [JSON.stringify(gameState), newMovesCount, sessionId]
    );
    
    return gameState;
}
```

## Ideas & Experiences

### Create and Manage Ideas
```javascript
// Create new idea/experience
async function createIdea(userId, ideaData) {
    const query = `
        INSERT INTO ideas (
            user_id, title, description, location, image, cost_range, cost_details,
            start_date, end_date, category, tags, difficulty_level, group_size_min,
            group_size_max, age_restriction, external_link, contact_email
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
        userId,
        ideaData.title,
        ideaData.description,
        ideaData.location,
        ideaData.image,
        ideaData.costRange || 'medium',
        ideaData.costDetails,
        ideaData.startDate,
        ideaData.endDate,
        ideaData.category || 'entertainment',
        JSON.stringify(ideaData.tags || []),
        ideaData.difficultyLevel || 'moderate',
        ideaData.groupSizeMin || 1,
        ideaData.groupSizeMax || 10,
        ideaData.ageRestriction || 0,
        ideaData.externalLink,
        ideaData.contactEmail
    ];
    
    return await db.execute(query, values);
}

// Search ideas with filters
async function searchIdeas(filters = {}, limit = 20, offset = 0) {
    let query = `
        SELECT 
            i.*, u.username as creator_name,
            COUNT(DISTINCT ir.id) as likes_count,
            COUNT(DISTINCT ubl.id) as bucket_list_count
        FROM ideas i
        JOIN users u ON i.user_id = u.id
        LEFT JOIN idea_reactions ir ON i.id = ir.idea_id
        LEFT JOIN user_bucket_list ubl ON i.id = ubl.idea_id
        WHERE i.is_active = TRUE
    `;
    
    const values = [];
    
    if (filters.category) {
        query += ' AND i.category = ?';
        values.push(filters.category);
    }
    
    if (filters.location) {
        query += ' AND i.location LIKE ?';
        values.push(`%${filters.location}%`);
    }
    
    if (filters.costRange) {
        query += ' AND i.cost_range = ?';
        values.push(filters.costRange);
    }
    
    if (filters.tags && filters.tags.length > 0) {
        query += ' AND JSON_OVERLAPS(i.tags, ?)';
        values.push(JSON.stringify(filters.tags));
    }
    
    query += `
        GROUP BY i.id
        ORDER BY i.is_featured DESC, i.created_at DESC
        LIMIT ? OFFSET ?
    `;
    
    values.push(limit, offset);
    
    const [rows] = await db.execute(query, values);
    return rows;
}

// Add idea to bucket list
async function addToBucketList(userId, ideaId, status = 'want_to_do', priority = 'medium') {
    const query = `
        INSERT INTO user_bucket_list (user_id, idea_id, status, priority)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        status = VALUES(status), priority = VALUES(priority), updated_at = NOW()
    `;
    
    return await db.execute(query, [userId, ideaId, status, priority]);
}
```

## JourneyBook System

### JourneyBook Questions and Responses
```javascript
// Get JourneyBook questions by category
async function getJourneyBookQuestions(categoryId = null) {
    let query = `
        SELECT jq.*, jc.name as category_name, jc.color as category_color
        FROM journeybook_questions jq
        JOIN journeybook_categories jc ON jq.category_id = jc.id
        WHERE jq.is_active = TRUE
    `;
    
    const values = [];
    
    if (categoryId) {
        query += ' AND jq.category_id = ?';
        values.push(categoryId);
    }
    
    query += ' ORDER BY jc.sort_order, jq.sort_order';
    
    const [rows] = await db.execute(query, values);
    return rows;
}

// Save JourneyBook response
async function saveJourneyBookResponse(userId, questionId, answer, numericValue = null, isPrivate = false) {
    const query = `
        INSERT INTO journeybook_responses (user_id, question_id, answer, numeric_value, is_private)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        answer = VALUES(answer), numeric_value = VALUES(numeric_value), 
        is_private = VALUES(is_private), updated_at = NOW()
    `;
    
    return await db.execute(query, [userId, questionId, answer, numericValue, isPrivate]);
}

// Get user's JourneyBook profile
async function getUserJourneyBook(userId, viewerId = null) {
    const query = `
        SELECT 
            jr.*, jq.question_text, jq.question_type, jq.options,
            jc.name as category_name, jc.color as category_color
        FROM journeybook_responses jr
        JOIN journeybook_questions jq ON jr.question_id = jq.id
        JOIN journeybook_categories jc ON jq.category_id = jc.id
        WHERE jr.user_id = ?
        ${viewerId !== userId ? 'AND jr.is_private = FALSE' : ''}
        ORDER BY jc.sort_order, jq.sort_order
    `;
    
    const [rows] = await db.execute(query, [userId]);
    
    // Group by category
    const categories = {};
    rows.forEach(row => {
        if (!categories[row.category_name]) {
            categories[row.category_name] = {
                name: row.category_name,
                color: row.category_color,
                responses: []
            };
        }
        categories[row.category_name].responses.push(row);
    });
    
    return categories;
}
```

## Chat & Messaging

### Enhanced Chat System
```javascript
// Create or get direct conversation
async function getOrCreateDirectConversation(userId1, userId2) {
    // Check if conversation already exists
    let query = `
        SELECT cc.id FROM chat_conversations cc
        JOIN chat_participants cp1 ON cc.id = cp1.conversation_id AND cp1.user_id = ?
        JOIN chat_participants cp2 ON cc.id = cp2.conversation_id AND cp2.user_id = ?
        WHERE cc.type = 'direct'
    `;
    
    let [rows] = await db.execute(query, [userId1, userId2]);
    
    if (rows.length > 0) {
        return rows[0].id;
    }
    
    // Create new conversation
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        
        // Create conversation
        const [result] = await connection.execute(
            'INSERT INTO chat_conversations (type) VALUES ("direct")'
        );
        const conversationId = result.insertId;
        
        // Add participants
        await connection.execute(
            'INSERT INTO chat_participants (conversation_id, user_id) VALUES (?, ?), (?, ?)',
            [conversationId, userId1, conversationId, userId2]
        );
        
        await connection.commit();
        return conversationId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

// Send message
async function sendMessage(conversationId, senderId, content, messageType = 'text', mediaUrl = null) {
    const query = `
        INSERT INTO chat_messages (conversation_id, sender_id, message_type, content, media_url)
        VALUES (?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.execute(query, [conversationId, senderId, messageType, content, mediaUrl]);
    
    // Update conversation timestamp
    await db.execute(
        'UPDATE chat_conversations SET updated_at = NOW() WHERE id = ?',
        [conversationId]
    );
    
    return result.insertId;
}

// Get conversation messages
async function getConversationMessages(conversationId, userId, limit = 50, offset = 0) {
    // Verify user is participant
    const [participants] = await db.execute(
        'SELECT 1 FROM chat_participants WHERE conversation_id = ? AND user_id = ?',
        [conversationId, userId]
    );
    
    if (!participants.length) {
        throw new Error('Access denied');
    }
    
    const query = `
        SELECT 
            cm.*, u.username, u.first_name, u.last_name,
            ua.avatar_image,
            EXISTS(SELECT 1 FROM message_read_status WHERE message_id = cm.id AND user_id = ?) as is_read
        FROM chat_messages cm
        JOIN users u ON cm.sender_id = u.id
        LEFT JOIN user_avatars ua ON u.id = ua.user_id AND ua.is_active = TRUE
        WHERE cm.conversation_id = ?
        ORDER BY cm.created_at DESC
        LIMIT ? OFFSET ?
    `;
    
    const [rows] = await db.execute(query, [userId, conversationId, limit, offset]);
    return rows.reverse(); // Return in chronological order
}

// Mark messages as read
async function markMessagesAsRead(conversationId, userId) {
    const query = `
        INSERT IGNORE INTO message_read_status (message_id, user_id)
        SELECT cm.id, ? FROM chat_messages cm
        WHERE cm.conversation_id = ? AND cm.sender_id != ?
    `;
    
    return await db.execute(query, [userId, conversationId, userId]);
}
```

## Media & Playlists

### Music Playlist Management
```javascript
// Create playlist
async function createPlaylist(userId, name, description = '', isPublic = false) {
    const query = `
        INSERT INTO user_playlists (user_id, name, description, is_public)
        VALUES (?, ?, ?, ?)
    `;
    
    return await db.execute(query, [userId, name, description, isPublic]);
}

// Add song to playlist
async function addSongToPlaylist(playlistId, songData, userId) {
    // Verify playlist ownership or collaboration
    const [playlists] = await db.execute(
        'SELECT user_id, is_collaborative FROM user_playlists WHERE id = ?',
        [playlistId]
    );
    
    if (!playlists.length) throw new Error('Playlist not found');
    
    const playlist = playlists[0];
    if (playlist.user_id !== userId && !playlist.is_collaborative) {
        throw new Error('Access denied');
    }
    
    const query = `
        INSERT INTO playlist_songs (
            playlist_id, song_title, artist, album, duration, 
            file_path, external_url, cover_art, added_by_user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
        playlistId,
        songData.title,
        songData.artist,
        songData.album,
        songData.duration,
        songData.filePath,
        songData.externalUrl,
        songData.coverArt,
        userId
    ];
    
    return await db.execute(query, values);
}

// Get user's playlists
async function getUserPlaylists(userId, includePrivate = false) {
    let query = `
        SELECT 
            up.*, 
            COUNT(ps.id) as song_count,
            SUM(ps.duration) as total_duration
        FROM user_playlists up
        LEFT JOIN playlist_songs ps ON up.id = ps.playlist_id
        WHERE up.user_id = ?
    `;
    
    if (!includePrivate) {
        query += ' AND up.is_public = TRUE';
    }
    
    query += ' GROUP BY up.id ORDER BY up.created_at DESC';
    
    const [rows] = await db.execute(query, [userId]);
    return rows;
}
```

## Error Handling and Validation

### Database Connection Helper
```javascript
// Database connection with error handling
class DatabaseManager {
    constructor(config) {
        this.pool = mysql.createPool(config);
    }
    
    async execute(query, params = []) {
        try {
            return await this.pool.execute(query, params);
        } catch (error) {
            console.error('Database query error:', error);
            throw new Error('Database operation failed');
        }
    }
    
    async getConnection() {
        return await this.pool.getConnection();
    }
    
    async transaction(callback) {
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
}

// Usage
const db = new DatabaseManager({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```

This API integration guide provides a comprehensive foundation for working with the enhanced KTG database schema. Each section includes practical examples that you can adapt to your specific needs and implementation requirements.