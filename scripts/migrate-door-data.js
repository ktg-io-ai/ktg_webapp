const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ktg_local_dev'
};

async function migrateDoorData() {
    let connection;
    
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');
        
        // Clean up existing test data
        await connection.execute("DELETE FROM lifestyle_listings WHERE creator_id IN (SELECT id FROM user_creator_profiles WHERE creator_name LIKE '%@ktg.test%' OR creator_name IN ('Sarah Chen', 'Mike Rodriguez', 'Emma Thompson', 'Dr. James Wilson', 'Carlos Mendez'))");
        await connection.execute("DELETE FROM user_creator_profiles WHERE creator_name IN ('Sarah Chen', 'Mike Rodriguez', 'Emma Thompson', 'Dr. James Wilson', 'Carlos Mendez')");
        await connection.execute("DELETE FROM users WHERE email LIKE '%@ktg.test'");
        
        const testListings = [
            {
                title: 'Mindfulness Meditation Workshop',
                description: 'Learn the fundamentals of mindfulness meditation in a peaceful setting.',
                door_category: 'Blue',
                location: 'New York',
                creator_name: 'Sarah Chen',
                price_range: 'medium'
            },
            {
                title: 'Rock Climbing Adventure', 
                description: 'Outdoor rock climbing experience for beginners and intermediate climbers.',
                door_category: 'Yellow',
                location: 'Los Angeles',
                creator_name: 'Mike Rodriguez',
                price_range: 'high'
            },
            {
                title: 'Wine Tasting & Intimate Dinner',
                description: 'Exclusive wine tasting paired with a romantic dinner experience.',
                door_category: 'Red',
                location: 'San Francisco',
                creator_name: 'Emma Thompson',
                price_range: 'luxury'
            }
        ];
        
        const [doorCategories] = await connection.execute('SELECT id, name FROM door_categories');
        const doorCategoryMap = {};
        doorCategories.forEach(cat => {
            doorCategoryMap[cat.name] = cat.id;
        });
        
        const [locations] = await connection.execute('SELECT id, city FROM locations');
        const locationMap = {};
        locations.forEach(loc => {
            locationMap[loc.city] = loc.id;
        });
        
        const creatorNames = [...new Set(testListings.map(l => l.creator_name))];
        const creatorIds = {};
        
        for (const creatorName of creatorNames) {
            const email = `${creatorName.toLowerCase().replace(/[^a-z]/g, '')}@ktg.test`;
            const walletId = `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const [userResult] = await connection.execute(
                'INSERT INTO users (email, password_hash, wallet_id, username, first_name) VALUES (?, ?, ?, ?, ?)',
                [email, 'test_hash', walletId, creatorName, creatorName]
            );
            
            await connection.execute(
                'INSERT INTO wallets (user_id, wallet_id) VALUES (?, ?)',
                [userResult.insertId, walletId]
            );
            
            const [creatorResult] = await connection.execute(
                'INSERT INTO user_creator_profiles (user_id, creator_role_id, creator_name, bio, approval_status) VALUES (?, ?, ?, ?, ?)',
                [userResult.insertId, 6, creatorName, `Professional creator: ${creatorName}`, 'approved']
            );
            
            creatorIds[creatorName] = creatorResult.insertId;
            console.log(`Created creator: ${creatorName}`);
        }
        
        let insertedCount = 0;
        
        for (const listing of testListings) {
            const doorCategoryId = doorCategoryMap[listing.door_category];
            const locationId = locationMap[listing.location];
            const creatorId = creatorIds[listing.creator_name];
            
            if (!doorCategoryId || !locationId || !creatorId) {
                console.warn(`Skipping ${listing.title} - missing data`);
                continue;
            }
            
            await connection.execute(`
                INSERT INTO lifestyle_listings (
                    creator_id, title, description, location_id, door_category_id, 
                    price_range, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, 'published', NOW())
            `, [
                creatorId,
                listing.title,
                listing.description,
                locationId,
                doorCategoryId,
                listing.price_range
            ]);
            
            insertedCount++;
            console.log(`✓ Inserted: ${listing.title} (${listing.door_category} door)`);
        }
        
        console.log(`\n✅ Migration completed! Inserted ${insertedCount} test listings.`);
        
    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

if (require.main === module) {
    migrateDoorData();
}

module.exports = { migrateDoorData };