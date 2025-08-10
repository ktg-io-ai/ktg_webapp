// KTG Authentication API Client
class KTGAuth {
    constructor() {
        this.baseURL = '/api';
        this.token = localStorage.getItem('ktg_token');
    }

    // Login user
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password})
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('ktg_token', data.token);
                localStorage.setItem('ktg_user', JSON.stringify(data.user));
                return {success: true, user: data.user};
            } else {
                return {success: false, error: data.error};
            }
        } catch (error) {
            return {success: false, error: 'Connection failed'};
        }
    }

    // Register user
    async register(email, password, avatarData = {}) {
        try {
            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, password, avatarData})
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.token = data.token;
                localStorage.setItem('ktg_token', data.token);
                localStorage.setItem('ktg_user', JSON.stringify(data.user));
                return {success: true, user: data.user};
            } else {
                return {success: false, error: data.error};
            }
        } catch (error) {
            return {success: false, error: 'Connection failed'};
        }
    }

    // Get user profile
    async getProfile() {
        if (!this.token) return {success: false, error: 'Not authenticated'};
        
        try {
            const response = await fetch(`${this.baseURL}/user/profile`, {
                headers: {'Authorization': `Bearer ${this.token}`}
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return {success: true, user: data};
            } else {
                return {success: false, error: data.error};
            }
        } catch (error) {
            return {success: false, error: 'Connection failed'};
        }
    }

    // Update avatar data
    async updateAvatar(avatarData) {
        if (!this.token) return {success: false, error: 'Not authenticated'};
        
        try {
            const response = await fetch(`${this.baseURL}/user/avatar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({avatarData})
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return {success: true};
            } else {
                return {success: false, error: data.error};
            }
        } catch (error) {
            return {success: false, error: 'Connection failed'};
        }
    }

    // Save JourneyBook response
    async saveJourneyBook(questionId, answer) {
        if (!this.token) return {success: false, error: 'Not authenticated'};
        
        try {
            const response = await fetch(`${this.baseURL}/user/journeybook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({questionId, answer})
            });
            
            const data = await response.json();
            
            if (response.ok) {
                return {success: true};
            } else {
                return {success: false, error: data.error};
            }
        } catch (error) {
            return {success: false, error: 'Connection failed'};
        }
    }

    // Get all users (admin)
    async getAllUsers() {
        try {
            const response = await fetch(`${this.baseURL}/user/all`);
            const data = await response.json();
            
            if (response.ok) {
                return {success: true, users: data};
            } else {
                return {success: false, error: data.error};
            }
        } catch (error) {
            return {success: false, error: 'Connection failed'};
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Logout
    logout() {
        this.token = null;
        localStorage.removeItem('ktg_token');
        localStorage.removeItem('ktg_user');
    }

    // Get current user from localStorage
    getCurrentUser() {
        const userData = localStorage.getItem('ktg_user');
        return userData ? JSON.parse(userData) : null;
    }
}

// Create global instance
window.KTGAuth = new KTGAuth();