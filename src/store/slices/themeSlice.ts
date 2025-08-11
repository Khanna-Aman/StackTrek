import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
}

const initialState: ThemeState = {
  mode: 'auto',
  primaryColor: '#6366f1',
  accentColor: '#f59e0b',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.mode = action.payload;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
    setFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.fontSize = action.payload;
    },
    toggleReducedMotion: (state) => {
      state.reducedMotion = !state.reducedMotion;
    },
    toggleHighContrast: (state) => {
      state.highContrast = !state.highContrast;
    },
    resetTheme: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setThemeMode,
  setPrimaryColor,
  setAccentColor,
  setFontSize,
  toggleReducedMotion,
  toggleHighContrast,
  resetTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
