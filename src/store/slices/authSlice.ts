import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import { AuthService } from '@/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Async thunks
export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthService.signInWithGoogle();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithGitHub = createAsyncThunk(
  'auth/signInWithGitHub',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthService.signInWithGitHub();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const user = await AuthService.signInWithEmail(email, password);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async ({ email, password, username }: { email: string; password: string; username: string }, { rejectWithValue }) => {
    try {
      const user = await AuthService.signUpWithEmail(email, password, username);
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.signOut();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addXP = createAsyncThunk(
  'auth/addXP',
  async ({ uid, xpAmount }: { uid: string; xpAmount: number }, { rejectWithValue }) => {
    try {
      const result = await AuthService.addXP(uid, xpAmount);
      return { xpAmount, ...result };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAchievement = createAsyncThunk(
  'auth/addAchievement',
  async ({ uid, achievementId }: { uid: string; achievementId: string }, { rejectWithValue }) => {
    try {
      await AuthService.addAchievement(uid, achievementId);
      return achievementId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isInitialized = true;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    incrementStreak: (state) => {
      if (state.user) {
        state.user.streak += 1;
      }
    },
    resetStreak: (state) => {
      if (state.user) {
        state.user.streak = 0;
      }
    },
    updateStats: (state, action: PayloadAction<Partial<User['stats']>>) => {
      if (state.user) {
        state.user.stats = { ...state.user.stats, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Sign in with Google
    builder
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign in with GitHub
    builder
      .addCase(signInWithGitHub.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGitHub.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(signInWithGitHub.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign in with email
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign up with email
    builder
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Add XP
    builder
      .addCase(addXP.fulfilled, (state, action) => {
        if (state.user) {
          state.user.xp += action.payload.xpAmount;
          state.user.totalXp += action.payload.xpAmount;
          state.user.level = action.payload.newLevel;
        }
      });

    // Add Achievement
    builder
      .addCase(addAchievement.fulfilled, (state, action) => {
        // Achievement will be added via the service, 
        // we might want to refresh user data here
      });
  },
});

export const {
  setUser,
  clearError,
  updateUserProfile,
  incrementStreak,
  resetStreak,
  updateStats,
} = authSlice.actions;

export default authSlice.reducer;
