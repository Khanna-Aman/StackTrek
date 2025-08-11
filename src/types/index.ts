// Common types used throughout the application

export interface User {
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

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  animationSpeed: 'slow' | 'normal' | 'fast';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: string;
}

export interface UserStats {
  totalTimeSpent: number; // in minutes
  dataStructuresCompleted: number;
  challengesCompleted: number;
  perfectScores: number;
  averageScore: number;
  favoriteDataStructure: string;
}

export interface DataStructure {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  estimatedTime: number; // in minutes
  prerequisites: string[];
  isCompleted: boolean;
  bestScore?: number;
  lastAttempt?: string;
}

export interface Challenge {
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
  dataStructureId: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  totalXp: number;
  rank: number;
  weeklyXp?: number;
}

export interface GameSession {
  id: string;
  dataStructureId: string;
  startTime: number;
  endTime?: number;
  score: number;
  completed: boolean;
  steps: GameStep[];
}

export interface GameStep {
  id: string;
  action: string;
  timestamp: number;
  data: any;
  isCorrect?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Theme types
export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  secondary: string;
  secondaryHover: string;
  secondaryLight: string;
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  errorLight: string;
  info: string;
  infoLight: string;
  shadow: string;
  shadowMedium: string;
  shadowLarge: string;
}

// Component prop types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
