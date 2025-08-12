// Enhanced Database Configuration
// Add this to your existing config system

const enhancedDbConfig = {
    // Database connection
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'your_username',
        password: process.env.DB_PASSWORD || 'your_password',
        database: process.env.DB_NAME || 'ktg_enhanced',
        charset: 'utf8mb4',
        timezone: 'Z'
    },
    
    // Feature flags - enable gradually
    features: {
        socialConnections: true,
        enhancedChat: true,
        userPosts: true,
        achievements: true,
        notifications: true,
        advancedJourneyBook: true,
        ideasSharing: true
    },
    
    // Integration with existing modules
    modules: {
        destiny: {
            enableMultiplayer: true,
            enableSocialSharing: true
        },
        chess: {
            enableTournaments: true,
            enableSpectators: true
        },
        music: {
            enableCollaborativePlaylists: true,
            enableSocialSharing: true
        }
    }
};

module.exports = enhancedDbConfig;