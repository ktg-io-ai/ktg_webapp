// Clean Firebase Configuration - Email/Password Only
// Replace with your new Firebase project config

const firebaseConfig = {
  apiKey: "AIzaSyBOpYqRnjsWX9jarBBcg37MQxTLZtGvkk0",
  authDomain: "ktg-webapp-io.firebaseapp.com", 
  projectId: "ktg-webapp-io",
  storageBucket: "ktg-webapp-io.firebasestorage.app",
  messagingSenderId: "744923925842",
  appId: "1:744923925842:web:b495869eb8bf51944c3e8b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Simple Authentication - Email/Password Only
window.firebaseAuth = {
  signUp: async (email, password) => {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  signIn: async (email, password) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  signOut: async () => {
    try {
      await auth.signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getCurrentUser: () => auth.currentUser,
  
  onAuthStateChanged: (callback) => auth.onAuthStateChanged(callback)
};

// Database helpers
window.firebaseDB = {
  // Distribute tokens to test users
  distributeTestTokens: async () => {
    const testEmails = [
      'test1@ktg.io', 'test2@ktg.io', 'test3@ktg.io', 'test4@ktg.io', 'test5@ktg.io',
      'test6@ktg.io', 'test7@ktg.io', 'test8@ktg.io', 'test9@ktg.io', 'test10@ktg.io'
    ];
    
    const tokens = { life_1: 50, life_3: 25, life_6: 10, life_9: 5 };
    
    for (const email of testEmails) {
      try {
        await this.addTokens(email, tokens);
        console.log(`Tokens distributed to ${email}`);
      } catch (error) {
        console.log(`Failed to distribute to ${email}: ${error.message}`);
      }
    }
    
    return { success: true, message: 'Token distribution complete' };
  },
  // Create user profile
  createUser: async (userData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');
      
      await db.collection('Users').doc(user.uid).set({
        email: user.email,
        wallet_id: user.uid,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        ...userData
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user data
  getUser: async (uid) => {
    try {
      const userDoc = await db.collection('Users').doc(uid || auth.currentUser.uid).get();
      return userDoc.exists ? { success: true, data: userDoc.data() } : { success: false, error: 'User not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create wallet
  createWallet: async (tokens) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No authenticated user');
      
      await db.collection('Wallet').doc(user.uid).set({
        connected_email: user.email,
        wallet_id: user.uid,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        ...tokens
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Add tokens to wallet (Game Master function)
  addTokens: async (targetEmail, tokens) => {
    try {
      const userQuery = await db.collection('Users').where('email', '==', targetEmail).get();
      if (userQuery.empty) throw new Error('User not found');
      
      const userId = userQuery.docs[0].id;
      const walletRef = db.collection('Wallet').doc(userId);
      
      await walletRef.update({
        life_1: firebase.firestore.FieldValue.increment(tokens.life_1 || 0),
        life_3: firebase.firestore.FieldValue.increment(tokens.life_3 || 0),
        life_6: firebase.firestore.FieldValue.increment(tokens.life_6 || 0),
        life_9: firebase.firestore.FieldValue.increment(tokens.life_9 || 0),
        diamond: firebase.firestore.FieldValue.increment(tokens.diamond || 0)
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};