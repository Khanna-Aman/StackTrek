# Firebase Academic Setup Guide

## Overview

This guide provides comprehensive instructions for setting up Firebase services for the StackTrek educational platform. Firebase integration enables user authentication, real-time data synchronization, and learning analytics.

## Prerequisites

- Google account
- Node.js and npm installed
- StackTrek project cloned locally

## Firebase Project Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `stacktrek-education`
4. Enable Google Analytics (recommended for educational analytics)
5. Choose or create Analytics account
6. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: For traditional registration
   - **Google**: For quick social login
   - **GitHub**: For developer-friendly authentication

### 3. Configure Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select database location (choose closest to your users)

### 4. Set Up Web App

1. In Project Overview, click "Add app" → Web (</> icon)
2. Register app with nickname: "StackTrek Web"
3. Copy the Firebase configuration object

## Environment Configuration

### 1. Update Environment Variables

Create or update `.env` file in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

# Optional: Analytics
VITE_FIREBASE_MEASUREMENT_ID="your-measurement-id"
```

### 2. Firebase Configuration File

The Firebase configuration is already set up in `src/config/firebase.ts`. Ensure it matches your project settings.

## Firestore Security Rules

### 1. Development Rules

For development, use these permissive rules in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2. Production Rules

For production, implement more restrictive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access to educational content
    match /tutorials/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Leaderboard data - read for all, write for authenticated users
    match /leaderboard/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Data Structure Design

### User Document Structure

```javascript
{
  uid: "user-unique-id",
  email: "user@example.com",
  username: "username",
  displayName: "User Display Name",
  avatar: "https://example.com/avatar.jpg",
  level: 1,
  xp: 0,
  totalXp: 0,
  streak: 0,
  lastLoginDate: "2024-01-01T00:00:00Z",
  preferences: {
    theme: "light", // "light" | "dark" | "auto"
    animationSpeed: "normal", // "slow" | "normal" | "fast"
    soundEnabled: true,
    notificationsEnabled: true,
    language: "en"
  },
  achievements: [
    {
      id: "first-array-operation",
      unlockedAt: "2024-01-01T00:00:00Z"
    }
  ],
  stats: {
    totalTimeSpent: 0, // in minutes
    dataStructuresCompleted: 0,
    challengesCompleted: 0,
    perfectScores: 0,
    averageScore: 0,
    favoriteDataStructure: "array"
  },
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

### Progress Tracking Structure

```javascript
{
  userId: "user-unique-id",
  dataStructureId: "array",
  progress: {
    tutorialCompleted: true,
    challengesCompleted: ["basic-operations", "sorting"],
    bestScore: 95,
    timeSpent: 45, // minutes
    lastAccessed: "2024-01-01T00:00:00Z"
  }
}
```

## Testing Firebase Integration

### 1. Authentication Test

```javascript
// Test user registration
const testAuth = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      "test@example.com", 
      "testpassword"
    );
    console.log("User created:", userCredential.user);
  } catch (error) {
    console.error("Auth error:", error);
  }
};
```

### 2. Firestore Test

```javascript
// Test data writing
const testFirestore = async () => {
  try {
    await setDoc(doc(db, "users", "test-user"), {
      name: "Test User",
      email: "test@example.com",
      createdAt: new Date()
    });
    console.log("Document written successfully");
  } catch (error) {
    console.error("Firestore error:", error);
  }
};
```

## Deployment Considerations

### 1. Environment Variables for Production

Ensure production environment variables are set in your hosting platform:
- Netlify: Site settings → Environment variables
- Vercel: Project settings → Environment Variables

### 2. Firebase Hosting (Optional)

For Firebase Hosting deployment:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Analytics and Monitoring

### 1. Google Analytics Integration

Firebase Analytics is automatically configured when enabled during project setup. Track educational events:

```javascript
import { logEvent } from 'firebase/analytics';

// Track tutorial completion
logEvent(analytics, 'tutorial_complete', {
  tutorial_name: 'array_basics',
  completion_time: 300 // seconds
});

// Track achievement unlock
logEvent(analytics, 'unlock_achievement', {
  achievement_id: 'first_array_operation',
  achievement_name: 'Array Master'
});
```

### 2. Performance Monitoring

Enable Performance Monitoring in Firebase Console for real-time performance insights.

## Security Best Practices

1. **Never commit Firebase config to public repositories**
2. **Use environment variables for all sensitive data**
3. **Implement proper Firestore security rules**
4. **Enable App Check for production**
5. **Regularly review Firebase usage and billing**
6. **Use Firebase Auth for all user management**

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check API keys and domain configuration
2. **Firestore permission denied**: Review security rules
3. **Build errors**: Ensure all environment variables are set
4. **CORS issues**: Configure authorized domains in Firebase Console

### Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Support](https://firebase.google.com/support)

## Educational Benefits

Firebase integration provides:
- **Real-time collaboration** between students
- **Progress tracking** across devices
- **Analytics** for learning effectiveness
- **Scalable infrastructure** for growing user base
- **Industry-standard** authentication and security

This setup enables StackTrek to function as a professional educational platform with enterprise-grade backend services.
