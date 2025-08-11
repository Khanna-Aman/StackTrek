import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GameState {
  currentDataStructure: string | null;
  isPlaying: boolean;
  isPaused: boolean;
  animationSpeed: number;
  currentStep: number;
  totalSteps: number;
  score: number;
  timeElapsed: number;
  difficulty: 'easy' | 'medium' | 'hard';
  gameMode: 'tutorial' | 'practice' | 'challenge';
  currentChallenge: Challenge | null;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  maxAttempts?: number;
  currentAttempts: number;
  isCompleted: boolean;
  bestScore?: number;
}

const initialState: GameState = {
  currentDataStructure: null,
  isPlaying: false,
  isPaused: false,
  animationSpeed: 1,
  currentStep: 0,
  totalSteps: 0,
  score: 0,
  timeElapsed: 0,
  difficulty: 'easy',
  gameMode: 'tutorial',
  currentChallenge: null,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setCurrentDataStructure: (state, action: PayloadAction<string>) => {
      state.currentDataStructure = action.payload;
    },
    startGame: (state) => {
      state.isPlaying = true;
      state.isPaused = false;
      state.currentStep = 0;
      state.score = 0;
      state.timeElapsed = 0;
    },
    pauseGame: (state) => {
      state.isPaused = true;
    },
    resumeGame: (state) => {
      state.isPaused = false;
    },
    stopGame: (state) => {
      state.isPlaying = false;
      state.isPaused = false;
      state.currentStep = 0;
    },
    setAnimationSpeed: (state, action: PayloadAction<number>) => {
      state.animationSpeed = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    setTotalSteps: (state, action: PayloadAction<number>) => {
      state.totalSteps = action.payload;
    },
    addScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.score = action.payload;
    },
    incrementTime: (state) => {
      state.timeElapsed += 1;
    },
    setDifficulty: (state, action: PayloadAction<'easy' | 'medium' | 'hard'>) => {
      state.difficulty = action.payload;
    },
    setGameMode: (state, action: PayloadAction<'tutorial' | 'practice' | 'challenge'>) => {
      state.gameMode = action.payload;
    },
    setCurrentChallenge: (state, action: PayloadAction<Challenge | null>) => {
      state.currentChallenge = action.payload;
    },
    updateChallenge: (state, action: PayloadAction<Partial<Challenge>>) => {
      if (state.currentChallenge) {
        state.currentChallenge = {
          ...state.currentChallenge,
          ...action.payload,
        };
      }
    },
    resetGame: (state) => {
      return { ...initialState };
    },
  },
});

export const {
  setCurrentDataStructure,
  startGame,
  pauseGame,
  resumeGame,
  stopGame,
  setAnimationSpeed,
  nextStep,
  previousStep,
  setStep,
  setTotalSteps,
  addScore,
  setScore,
  incrementTime,
  setDifficulty,
  setGameMode,
  setCurrentChallenge,
  updateChallenge,
  resetGame,
} = gameSlice.actions;

export default gameSlice.reducer;
