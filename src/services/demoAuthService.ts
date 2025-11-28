import { User } from '@/types';

// Demo user for testing without Firebase
const DEMO_USER: User = {
  id: 'demo-user-123',
  username: 'Demo User',
  email: 'demo@example.com',
  avatar: undefined,
  level: 3,
  xp: 250,
  totalXp: 250,
  streak: 5,
  lastLoginDate: new Date().toISOString(),
  preferences: {
    theme: 'auto',
    animationSpeed: 'normal',
    soundEnabled: true,
    notificationsEnabled: true,
    language: 'en',
  },
  achievements: [
    {
      id: 'first-login',
      name: 'Welcome Aboard!',
      description: 'Completed your first login to the platform',
      icon: '🎉',
      unlockedAt: new Date().toISOString(),
      category: 'First Steps',
    },
    {
      id: 'first-array-operation',
      name: 'Array Explorer',
      description: 'Performed your first array operation',
      icon: '🗃️',
      unlockedAt: new Date().toISOString(),
      category: 'First Steps',
    },
    {
      id: 'first-stack-operation',
      name: 'Stack Master',
      description: 'Mastered your first stack operation',
      icon: '📚',
      unlockedAt: new Date().toISOString(),
      category: 'First Steps',
    },
  ],
  stats: {
    totalTimeSpent: 1800, // 30 minutes
    dataStructuresCompleted: 3,
    challengesCompleted: 5,
    perfectScores: 2,
    averageScore: 85,
    favoriteDataStructure: 'Stack',
  },
};

export class DemoAuthService {
  private static currentUser: User | null = null;

  static async signInDemo(): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.currentUser = { ...DEMO_USER };
    return this.currentUser;
  }

  static async signOut(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
  }

  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  static async addXP(xpAmount: number): Promise<{ newLevel: number; leveledUp: boolean }> {
    if (!this.currentUser) {
      throw new Error('No user signed in');
    }

    const newTotalXp = this.currentUser.totalXp + xpAmount;
    const newLevel = Math.floor(newTotalXp / 100) + 1;
    const leveledUp = newLevel > this.currentUser.level;

    this.currentUser.xp += xpAmount;
    this.currentUser.totalXp = newTotalXp;
    this.currentUser.level = newLevel;

    return { newLevel, leveledUp };
  }

  static async addAchievement(achievementId: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error('No user signed in');
    }

    const hasAchievement = this.currentUser.achievements.some(a => a.id === achievementId);

    if (!hasAchievement) {
      const newAchievement = {
        id: achievementId,
        name: this.getAchievementName(achievementId),
        description: this.getAchievementDescription(achievementId),
        icon: this.getAchievementIcon(achievementId),
        unlockedAt: new Date().toISOString(),
        category: this.getAchievementCategory(achievementId),
      };

      this.currentUser.achievements.push(newAchievement);
    }
  }

  private static getAchievementName(id: string): string {
    const achievements: Record<string, string> = {
      'first-queue-operation': 'Queue Commander',
      'first-linkedlist-operation': 'Link Navigator',
      'speed-demon': 'Speed Demon',
      'perfectionist': 'Perfectionist',
      'streak-10': '10-Day Streak',
      'level-5': 'Rising Star',
      'level-10': 'Data Structure Expert',
    };
    return achievements[id] || 'New Achievement';
  }

  private static getAchievementDescription(id: string): string {
    const descriptions: Record<string, string> = {
      'first-queue-operation': 'Conquered your first queue operation',
      'first-linkedlist-operation': 'Navigated your first linked list operation',
      'speed-demon': 'Completed 10 operations in under 30 seconds',
      'perfectionist': 'Achieved 100% accuracy in 5 consecutive challenges',
      'streak-10': 'Maintained a 10-day learning streak',
      'level-5': 'Reached level 5',
      'level-10': 'Reached level 10',
    };
    return descriptions[id] || 'Achievement unlocked!';
  }

  private static getAchievementIcon(id: string): string {
    const icons: Record<string, string> = {
      'first-queue-operation': '🔄',
      'first-linkedlist-operation': '🔗',
      'speed-demon': '⚡',
      'perfectionist': '💎',
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
