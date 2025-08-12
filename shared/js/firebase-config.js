// Firebase Configuration and Initialization
// Simple script-based approach for HTML integration

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: "AIzaSyDrgOGvn8NHuq3T_ODse8buij9KXg1WkzI",
  authDomain: "ktgio-3k38n.firebaseapp.com",
  projectId: "ktgio-3k38n",
  storageBucket: "ktgio-3k38n.firebasestorage.app",
  messagingSenderId: "416239278754",
  appId: "1:416239278754:web:028cd9fd6f13a5a4ed95fb"
};

// Initialize Firebase (will be loaded via CDN)
let app, auth, db;

// Global KTGFirebase object
window.KTGFirebase = {
  initialized: false,
  
  // Initialize Firebase services
  async init() {
    try {
      if (typeof firebase === 'undefined') {
        throw new Error('Firebase SDK not loaded');
      }
      
      app = firebase.initializeApp(firebaseConfig);
      auth = firebase.auth();
      db = firebase.firestore();
      
      this.initialized = true;
      console.log('Firebase initialized successfully');
      return true;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      return false;
    }
  },

  // Authentication methods
  auth: {
    async signIn(email, password) {
      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async signUp(email, password) {
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async signInWithGoogle() {
      try {
        const provider = new firebase.auth.GoogleAuthProvider();
        const userCredential = await auth.signInWithPopup(provider);
        return { success: true, user: userCredential.user };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async signOut() {
      try {
        await auth.signOut();
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getCurrentUser() {
      return auth.currentUser;
    },

    getWalletId() {
      const user = auth.currentUser;
      return user ? user.uid : null;
    },

    isAuthenticated() {
      return !!auth.currentUser;
    },

    onAuthStateChange(callback) {
      return auth.onAuthStateChanged(callback);
    }
  },

  // Game Console methods
  game: {
    currentSessionId: null,

    async init() {
      try {
        if (!window.KTGFirebase.initialized) {
          throw new Error('Firebase not initialized');
        }

        const user = auth.currentUser;
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Create or get session
        const sessionId = 'session_' + Date.now();
        this.currentSessionId = sessionId;

        // Create session document
        await db.collection('GameSessions').doc(sessionId).set({
          participants: [user.uid],
          status: 'active',
          created_at: firebase.firestore.FieldValue.serverTimestamp(),
          actions: []
        });

        return { success: true, sessionId };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async zap(targetWalletId) {
      try {
        if (!this.currentSessionId) {
          await this.init();
        }

        const user = auth.currentUser;
        const actionData = {
          actor: user.uid,
          action: 'ZAP',
          target: targetWalletId,
          timestamp: new Date()
        };

        await db.collection('GameSessions').doc(this.currentSessionId).update({
          actions: firebase.firestore.FieldValue.arrayUnion(actionData)
        });

        return { success: true, result: actionData };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async hide() {
      try {
        if (!this.currentSessionId) {
          await this.init();
        }

        const user = auth.currentUser;
        const actionData = {
          actor: user.uid,
          action: 'HIDE',
          timestamp: new Date()
        };

        await db.collection('GameSessions').doc(this.currentSessionId).update({
          actions: firebase.firestore.FieldValue.arrayUnion(actionData)
        });

        return { success: true, result: actionData };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async getStats() {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        const userDoc = await db.collection('Users').doc(user.uid).get();
        const walletDoc = await db.collection('Wallet').doc(user.uid).get();

        return {
          success: true,
          stats: {
            user: userDoc.exists ? userDoc.data() : {},
            wallet: walletDoc.exists ? walletDoc.data() : {}
          }
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Lifestyles methods
  lifestyles: {
    currentLocation: 'NYC',

    async getListings(location = 'NYC', limit = 20) {
      try {
        if (!window.KTGFirebase.initialized) {
          throw new Error('Firebase not initialized');
        }

        const snapshot = await db.collection('Outings')
          .where('location', '==', location)
          .limit(limit)
          .get();

        const listings = [];
        snapshot.forEach(doc => {
          listings.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, listings };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async searchListings(searchTerm, location) {
      try {
        // Simple search implementation
        const result = await this.getListings(location, 50);
        if (result.success) {
          const filtered = result.listings.filter(listing => 
            listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return { success: true, listings: filtered };
        }
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    async claimListing(listingId) {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');

        await db.collection('Outings').doc(listingId).update({
          claimed_by_creator: user.uid,
          claimed: true,
          claimed_at: firebase.firestore.FieldValue.serverTimestamp()
        });

        return { success: true, result: { listingId, claimedBy: user.uid } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    getCategories() {
      return ['Events', 'Dining', 'Entertainment', 'Shopping', 'Travel', 'Sports', 'Arts', 'Other'];
    },

    getPrizeTypes() {
      return ['ticket', 'discount', 'freebie', 'experience', 'meetup', 'other'];
    },

    setLocation(location) {
      this.currentLocation = location;
    }
  },

  // Wallet methods
  wallet: {
    async getBalance(walletId) {
      try {
        // If no walletId provided, get current user's wallet
        if (!walletId) {
          const user = auth.currentUser;
          if (!user) throw new Error('No authenticated user');
          
          // Find user document by searching for the Firebase Auth UID
          const userQuery = await db.collection('Users').where('email', '==', user.email).get();
          if (!userQuery.empty) {
            const userData = userQuery.docs[0].data();
            const walletId = userData.wallet_id;
            if (walletId) {
              const walletDoc = await db.collection('Wallet').doc(walletId).get();
              if (walletDoc.exists) {
                return { success: true, balance: walletDoc.data() };
              }
            }
          }
          
          // Fallback: search wallet by connected_email
          const walletQuery = await db.collection('Wallet').where('connected_email', '==', user.email).get();
          if (!walletQuery.empty) {
            return { success: true, balance: walletQuery.docs[0].data() };
          }
        } else {
          const walletDoc = await db.collection('Wallet').doc(walletId).get();
          if (walletDoc.exists) {
            return { success: true, balance: walletDoc.data() };
          }
        }
        
        return { success: false, error: 'Wallet not found' };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  },

  // Utility methods
  utils: {
    formatDate(timestamp) {
      if (!timestamp) return 'N/A';
      const date = timestamp.seconds ? 
        new Date(timestamp.seconds * 1000) : 
        new Date(timestamp);
      return date.toLocaleDateString();
    },

    generateId() {
      return Math.random().toString(36).substring(2, 15);
    }
  }
};

// Auto-initialize when Firebase SDK is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Wait for Firebase SDK to load
  let attempts = 0;
  const maxAttempts = 50;
  
  const waitForFirebase = () => {
    if (typeof firebase !== 'undefined') {
      window.KTGFirebase.init();
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(waitForFirebase, 100);
    } else {
      console.error('Firebase SDK failed to load');
    }
  };
  
  waitForFirebase();
});