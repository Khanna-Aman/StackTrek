import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Check if Firebase is configured
const isFirebaseConfigured = !!(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_API_KEY !== 'your-firebase-api-key' &&
  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN !== 'your-project.firebaseapp.com' &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID !== 'your-project-id'
);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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
