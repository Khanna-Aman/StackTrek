export interface WeeklyProgress {
  percentage: number;
  daysLeft: number;
  completedActivities: number;
  totalActivities: number;
}

export const calculateWeeklyProgress = (user: any): WeeklyProgress => {
  // Get current date and calculate days left in week
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysLeft = 7 - dayOfWeek;
  
  // Calculate weekly activities based on user data
  const userLevel = user?.level || 1;
  const userStreak = user?.streak || 0;
  const completedTutorials = user?.stats?.dataStructuresCompleted || 0;
  const challengesCompleted = user?.stats?.challengesCompleted || 0;
  
  // Dynamic calculation based on user progress
  const completedActivities = Math.min(
    completedTutorials + challengesCompleted + userStreak,
    7 // Max 7 activities per week
  );
  
  const totalActivities = 7; // Target 7 activities per week
  const percentage = Math.round((completedActivities / totalActivities) * 100);
  
  return {
    percentage: Math.min(percentage, 100),
    daysLeft,
    completedActivities,
    totalActivities
  };
};
