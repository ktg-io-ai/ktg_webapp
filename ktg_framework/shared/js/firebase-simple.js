// Simple Firebase initialization for admin dashboard
const firebaseConfig = {
  apiKey: "AIzaSyDrgOGvn8NHuq3T_ODse8buij9KXg1WkzI",
  authDomain: "ktgio-3k38n.firebaseapp.com",
  projectId: "ktgio-3k38n",
  storageBucket: "ktgio-3k38n.firebasestorage.app",
  messagingSenderId: "416239278754",
  appId: "1:416239278754:web:028cd9fd6f13a5a4ed95fb"
};

// Initialize Firebase when available
window.initFirebase = function() {
  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    return firebase.firestore();
  }
  return null;
};