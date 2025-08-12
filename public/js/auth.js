// Authentication Module
import API from './api.js';

class Auth {
    constructor() {
        this.currentUser = null;
        this.loadUserFromStorage();
    }

    async login(email, password) {
        try {
            const response = await API.loginUser({ email, password });
            
            if (response.success) {
                this.currentUser = response.user;
                this.saveUserToStorage();
                this.dispatchAuthEvent('login', this.currentUser);
                return response.user;
            }
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    }

    async register(userData) {
        try {
            const response = await API.registerUser(userData);
            
            if (response.success) {
                // Auto-login after registration
                return await this.login(userData.email, userData.password);
            }
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('ktg_user');
        this.dispatchAuthEvent('logout');
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    saveUserToStorage() {
        if (this.currentUser) {
            localStorage.setItem('ktg_user', JSON.stringify(this.currentUser));
        }
    }

    loadUserFromStorage() {
        const stored = localStorage.getItem('ktg_user');
        if (stored) {
            this.currentUser = JSON.parse(stored);
        }
    }

    dispatchAuthEvent(type, user = null) {
        window.dispatchEvent(new CustomEvent('auth-change', {
            detail: { type, user }
        }));
    }
}

export default new Auth();