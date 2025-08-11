# Firebase Setup Guide

## 🔥 Setting up Firebase for StackTrek (Optional)

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "StackTrek" or similar
4. Enable Google Analytics (optional)

### Step 2: Enable Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable these providers:
   - **Email/Password** ✅
   - **Google** ✅
   - **GitHub** ✅

### Step 3: Get Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click "Web app" icon (`</>`)
4. Register app with name "StackTrek Web"
5. Copy the config object

### Step 4: Update Environment Variables
Create `.env` file in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Firebase Analytics
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Step 5: Configure OAuth Providers

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to **APIs & Services** > **Credentials**
4. Add your domain to authorized origins:
   - `http://localhost:5173` (development - Vite default port)
   - `https://yourdomain.com` (production)

#### GitHub OAuth:
1. Go to GitHub > **Settings** > **Developer settings** > **OAuth Apps**
2. Create new OAuth App:
   - **Application name**: StackTrek
   - **Homepage URL**: `https://yourdomain.com`
   - **Authorization callback URL**: `https://your_project.firebaseapp.com/__/auth/handler`
3. Copy Client ID and Client Secret
4. In Firebase Console > Authentication > Sign-in method > GitHub:
   - Paste Client ID and Client Secret

### Step 6: Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. **IMPORTANT**: Start in **production mode** (secure by default)
4. Choose location closest to your users

### Step 7: Security Rules (CRITICAL FOR SECURITY)
⚠️ **NEVER use test mode in production!**

Copy the contents of `firestore.rules` file to your Firebase Console:

1. Go to **Firestore Database** > **Rules**
2. Replace the default rules with the secure rules from `firestore.rules`
3. Click **Publish**

**Key Security Features:**
- ✅ Users can only access their own data
- ✅ Input validation for user data
- ✅ Public read-only access for leaderboards
- ✅ Prevents unauthorized data modification
- ✅ Analytics and feedback collection
- ❌ Blocks all unauthorized access

### Step 8: Test Configuration
1. Restart your development server: `npm run dev`
2. The demo mode button should disappear (since it was removed)
3. Try signing in with Google/GitHub
4. Check browser console for any errors

## 🚀 Quick Start (Demo Mode)
If you want to test without Firebase setup:
- The app automatically falls back to demo mode
- Demo users get temporary local storage
- All features work except cloud sync

## 🔧 Troubleshooting
- **"Firebase not configured"**: Check environment variables
- **OAuth errors**: Verify authorized domains in Google/GitHub settings
- **Firestore errors**: Check security rules and database creation
