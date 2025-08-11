import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Clock, Award, BookOpen, Zap, Calendar, Trophy, Play, ArrowRight, Star, Activity, Gamepad2 } from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import { XPSystem, calculateLevel } from '@/components/gamification/XPSystem';
import { AchievementSystem } from '@/components/gamification/AchievementSystem';
import { achievements, checkAchievement, getAchievementProgress } from '@/data/achievements';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  background-color: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const Card = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ProgressFill = styled(motion.div) <{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  transition: width ${({ theme }) => theme.transitions.normal};
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ActivityIcon = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  background-color: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ActivityTime = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const QuickActionButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
`;

const AchievementBadge = styled(motion.div) <{ $unlocked: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, $unlocked }) =>
    $unlocked ? theme.colors.primaryLight : theme.colors.backgroundTertiary};
  opacity: ${({ $unlocked }) => $unlocked ? 1 : 0.5};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const AchievementIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  background-color: ${({ $color }) => $color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const AchievementName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const LevelProgress = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const LevelInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const LevelText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const XPText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Helper functions
const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  }
  return num.toString();
};

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [userAchievements, setUserAchievements] = useState(achievements);

  // Mock recent activities (in a real app, this would come from the store or API)
  const recentActivities = [
    {
      id: '1',
      type: 'challenge',
      title: 'Completed Stack Challenge',
      time: '2 hours ago',
      icon: Target,
      color: '#10b981'
    },
    {
      id: '2',
      type: 'learning',
      title: 'Studied Binary Trees',
      time: '1 day ago',
      icon: BookOpen,
      color: '#6366f1'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Earned "Quick Learner" badge',
      time: '2 days ago',
      icon: Trophy,
      color: '#f59e0b'
    },
    {
      id: '4',
      type: 'streak',
      title: 'Maintained 5-day streak',
      time: '3 days ago',
      icon: Calendar,
      color: '#ef4444'
    }
  ];

  // Mock achievements
  const achievements = [
    { id: '1', name: 'First Steps', icon: Play, color: '#10b981', unlocked: true },
    { id: '2', name: 'Quick Learner', icon: Zap, color: '#f59e0b', unlocked: true },
    { id: '3', name: 'Stack Master', icon: Target, color: '#6366f1', unlocked: true },
    { id: '4', name: 'Streak Keeper', icon: Calendar, color: '#ef4444', unlocked: true },
    { id: '5', name: 'Tree Explorer', icon: BookOpen, color: '#8b5cf6', unlocked: false },
    { id: '6', name: 'Algorithm Pro', icon: Trophy, color: '#f97316', unlocked: false },
  ];

  // Calculate stats from user data
  const stats = user ? [
    {
      icon: TrendingUp,
      label: 'Total XP',
      value: formatNumber(user.totalXp),
      color: '#6366f1',
    },
    {
      icon: Target,
      label: 'Challenges Completed',
      value: user.stats.challengesCompleted.toString(),
      color: '#10b981',
    },
    {
      icon: Clock,
      label: 'Time Spent',
      value: formatTime(user.stats.totalTimeSpent),
      color: '#f59e0b',
    },
    {
      icon: Award,
      label: 'Achievements',
      value: user.achievements.length.toString(),
      color: '#ef4444',
    },
  ] : [];

  // Calculate level progress
  const currentLevelProgress = user ? (user.xp / 100) * 100 : 0;
  const xpToNextLevel = user ? 100 - user.xp : 0;

  if (!isAuthenticated || !user) {
    return (
      <DashboardContainer>
        <PageTitle>Dashboard</PageTitle>
        <Card>
          <CardTitle>Welcome to StackTrek!</CardTitle>
          <p>Please sign in to view your personalized dashboard.</p>
        </Card>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <PageTitle>Welcome back, {user.username}!</PageTitle>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <StatHeader>
              <StatIcon $color={stat.color}>
                <stat.icon />
              </StatIcon>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <ContentGrid>
        <MainContent>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CardTitle>Level Progress</CardTitle>
            <XPSystem
              currentXP={user.totalXp || 0}
              currentLevel={calculateLevel(user.totalXp || 0)}
              showLevelUp={showLevelUp}
              onLevelUpComplete={() => setShowLevelUp(false)}
            />

            <div>
              <h4 style={{ marginBottom: '16px', color: 'var(--text-color)' }}>Learning Statistics</h4>
              <ProgressText style={{ marginBottom: '8px' }}>
                <span>Data Structures Completed</span>
                <span>{user.stats?.dataStructuresCompleted || 0}</span>
              </ProgressText>
              <ProgressText style={{ marginBottom: '8px' }}>
                <span>Average Score</span>
                <span>{user.stats?.averageScore || 0}%</span>
              </ProgressText>
              <ProgressText style={{ marginBottom: '8px' }}>
                <span>Perfect Scores</span>
                <span>{user.stats?.perfectScores || 0}</span>
              </ProgressText>
              <ProgressText>
                <span>Current Streak</span>
                <span>{user.streak} days</span>
              </ProgressText>
            </div>
          </Card>

          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <CardTitle>Recent Activity</CardTitle>
            <div>
              {recentActivities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <ActivityIcon $color={activity.color}>
                    <activity.icon />
                  </ActivityIcon>
                  <ActivityContent>
                    <ActivityTitle>{activity.title}</ActivityTitle>
                    <ActivityTime>{activity.time}</ActivityTime>
                  </ActivityContent>
                </ActivityItem>
              ))}
            </div>
          </Card>
        </MainContent>

        <Sidebar>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <CardTitle>Quick Actions</CardTitle>
            <div>
              <QuickActionButton
                variant="outline"
                onClick={() => navigate('/data-structures')}
              >
                <BookOpen size={16} />
                Continue Learning
              </QuickActionButton>
              <QuickActionButton
                variant="outline"
                onClick={() => navigate('/data-structures')}
              >
                <Target size={16} />
                Take Challenge
              </QuickActionButton>
              <QuickActionButton
                variant="outline"
                onClick={() => navigate('/leaderboard')}
              >
                <Trophy size={16} />
                View Leaderboard
              </QuickActionButton>
              <QuickActionButton
                variant="outline"
                onClick={() => navigate('/games')}
              >
                <Gamepad2 size={16} />
                Play Mini Games
              </QuickActionButton>
              <QuickActionButton
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                <Award size={16} />
                View Profile
              </QuickActionButton>
            </div>
          </Card>

          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <CardTitle>Recent Achievements</CardTitle>
            <AchievementSystem
              achievements={userAchievements.slice(0, 6)}
              showUnlockedOnly={true}
              onAchievementClick={(achievement) => {
                console.log('Achievement clicked:', achievement);
                // Could navigate to achievements page or show details
              }}
            />
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/achievements')}
              >
                View All Achievements
              </Button>
            </div>
          </Card>
        </Sidebar>
      </ContentGrid>
    </DashboardContainer>
  );
};
