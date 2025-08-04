// Game Service for GameConsole Actions
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase.js';
import { authService } from './auth.js';
import { WalletService } from '../utils/wallet.js';

// Game actions enum
export const GAME_ACTIONS = {
  ZAP: 'ZAP',
  HIDE: 'HIDE', 
  TRUTH: 'TRUTH',
  DOOR4: 'DOOR4',
  BOMB: 'BOMB',
  STAR: 'STAR'
};

export class GameService {
  // Create new game session
  static async createGameSession(participants = []) {
    try {
      const currentWalletId = authService.getWalletId();
      if (!currentWalletId) throw new Error('No authenticated user');

      const sessionData = {
        participants: participants.length > 0 ? participants : [currentWalletId],
        status: 'active',
        actions: [],
        created_at: serverTimestamp(),
        termination: null,
        memories_to_wallet: false
      };

      const sessionRef = await addDoc(collection(db, 'GameSessions'), sessionData);
      return sessionRef.id;
    } catch (error) {
      console.error('Error creating game session:', error);
      throw error;
    }
  }

  // Execute game action
  static async executeAction(sessionId, action, targetWalletId = null, data = {}) {
    try {
      const currentWalletId = authService.getWalletId();
      if (!currentWalletId) throw new Error('No authenticated user');

      if (!Object.values(GAME_ACTIONS).includes(action)) {
        throw new Error('Invalid game action');
      }

      // Get session
      const sessionRef = doc(db, 'GameSessions', sessionId);
      const sessionDoc = await getDoc(sessionRef);
      
      if (!sessionDoc.exists()) {
        throw new Error('Game session not found');
      }

      const sessionData = sessionDoc.data();
      
      // Check if user is participant
      if (!sessionData.participants.includes(currentWalletId)) {
        throw new Error('User not authorized for this session');
      }

      // Create action record
      const actionRecord = {
        actor: currentWalletId,
        action: action,
        target: targetWalletId,
        timestamp: serverTimestamp(),
        data: data
      };

      // Update session with new action
      const updatedActions = [...(sessionData.actions || []), actionRecord];
      await updateDoc(sessionRef, {
        actions: updatedActions,
        last_action: serverTimestamp()
      });

      // Process action effects
      await this.processActionEffects(action, currentWalletId, targetWalletId, data);

      return actionRecord;
    } catch (error) {
      console.error('Error executing action:', error);
      throw error;
    }
  }

  // Process action effects on wallets/users
  static async processActionEffects(action, actorWalletId, targetWalletId, data) {
    try {
      switch (action) {
        case GAME_ACTIONS.ZAP:
          if (targetWalletId) {
            // Reduce target's lives
            await this.updateUserLives(targetWalletId, -1);
            // Award actor with tokens
            await WalletService.updateTokenBalance(actorWalletId, 10);
          }
          break;

        case GAME_ACTIONS.BOMB:
          // Reduce actor's lives but award diamonds
          await this.updateUserLives(actorWalletId, -1);
          await WalletService.updateDiamonds(actorWalletId, 1);
          break;

        case GAME_ACTIONS.STAR:
          // Award life tokens
          await WalletService.updateLifeTokens(actorWalletId, 'one_life_token_balance', 1);
          break;

        case GAME_ACTIONS.TRUTH:
          // Award tokens for truth action
          await WalletService.updateTokenBalance(actorWalletId, 5);
          break;

        case GAME_ACTIONS.HIDE:
          // No immediate effect, but record action
          break;

        case GAME_ACTIONS.DOOR4:
          // Special door action - award significant tokens
          await WalletService.updateTokenBalance(actorWalletId, 50);
          break;

        default:
          console.log('No effects for action:', action);
      }
    } catch (error) {
      console.error('Error processing action effects:', error);
      throw error;
    }
  }

  // Update user lives
  static async updateUserLives(walletId, change) {
    try {
      // Get user by wallet ID
      const usersQuery = query(
        collection(db, 'Users'), 
        where('wallet_id', '==', walletId)
      );
      const userDocs = await getDocs(usersQuery);
      
      if (!userDocs.empty) {
        const userDoc = userDocs.docs[0];
        const currentLives = userDoc.data().lives || 0;
        const newLives = Math.max(0, currentLives + change);
        
        await updateDoc(userDoc.ref, {
          lives: newLives
        });
      }
    } catch (error) {
      console.error('Error updating user lives:', error);
      throw error;
    }
  }

  // Get active game sessions for user
  static async getUserActiveSessions(walletId) {
    try {
      const sessionsQuery = query(
        collection(db, 'GameSessions'),
        where('participants', 'array-contains', walletId),
        where('status', '==', 'active'),
        orderBy('created_at', 'desc')
      );

      const sessionDocs = await getDocs(sessionsQuery);
      return sessionDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting user sessions:', error);
      throw error;
    }
  }

  // End game session
  static async endGameSession(sessionId, termination = 'manual') {
    try {
      const sessionRef = doc(db, 'GameSessions', sessionId);
      await updateDoc(sessionRef, {
        status: 'ended',
        termination: termination,
        ended_at: serverTimestamp(),
        memories_to_wallet: true
      });

      // Process memories to wallets
      await this.processSessionMemories(sessionId);
    } catch (error) {
      console.error('Error ending game session:', error);
      throw error;
    }
  }

  // Process session memories to wallets
  static async processSessionMemories(sessionId) {
    try {
      const sessionDoc = await getDoc(doc(db, 'GameSessions', sessionId));
      if (!sessionDoc.exists()) return;

      const sessionData = sessionDoc.data();
      const memoryId = `mem_${sessionId}_${Date.now()}`;

      // Add memory to all participants' wallets
      for (const walletId of sessionData.participants) {
        await WalletService.addMemory(walletId, memoryId);
      }
    } catch (error) {
      console.error('Error processing session memories:', error);
      throw error;
    }
  }

  // Get game statistics
  static async getGameStats(walletId) {
    try {
      const sessionsQuery = query(
        collection(db, 'GameSessions'),
        where('participants', 'array-contains', walletId)
      );

      const sessionDocs = await getDocs(sessionsQuery);
      let totalActions = 0;
      let actionCounts = {};

      sessionDocs.docs.forEach(doc => {
        const actions = doc.data().actions || [];
        actions.forEach(action => {
          if (action.actor === walletId) {
            totalActions++;
            actionCounts[action.action] = (actionCounts[action.action] || 0) + 1;
          }
        });
      });

      return {
        totalSessions: sessionDocs.size,
        totalActions,
        actionBreakdown: actionCounts
      };
    } catch (error) {
      console.error('Error getting game stats:', error);
      throw error;
    }
  }
}

export default GameService;