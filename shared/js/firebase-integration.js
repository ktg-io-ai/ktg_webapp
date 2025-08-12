// Firebase Integration for Frontend Components
// This file provides easy access to Firebase services for HTML pages

// Import Firebase services
import { authService } from '../../src/core/auth.js';
import { gameConsoleAPI } from '../../src/api/gameConsole.js';
import { lifestylesAPI } from '../../src/api/lifestyles.js';
import { WalletService } from '../../src/utils/wallet.js';

// Global Firebase integration object
window.KTGFirebase = {
  // Authentication
  auth: {
    async signIn(email, password) {
      try {
        const user = await authService.signIn(email, password);
        return { success: true, user };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async register(email, password, avatarName) {
      try {
        const result = await authService.register(email, password, avatarName);
        return { success: true, ...result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async signOut() {
      try {
        await authService.signOut();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getCurrentUser() {
      return authService.currentUser;
    },

    getWalletId() {
      return authService.getWalletId();
    },

    isAuthenticated() {
      return !!authService.currentUser;
    },

    onAuthStateChange(callback) {
      return authService.onAuthStateChange(callback);
    }
  },

  // Game Console
  game: {
    async init() {
      try {
        const sessionId = await gameConsoleAPI.init();
        return { success: true, sessionId };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async zap(targetWalletId) {
      try {
        const result = await gameConsoleAPI.zap(targetWalletId);
        return { success: true, result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async hide() {
      try {
        const result = await gameConsoleAPI.hide();
        return { success: true, result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async truth(truthData) {
      try {
        const result = await gameConsoleAPI.truth(truthData);
        return { success: true, result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async door4() {
      try {
        const result = await gameConsoleAPI.door4();
        return { success: true, result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async bomb() {
      try {
        const result = await gameConsoleAPI.bomb();
        return { success: true, result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async star() {
      try {
        const result = await gameConsoleAPI.star();
        return { success: true, result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async getStats() {
      try {
        const stats = await gameConsoleAPI.getStats();
        return { success: true, stats };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getAvailableActions() {
      return gameConsoleAPI.getAvailableActions();
    }
  },

  // Lifestyles/Listings
  lifestyles: {
    async getListings(location, limit) {
      try {
        const listings = await lifestylesAPI.getListings(location, limit);
        return { success: true, listings };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async createListing(listingData) {
      try {
        const listingId = await lifestylesAPI.createListing(listingData);
        return { success: true, listingId };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async claimListing(listingId) {
      try {
        const result = await lifestylesAPI.claimListing(listingId);
        return { success: true, result };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async searchListings(searchTerm, location) {
      try {
        const listings = await lifestylesAPI.searchListings(searchTerm, location);
        return { success: true, listings };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getCategories() {
      return lifestylesAPI.getCategories();
    },

    getPrizeTypes() {
      return lifestylesAPI.getPrizeTypes();
    },

    setLocation(location) {
      lifestylesAPI.setLocation(location);
    }
  },

  // Wallet
  wallet: {
    async getBalance(walletId) {
      try {
        const balance = await WalletService.getBalanceSummary(walletId);
        return { success: true, balance };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async updateTokens(walletId, amount) {
      try {
        await WalletService.updateTokenBalance(walletId, amount);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async updateDiamonds(walletId, amount) {
      try {
        await WalletService.updateDiamonds(walletId, amount);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Utility functions
  utils: {
    formatDate(timestamp) {
      if (!timestamp) return 'N/A';
      const date = timestamp.seconds ? 
        new Date(timestamp.seconds * 1000) : 
        new Date(timestamp);
      return date.toLocaleDateString();
    },

    formatTime(timestamp) {
      if (!timestamp) return 'N/A';
      const date = timestamp.seconds ? 
        new Date(timestamp.seconds * 1000) : 
        new Date(timestamp);
      return date.toLocaleTimeString();
    },

    generateId() {
      return Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
    }
  }
};

// Initialize authentication state listener
authService.onAuthStateChange((user) => {
  // Dispatch custom event for auth state changes
  window.dispatchEvent(new CustomEvent('ktg-auth-change', { 
    detail: { user, isAuthenticated: !!user } 
  }));
});

// Export for module usage
export default window.KTGFirebase;