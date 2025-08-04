// GameConsole API Integration
import { GameService, GAME_ACTIONS } from '../core/gameService.js';
import { authService } from '../core/auth.js';

class GameConsoleAPI {
  constructor() {
    this.currentSessionId = null;
    this.isConnected = false;
  }

  // Initialize game console
  async init() {
    try {
      // Check if user is authenticated
      if (!authService.currentUser) {
        throw new Error('User must be authenticated to use game console');
      }

      // Get or create active session
      const walletId = authService.getWalletId();
      const activeSessions = await GameService.getUserActiveSessions(walletId);
      
      if (activeSessions.length > 0) {
        this.currentSessionId = activeSessions[0].id;
      } else {
        this.currentSessionId = await GameService.createGameSession();
      }

      this.isConnected = true;
      return this.currentSessionId;
    } catch (error) {
      console.error('Error initializing game console:', error);
      throw error;
    }
  }

  // Execute ZAP action
  async zap(targetWalletId) {
    try {
      if (!this.isConnected) await this.init();
      
      return await GameService.executeAction(
        this.currentSessionId, 
        GAME_ACTIONS.ZAP, 
        targetWalletId
      );
    } catch (error) {
      console.error('Error executing ZAP:', error);
      throw error;
    }
  }

  // Execute HIDE action
  async hide() {
    try {
      if (!this.isConnected) await this.init();
      
      return await GameService.executeAction(
        this.currentSessionId, 
        GAME_ACTIONS.HIDE
      );
    } catch (error) {
      console.error('Error executing HIDE:', error);
      throw error;
    }
  }

  // Execute TRUTH action
  async truth(truthData) {
    try {
      if (!this.isConnected) await this.init();
      
      return await GameService.executeAction(
        this.currentSessionId, 
        GAME_ACTIONS.TRUTH, 
        null, 
        truthData
      );
    } catch (error) {
      console.error('Error executing TRUTH:', error);
      throw error;
    }
  }

  // Execute DOOR4 action
  async door4() {
    try {
      if (!this.isConnected) await this.init();
      
      return await GameService.executeAction(
        this.currentSessionId, 
        GAME_ACTIONS.DOOR4
      );
    } catch (error) {
      console.error('Error executing DOOR4:', error);
      throw error;
    }
  }

  // Execute BOMB action
  async bomb() {
    try {
      if (!this.isConnected) await this.init();
      
      return await GameService.executeAction(
        this.currentSessionId, 
        GAME_ACTIONS.BOMB
      );
    } catch (error) {
      console.error('Error executing BOMB:', error);
      throw error;
    }
  }

  // Execute STAR action
  async star() {
    try {
      if (!this.isConnected) await this.init();
      
      return await GameService.executeAction(
        this.currentSessionId, 
        GAME_ACTIONS.STAR
      );
    } catch (error) {
      console.error('Error executing STAR:', error);
      throw error;
    }
  }

  // Get current session status
  async getSessionStatus() {
    try {
      if (!this.currentSessionId) return null;
      
      const sessions = await GameService.getUserActiveSessions(authService.getWalletId());
      return sessions.find(session => session.id === this.currentSessionId) || null;
    } catch (error) {
      console.error('Error getting session status:', error);
      throw error;
    }
  }

  // End current session
  async endSession() {
    try {
      if (!this.currentSessionId) return;
      
      await GameService.endGameSession(this.currentSessionId);
      this.currentSessionId = null;
      this.isConnected = false;
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }

  // Get game statistics
  async getStats() {
    try {
      const walletId = authService.getWalletId();
      if (!walletId) throw new Error('No authenticated user');
      
      return await GameService.getGameStats(walletId);
    } catch (error) {
      console.error('Error getting game stats:', error);
      throw error;
    }
  }

  // Get available actions based on user state
  getAvailableActions() {
    const userRole = authService.getUserRole();
    const baseActions = [GAME_ACTIONS.ZAP, GAME_ACTIONS.HIDE, GAME_ACTIONS.TRUTH];
    
    // Add special actions based on role/level
    if (userRole >= 1) { // Creator level
      baseActions.push(GAME_ACTIONS.DOOR4);
    }
    
    if (userRole >= 5) { // Higher creator level
      baseActions.push(GAME_ACTIONS.BOMB, GAME_ACTIONS.STAR);
    }
    
    return baseActions;
  }
}

// Create singleton instance
export const gameConsoleAPI = new GameConsoleAPI();

// Export for use in GameConsole components
export default gameConsoleAPI;