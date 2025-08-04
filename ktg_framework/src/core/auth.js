// Authentication Service
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';
import { generateWalletId } from '../utils/wallet.js';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentWallet = null;
    this.authStateListeners = [];
  }

  // Initialize auth state listener
  init() {
    onAuthStateChanged(auth, async (user) => {
      this.currentUser = user;
      if (user) {
        await this.loadUserWallet(user.uid);
      } else {
        this.currentWallet = null;
      }
      this.notifyAuthStateListeners(user);
    });
  }

  // Register new user with wallet
  async register(email, password, avatarName = null) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Generate wallet ID
      const walletId = generateWalletId();
      
      // Create user document
      await setDoc(doc(db, 'Users', user.uid), {
        wallet_id: walletId,
        email: email,
        role: 0, // Participant
        lives: 3,
        zaps_received: 0,
        profile_status: 'active',
        game_history: [],
        created_at: new Date(),
        avatar_name: avatarName
      });

      // Create wallet document
      await setDoc(doc(db, 'Wallet', walletId), {
        wallet_id: walletId,
        token_balance: 0,
        one_life_token_balance: 1,
        three_life_token_balance: 1,
        six_life_token_balance: 1,
        nine_life_token_balance: 1,
        one_thousand_life_token_balance: 1,
        diamonds_balance: 1,
        connected_email: email,
        profile_level: 1,
        encapsulated_memories: [],
        created_at: new Date()
      });

      // Update user profile
      if (avatarName) {
        await updateProfile(user, { displayName: avatarName });
      }

      return { user, walletId };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign out user
  async signOut() {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.currentWallet = null;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Load user wallet data
  async loadUserWallet(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'Users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const walletDoc = await getDoc(doc(db, 'Wallet', userData.wallet_id));
        if (walletDoc.exists()) {
          this.currentWallet = walletDoc.data();
        }
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  }

  // Get current user role
  getUserRole() {
    if (!this.currentUser) return null;
    return this.currentWallet?.profile_level || 0;
  }

  // Check if user is admin
  isAdmin() {
    const role = this.getUserRole();
    return role >= 99;
  }

  // Check if user is creator
  isCreator() {
    const role = this.getUserRole();
    return role >= 1 && role <= 10;
  }

  // Add auth state listener
  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
    return () => {
      this.authStateListeners = this.authStateListeners.filter(cb => cb !== callback);
    };
  }

  // Notify auth state listeners
  notifyAuthStateListeners(user) {
    this.authStateListeners.forEach(callback => callback(user));
  }

  // Get current wallet ID
  getWalletId() {
    return this.currentWallet?.wallet_id || null;
  }

  // Update user lives
  async updateLives(newLives) {
    if (!this.currentUser) throw new Error('No authenticated user');
    
    try {
      await updateDoc(doc(db, 'Users', this.currentUser.uid), {
        lives: newLives
      });
    } catch (error) {
      console.error('Error updating lives:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Initialize on import
authService.init();

export default authService;