import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// NUCLEAR: Hardcoded Firebase config for stacktrek-98df0
const isFirebaseConfigured = true;

const firebaseConfig = {
  apiKey: "AIzaSyBhxn1zOtawpaIlYb7TLZFOQakqrm6mZlo",
  authDomain: "stacktrek-98df0.firebaseapp.com",
  projectId: "stacktrek-98df0",
  storageBucket: "stacktrek-98df0.firebasestorage.app",
  messagingSenderId: "1072910879130",
  appId: "1:1072910879130:web:9af6b3212f3c33963c1223",
};

// Initialize Firebase only if configured
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let googleProvider: any = null;
let githubProvider: any = null;

if (isFirebaseConfigured) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);

    // Initialize Cloud Storage and get a reference to the service
    storage = getStorage(app);

    // Auth providers
    googleProvider = new GoogleAuthProvider();
    githubProvider = new GithubAuthProvider();

    // Configure providers
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    githubProvider.setCustomParameters({
      allow_signup: 'true'
    });

    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.error('Please check your Firebase configuration in .env file');
  }
} else {
  console.warn('⚠️ Firebase not configured. Using demo mode.');
  console.info('To enable Firebase authentication:');
  console.info('1. Create a Firebase project at https://console.firebase.google.com/');
  console.info('2. Copy your config values to .env file');
  console.info('3. See firebase-setup.md for detailed instructions');
}

export { auth, db, storage, googleProvider, githubProvider, isFirebaseConfigured };
export default app;
