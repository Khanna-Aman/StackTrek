import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  lastLoginDate: string;
  preferences: UserPreferences;
  achievements: Achievement[];
  stats: UserStats;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  animationSpeed: 'slow' | 'normal' | 'fast';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: string;
}

interface UserStats {
  totalTimeSpent: number; // in minutes
  dataStructuresCompleted: number;
  challengesCompleted: number;
  perfectScores: number;
  averageScore: number;
  favoriteDataStructure: string;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    addXp: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.xp += action.payload;
        state.currentUser.totalXp += action.payload;

        // Level up logic (100 XP per level)
        const newLevel = Math.floor(state.currentUser.totalXp / 100) + 1;
        if (newLevel > state.currentUser.level) {
          state.currentUser.level = newLevel;
          state.currentUser.xp = state.currentUser.totalXp % 100;
        }
      }
    },
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      if (state.currentUser) {
        state.currentUser.achievements.push(action.payload);
      }
    },
    updateStreak: (state, action: PayloadAction<number>) => {
      if (state.currentUser) {
        state.currentUser.streak = action.payload;
      }
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.currentUser) {
        state.currentUser.preferences = {
          ...state.currentUser.preferences,
          ...action.payload,
        };
      }
    },
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      if (state.currentUser) {
        state.currentUser.stats = {
          ...state.currentUser.stats,
          ...action.payload,
        };
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setUser,
  updateUser,
  addXp,
  addAchievement,
  updateStreak,
  updatePreferences,
  updateStats,
  logout,
  setLoading,
} = userSlice.actions;

export default userSlice.reducer;
