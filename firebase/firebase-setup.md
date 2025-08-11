# Firebase Setup Guide

## Quick Setup for StackTrek

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: "stacktrek-education"
3. Enable Google Analytics

### 2. Enable Services
- **Authentication**: Email/Password, Google, GitHub
- **Firestore**: Start in test mode
- **Hosting** (optional): For deployment

### 3. Get Configuration
1. Add web app in Firebase Console
2. Copy configuration object
3. Update `.env` file with your values

### 4. Environment Variables
```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

### 5. Deploy Security Rules
Use the `firestore.rules` file in the project root.

## Testing
- Demo mode works without Firebase
- Firebase enables user accounts and progress sync
- All features work in both modes

For detailed setup instructions, see `FIREBASE_ACADEMIC_SETUP.md`.
