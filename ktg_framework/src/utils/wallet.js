// Wallet Utility Functions
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../core/firebase.js';

// Generate unique wallet ID
export function generateWalletId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ktg_${timestamp}_${randomStr}`;
}

// Wallet operations class
export class WalletService {
  // Get wallet by ID
  static async getWallet(walletId) {
    try {
      const walletDoc = await getDoc(doc(db, 'Wallet', walletId));
      return walletDoc.exists() ? walletDoc.data() : null;
    } catch (error) {
      console.error('Error getting wallet:', error);
      throw error;
    }
  }

  // Update token balance
  static async updateTokenBalance(walletId, amount) {
    try {
      await updateDoc(doc(db, 'Wallet', walletId), {
        token_balance: increment(amount)
      });
    } catch (error) {
      console.error('Error updating token balance:', error);
      throw error;
    }
  }

  // Update life tokens
  static async updateLifeTokens(walletId, tokenType, amount) {
    const validTokenTypes = [
      'one_life_token_balance',
      'three_life_token_balance', 
      'six_life_token_balance',
      'nine_life_token_balance',
      'one_thousand_life_token_balance'
    ];

    if (!validTokenTypes.includes(tokenType)) {
      throw new Error('Invalid token type');
    }

    try {
      await updateDoc(doc(db, 'Wallet', walletId), {
        [tokenType]: increment(amount)
      });
    } catch (error) {
      console.error('Error updating life tokens:', error);
      throw error;
    }
  }

  // Update diamonds
  static async updateDiamonds(walletId, amount) {
    try {
      await updateDoc(doc(db, 'Wallet', walletId), {
        diamonds_balance: increment(amount)
      });
    } catch (error) {
      console.error('Error updating diamonds:', error);
      throw error;
    }
  }

  // Add encapsulated memory
  static async addMemory(walletId, memoryId) {
    try {
      const walletRef = doc(db, 'Wallet', walletId);
      const walletDoc = await getDoc(walletRef);
      
      if (walletDoc.exists()) {
        const currentMemories = walletDoc.data().encapsulated_memories || [];
        await updateDoc(walletRef, {
          encapsulated_memories: [...currentMemories, memoryId]
        });
      }
    } catch (error) {
      console.error('Error adding memory:', error);
      throw error;
    }
  }

  // Get wallet balance summary
  static async getBalanceSummary(walletId) {
    try {
      const wallet = await this.getWallet(walletId);
      if (!wallet) return null;

      return {
        tokens: wallet.token_balance || 0,
        diamonds: wallet.diamonds_balance || 0,
        lifeTokens: {
          one: wallet.one_life_token_balance || 0,
          three: wallet.three_life_token_balance || 0,
          six: wallet.six_life_token_balance || 0,
          nine: wallet.nine_life_token_balance || 0,
          thousand: wallet.one_thousand_life_token_balance || 0
        },
        memories: wallet.encapsulated_memories?.length || 0,
        level: wallet.profile_level || 1
      };
    } catch (error) {
      console.error('Error getting balance summary:', error);
      throw error;
    }
  }
}

export default WalletService;