import { User } from '@/types';
import { auth, googleProvider, githubProvider, db, isFirebaseConfigured } from '@/config/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  // Sign in with Google
  static async signInWithGoogle(): Promise<User> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Create or update user profile
      const user = await this.createOrUpdateUserProfile(firebaseUser);
      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  // Sign in with GitHub
  static async signInWithGitHub(): Promise<User> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const result = await signInWithPopup(auth, githubProvider);
      const firebaseUser = result.user;

      // Create or update user profile
      const user = await this.createOrUpdateUserProfile(firebaseUser);
      return user;
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
      throw error;
    }
  }

  // Sign in with email and password
  static async signInWithEmail(email: string, password: string): Promise<User> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // Get user profile
      const user = await this.getUserProfile(firebaseUser.uid);
      return user;
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  }

  // Sign up with email and password
  static async signUpWithEmail(email: string, password: string, username: string): Promise<User> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = result.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName: username });

      // Create user profile
      const user = await this.createOrUpdateUserProfile(firebaseUser);
      return user;
    } catch (error) {
      console.error('Error signing up with email:', error);
      throw error;
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  // Create or update user profile in Firestore
  static async createOrUpdateUserProfile(firebaseUser: any): Promise<User> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        // Update existing user
        const userData = userSnap.data() as User;
        const updatedUser: User = {
          ...userData,
          email: firebaseUser.email || userData.email,
          avatar: firebaseUser.photoURL || userData.avatar,
          lastLoginDate: new Date().toISOString(),
        };

        await updateDoc(userRef, {
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          lastLoginDate: updatedUser.lastLoginDate,
        });

        return updatedUser;
      } else {
        // Create new user
        const newUser: User = {
          id: firebaseUser.uid,
          username: firebaseUser.displayName || 'Anonymous User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL,
          level: 1,
          xp: 0,
          totalXp: 0,
          streak: 0,
          lastLoginDate: new Date().toISOString(),
          preferences: {
            theme: 'auto',
            animationSpeed: 'normal',
            soundEnabled: true,
            notificationsEnabled: true,
            language: 'en',
          },
          achievements: [],
          stats: {
            totalTimeSpent: 0,
            dataStructuresCompleted: 0,
            challengesCompleted: 0,
            perfectScores: 0,
            averageScore: 0,
            favoriteDataStructure: '',
          },
        };

        await setDoc(userRef, newUser);
        return newUser;
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  }

  // Get user profile from Firestore
  static async getUserProfile(uid: string): Promise<User> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data() as User;
      } else {
        throw new Error('User profile not found');
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Update user profile
  static async updateUserProfile(uid: string, updates: Partial<User>): Promise<void> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updates);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Add XP to user
  static async addXP(uid: string, xpAmount: number): Promise<{ newLevel: number; leveledUp: boolean }> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data() as User;
      const newTotalXp = userData.totalXp + xpAmount;
      const newLevel = Math.floor(newTotalXp / 100) + 1; // 100 XP per level
      const leveledUp = newLevel > userData.level;

      await updateDoc(userRef, {
        xp: userData.xp + xpAmount,
        totalXp: newTotalXp,
        level: newLevel,
      });

      return { newLevel, leveledUp };
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  }

  // Add achievement
  static async addAchievement(uid: string, achievementId: string): Promise<void> {
    if (!isFirebaseConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User not found');
      }

      const userData = userSnap.data() as User;
      const hasAchievement = userData.achievements.some(a => a.id === achievementId);

      if (!hasAchievement) {
        const newAchievement = {
          id: achievementId,
          name: this.getAchievementName(achievementId),
          description: this.getAchievementDescription(achievementId),
          icon: this.getAchievementIcon(achievementId),
          unlockedAt: new Date().toISOString(),
          category: this.getAchievementCategory(achievementId),
        };

        await updateDoc(userRef, {
          achievements: [...userData.achievements, newAchievement],
        });
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
      throw error;
    }
  }

  // Helper methods for achievements
  private static getAchievementName(id: string): string {
    const achievements: Record<string, string> = {
      'first-login': 'Welcome Aboard!',
      'first-array-operation': 'Array Explorer',
      'first-stack-operation': 'Stack Master',
      'first-queue-operation': 'Queue Commander',
      'first-linkedlist-operation': 'Link Navigator',
      'speed-demon': 'Speed Demon',
      'perfectionist': 'Perfectionist',
      'streak-5': '5-Day Streak',
      'streak-10': '10-Day Streak',
      'level-5': 'Rising Star',
      'level-10': 'Data Structure Expert',
    };
    return achievements[id] || 'Unknown Achievement';
  }

  private static getAchievementDescription(id: string): string {
    const descriptions: Record<string, string> = {
      'first-login': 'Completed your first login to the platform',
      'first-array-operation': 'Performed your first array operation',
      'first-stack-operation': 'Mastered your first stack operation',
      'first-queue-operation': 'Conquered your first queue operation',
      'first-linkedlist-operation': 'Navigated your first linked list operation',
      'speed-demon': 'Completed 10 operations in under 30 seconds',
      'perfectionist': 'Achieved 100% accuracy in 5 consecutive challenges',
      'streak-5': 'Maintained a 5-day learning streak',
      'streak-10': 'Maintained a 10-day learning streak',
      'level-5': 'Reached level 5',
      'level-10': 'Reached level 10',
    };
    return descriptions[id] || 'Achievement unlocked!';
  }

  private static getAchievementIcon(id: string): string {
    const icons: Record<string, string> = {
      'first-login': '🎉',
      'first-array-operation': '🗃️',
      'first-stack-operation': '📚',
      'first-queue-operation': '🔄',
      'first-linkedlist-operation': '🔗',
      'speed-demon': '⚡',
      'perfectionist': '💎',
      'streak-5': '🔥',
      'streak-10': '🌟',
      'level-5': '⭐',
      'level-10': '👑',
    };
    return icons[id] || '🏆';
  }

  private static getAchievementCategory(id: string): string {
    if (id.includes('first-')) return 'First Steps';
    if (id.includes('streak-')) return 'Consistency';
    if (id.includes('level-')) return 'Progress';
    if (id.includes('speed') || id.includes('perfect')) return 'Mastery';
    return 'General';
  }
}
