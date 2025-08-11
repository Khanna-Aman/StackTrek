import { 
  BookOpen, 
  Zap, 
  Target, 
  Trophy, 
  Star, 
  Flame, 
  Crown, 
  Award,
  Code,
  Users,
  Clock,
  TrendingUp,
  Database,
  GitBranch,
  Layers,
  ArrowRightLeft,
  Hash,
  Network,
  Medal
} from 'lucide-react';
import { Achievement } from '@/components/gamification/AchievementSystem';

export const achievements: Achievement[] = [
  // Learning Achievements
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete your first tutorial',
    icon: BookOpen,
    category: 'learning',
    rarity: 'common',
    xpReward: 50,
    unlocked: false
  },
  {
    id: 'array_master',
    title: 'Array Master',
    description: 'Complete the Array tutorial with perfect score',
    icon: Database,
    category: 'learning',
    rarity: 'rare',
    xpReward: 150,
    unlocked: false
  },
  {
    id: 'tree_climber',
    title: 'Tree Climber',
    description: 'Master binary tree operations',
    icon: GitBranch,
    category: 'learning',
    rarity: 'rare',
    xpReward: 200,
    unlocked: false
  },
  {
    id: 'stack_overflow',
    title: 'Stack Overflow',
    description: 'Complete 10 stack operations without errors',
    icon: Layers,
    category: 'learning',
    rarity: 'common',
    xpReward: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'queue_master',
    title: 'Queue Master',
    description: 'Understand FIFO principles perfectly',
    icon: ArrowRightLeft,
    category: 'learning',
    rarity: 'common',
    xpReward: 100,
    unlocked: false
  },
  {
    id: 'hash_hero',
    title: 'Hash Hero',
    description: 'Solve 5 hash table challenges',
    icon: Hash,
    category: 'learning',
    rarity: 'rare',
    xpReward: 175,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'graph_explorer',
    title: 'Graph Explorer',
    description: 'Navigate through complex graph structures',
    icon: Network,
    category: 'learning',
    rarity: 'epic',
    xpReward: 250,
    unlocked: false
  },
  {
    id: 'data_structures_scholar',
    title: 'Data Structures Scholar',
    description: 'Complete tutorials for all 8 data structures',
    icon: Crown,
    category: 'mastery',
    rarity: 'legendary',
    xpReward: 500,
    unlocked: false,
    progress: 0,
    maxProgress: 8
  },

  // Speed Achievements
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Complete a tutorial in under 5 minutes',
    icon: Zap,
    category: 'speed',
    rarity: 'rare',
    xpReward: 150,
    unlocked: false
  },
  {
    id: 'lightning_fast',
    title: 'Lightning Fast',
    description: 'Solve 3 challenges in a row under 2 minutes each',
    icon: Zap,
    category: 'speed',
    rarity: 'epic',
    xpReward: 300,
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'algorithm_speedster',
    title: 'Algorithm Speedster',
    description: 'Complete sorting visualization in record time',
    icon: TrendingUp,
    category: 'speed',
    rarity: 'rare',
    xpReward: 200,
    unlocked: false
  },

  // Consistency Achievements
  {
    id: 'daily_learner',
    title: 'Daily Learner',
    description: 'Learn for 7 consecutive days',
    icon: Flame,
    category: 'consistency',
    rarity: 'rare',
    xpReward: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: Flame,
    category: 'consistency',
    rarity: 'epic',
    xpReward: 350,
    unlocked: false
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Learn consistently for 30 days',
    icon: Crown,
    category: 'consistency',
    rarity: 'legendary',
    xpReward: 1000,
    unlocked: false,
    progress: 0,
    maxProgress: 30
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete 5 morning learning sessions',
    icon: Clock,
    category: 'consistency',
    rarity: 'common',
    xpReward: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },

  // Social Achievements
  {
    id: 'first_login',
    title: 'Welcome Aboard!',
    description: 'Sign up and join the StackTrek community',
    icon: Users,
    category: 'social',
    rarity: 'common',
    xpReward: 25,
    unlocked: false
  },
  {
    id: 'profile_complete',
    title: 'Profile Complete',
    description: 'Fill out your complete profile',
    icon: Users,
    category: 'social',
    rarity: 'common',
    xpReward: 50,
    unlocked: false
  },

  // Mastery Achievements
  {
    id: 'code_warrior',
    title: 'Code Warrior',
    description: 'View code examples in 4 different languages',
    icon: Code,
    category: 'mastery',
    rarity: 'rare',
    xpReward: 175,
    unlocked: false,
    progress: 0,
    maxProgress: 4
  },
  {
    id: 'algorithm_analyst',
    title: 'Algorithm Analyst',
    description: 'Analyze time complexity for 10 different algorithms',
    icon: Target,
    category: 'mastery',
    rarity: 'epic',
    xpReward: 300,
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'sorting_sage',
    title: 'Sorting Sage',
    description: 'Master all 5 sorting algorithms',
    icon: TrendingUp,
    category: 'mastery',
    rarity: 'epic',
    xpReward: 400,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete 5 tutorials with 100% accuracy',
    icon: Star,
    category: 'mastery',
    rarity: 'epic',
    xpReward: 350,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'grand_master',
    title: 'Grand Master',
    description: 'Reach level 50 and unlock all achievements',
    icon: Crown,
    category: 'mastery',
    rarity: 'legendary',
    xpReward: 2000,
    unlocked: false
  },

  // Special Achievements
  {
    id: 'bug_hunter',
    title: 'Bug Hunter',
    description: 'Find and fix 3 logical errors in code examples',
    icon: Target,
    category: 'mastery',
    rarity: 'rare',
    xpReward: 200,
    unlocked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Complete 5 late-night learning sessions (after 10 PM)',
    icon: Clock,
    category: 'consistency',
    rarity: 'common',
    xpReward: 100,
    unlocked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Learn on 4 consecutive weekends',
    icon: Flame,
    category: 'consistency',
    rarity: 'rare',
    xpReward: 250,
    unlocked: false,
    progress: 0,
    maxProgress: 4
  },
  {
    id: 'tutorial_completionist',
    title: 'Tutorial Completionist',
    description: 'Complete every available tutorial',
    icon: Medal,
    category: 'mastery',
    rarity: 'legendary',
    xpReward: 750,
    unlocked: false
  }
];

// Achievement checking functions
export const checkAchievement = (achievementId: string, userProgress: any): boolean => {
  const achievement = achievements.find(a => a.id === achievementId);
  if (!achievement) return false;

  switch (achievementId) {
    case 'first_steps':
      return userProgress.tutorialsCompleted > 0;
    
    case 'first_login':
      return true; // Unlocked on first login
    
    case 'daily_learner':
      return userProgress.currentStreak >= 7;
    
    case 'data_structures_scholar':
      return userProgress.tutorialsCompleted >= 8;
    
    case 'stack_overflow':
      return userProgress.stackOperations >= 10;
    
    // Add more achievement logic here
    default:
      return false;
  }
};

export const getAchievementProgress = (achievementId: string, userProgress: any): number => {
  switch (achievementId) {
    case 'daily_learner':
      return Math.min(userProgress.currentStreak || 0, 7);
    
    case 'data_structures_scholar':
      return Math.min(userProgress.tutorialsCompleted || 0, 8);
    
    case 'stack_overflow':
      return Math.min(userProgress.stackOperations || 0, 10);
    
    case 'hash_hero':
      return Math.min(userProgress.hashChallenges || 0, 5);
    
    case 'lightning_fast':
      return Math.min(userProgress.fastChallenges || 0, 3);
    
    case 'month_master':
      return Math.min(userProgress.currentStreak || 0, 30);
    
    case 'early_bird':
      return Math.min(userProgress.morningSessions || 0, 5);
    
    case 'code_warrior':
      return Math.min(userProgress.languagesViewed || 0, 4);
    
    case 'algorithm_analyst':
      return Math.min(userProgress.complexityAnalyzed || 0, 10);
    
    case 'sorting_sage':
      return Math.min(userProgress.sortingAlgorithms || 0, 5);
    
    case 'perfectionist':
      return Math.min(userProgress.perfectTutorials || 0, 5);
    
    case 'bug_hunter':
      return Math.min(userProgress.bugsFound || 0, 3);
    
    case 'night_owl':
      return Math.min(userProgress.nightSessions || 0, 5);
    
    case 'weekend_warrior':
      return Math.min(userProgress.weekendSessions || 0, 4);
    
    default:
      return 0;
  }
};
