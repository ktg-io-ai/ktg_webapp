// Environment Configuration - Local & Server Setup
const config = {
    development: {
        // Local development
        database: {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'ktg_enhanced_local'
        },
        server: {
            port: 3000,
            host: 'localhost'
        },
        baseUrl: 'http://localhost:3000'
    },
    
    production: {
        // Server/hosting environment
        database: {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'karmath1_user',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'karmath1_ktg_enhanced'
        },
        server: {
            port: process.env.PORT || 80,
            host: '0.0.0.0'
        },
        baseUrl: process.env.BASE_URL || 'https://yourdomain.com'
    }
};

const environment = process.env.NODE_ENV || 'development';
module.exports = config[environment];