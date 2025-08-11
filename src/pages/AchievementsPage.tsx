import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { AchievementSystem } from '@/components/gamification/AchievementSystem';
import { achievements, checkAchievement, getAchievementProgress } from '@/data/achievements';
import { Trophy, Award, Star, Target } from 'lucide-react';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  max-width: 600px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary}, 
      ${({ theme }) => theme.colors.secondary});
  }
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  background: ${({ $color }) => $color};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto ${({ theme }) => theme.spacing[3]};
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressSection = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ProgressTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ProgressFill = styled(motion.div)<{ $percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const ProgressText = styled.div`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const AchievementsPage: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [userAchievements, setUserAchievements] = useState(achievements);

  // Update achievements based on user progress
  useEffect(() => {
    if (user) {
      const userProgress = {
        tutorialsCompleted: user.stats?.dataStructuresCompleted || 0,
        currentStreak: user.streak || 0,
        stackOperations: user.stats?.stackOperations || 0,
        hashChallenges: user.stats?.hashChallenges || 0,
        challengesCompleted: user.stats?.challengesCompleted || 0,
        totalTimeSpent: user.stats?.totalTimeSpent || 0,
        perfectScores: user.stats?.perfectScores || 0,
        // Add more progress tracking here
      };

      // Update achievements with current progress
      const updatedAchievements = achievements.map(achievement => {
        const isUnlocked = checkAchievement(achievement.id, userProgress);
        const progress = getAchievementProgress(achievement.id, userProgress);
        
        return {
          ...achievement,
          unlocked: isUnlocked,
          progress: achievement.maxProgress ? progress : undefined,
          unlockedAt: isUnlocked && !achievement.unlocked ? new Date().toISOString() : achievement.unlockedAt
        };
      });

      setUserAchievements(updatedAchievements);
    }
  }, [user]);

  const unlockedCount = userAchievements.filter(a => a.unlocked).length;
  const totalCount = userAchievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  const rarityStats = {
    common: userAchievements.filter(a => a.rarity === 'common' && a.unlocked).length,
    rare: userAchievements.filter(a => a.rarity === 'rare' && a.unlocked).length,
    epic: userAchievements.filter(a => a.rarity === 'epic' && a.unlocked).length,
    legendary: userAchievements.filter(a => a.rarity === 'legendary' && a.unlocked).length,
  };

  const totalXPFromAchievements = userAchievements
    .filter(a => a.unlocked)
    .reduce((total, a) => total + a.xpReward, 0);

  const stats = [
    {
      icon: Trophy,
      label: 'Total Achievements',
      value: `${unlockedCount}/${totalCount}`,
      color: '#f59e0b'
    },
    {
      icon: Star,
      label: 'XP from Achievements',
      value: totalXPFromAchievements.toString(),
      color: '#10b981'
    },
    {
      icon: Award,
      label: 'Legendary Unlocked',
      value: rarityStats.legendary.toString(),
      color: '#fbbf24'
    },
    {
      icon: Target,
      label: 'Completion Rate',
      value: `${Math.round(completionPercentage)}%`,
      color: '#3b82f6'
    }
  ];

  const handleAchievementClick = (achievement: any) => {
    console.log('Achievement clicked:', achievement);
    // Could show achievement details modal
  };

  return (
    <Container>
      <Header>
        <Title>Achievements</Title>
        <Subtitle>
          Track your learning progress and unlock rewards as you master data structures and algorithms.
        </Subtitle>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <StatIcon $color={stat.color}>
              <stat.icon />
            </StatIcon>
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <ProgressSection>
        <ProgressTitle>Overall Progress</ProgressTitle>
        <ProgressBar>
          <ProgressFill
            $percentage={completionPercentage}
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </ProgressBar>
        <ProgressText>
          {unlockedCount} of {totalCount} achievements unlocked ({Math.round(completionPercentage)}%)
        </ProgressText>
      </ProgressSection>

      <AchievementSystem
        achievements={userAchievements}
        onAchievementClick={handleAchievementClick}
      />
    </Container>
  );
};
