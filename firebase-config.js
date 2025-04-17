// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByULC_m1U4mnSRHZUbHrr-edxvwuzeZKo",
  authDomain: "autochitchat-blocked-database.firebaseapp.com",
  databaseURL: "https://autochitchat-blocked-database-default-rtdb.firebaseio.com",
  projectId: "autochitchat-blocked-database",
  storageBucket: "autochitchat-blocked-database.firebasestorage.app",
  messagingSenderId: "165943645785",
  appId: "1:165943645785:web:fdff0adbc4576a0886c348",
  measurementId: "G-4JCZJF3M94"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore(); 