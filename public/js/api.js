// API Module - Backend communication
class API {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'API request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // User endpoints
    async registerUser(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async loginUser(credentials) {
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    async getUserProfile(userId) {
        return this.request(`/users/${userId}`);
    }

    // Gaming endpoints
    async createDestinySession(sessionData) {
        return this.request('/gaming/destiny/session', {
            method: 'POST',
            body: JSON.stringify(sessionData)
        });
    }

    async getPlayerStats(userId) {
        return this.request(`/gaming/stats/${userId}`);
    }

    async getBucketList(userId) {
        return this.request(`/gaming/bucketlist/${userId}`);
    }

    async enterDoor4(userId, action) {
        return this.request('/gaming/door4/enter', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, action })
        });
    }

    // Lucy AI endpoints
    async getLucyStatus() {
        return this.request('/lucy/status');
    }
}

export default new API();