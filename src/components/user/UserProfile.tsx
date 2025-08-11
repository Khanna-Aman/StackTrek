import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { signOut } from '@/store/slices/authSlice';
import { Button } from '@/components/common/Button';
import { 
  User, 
  Trophy, 
  Zap, 
  Target, 
  Calendar, 
  TrendingUp, 
  Award,
  LogOut,
  Settings
} from 'lucide-react';

interface UserProfileProps {
  onClose?: () => void;
}

const Container = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-width: 800px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const UserInfo = styled.div`
  flex: 1;
`;

const Username = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const UserEmail = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const LevelBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const StatInfo = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ProgressBar = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  height: 12px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ProgressFill = styled(motion.div)<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
`;

const AchievementCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: center;
  border: 2px solid transparent;
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const AchievementIcon = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const AchievementName = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  if (!user) return null;

  const handleSignOut = () => {
    dispatch(signOut());
    onClose?.();
  };

  const xpToNextLevel = (user.level * 100) - user.xp;
  const currentLevelProgress = (user.xp % 100) / 100 * 100;

  const stats = [
    {
      icon: Zap,
      label: 'Total XP',
      value: user.totalXp.toLocaleString(),
      color: '#f59e0b',
    },
    {
      icon: Trophy,
      label: 'Level',
      value: user.level.toString(),
      color: '#8b5cf6',
    },
    {
      icon: Target,
      label: 'Achievements',
      value: user.achievements.length.toString(),
      color: '#10b981',
    },
    {
      icon: Calendar,
      label: 'Streak',
      value: `${user.streak} days`,
      color: '#ef4444',
    },
  ];

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Avatar>
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          ) : (
            user.username.charAt(0).toUpperCase()
          )}
        </Avatar>
        
        <UserInfo>
          <Username>{user.username}</Username>
          <UserEmail>{user.email}</UserEmail>
          <LevelBadge>
            <Award size={16} />
            Level {user.level}
          </LevelBadge>
        </UserInfo>
        
        <Actions>
          <Button size="sm" variant="outline">
            <Settings size={16} />
            Settings
          </Button>
          <Button size="sm" variant="secondary" onClick={handleSignOut}>
            <LogOut size={16} />
            Sign Out
          </Button>
        </Actions>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatIcon $color={stat.color}>
              <stat.icon size={24} />
            </StatIcon>
            <StatInfo>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatInfo>
          </StatCard>
        ))}
      </StatsGrid>

      <ProgressSection>
        <SectionTitle>
          <TrendingUp size={20} />
          Level Progress
        </SectionTitle>
        <ProgressBar>
          <ProgressFill
            $progress={currentLevelProgress}
            initial={{ width: 0 }}
            animate={{ width: `${currentLevelProgress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </ProgressBar>
        <ProgressText>
          <span>{user.xp} XP</span>
          <span>{xpToNextLevel} XP to Level {user.level + 1}</span>
        </ProgressText>
      </ProgressSection>

      {user.achievements.length > 0 && (
        <ProgressSection>
          <SectionTitle>
            <Trophy size={20} />
            Achievements ({user.achievements.length})
          </SectionTitle>
          <AchievementsGrid>
            {user.achievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                title={achievement.description}
              >
                <AchievementIcon>{achievement.icon}</AchievementIcon>
                <AchievementName>{achievement.name}</AchievementName>
              </AchievementCard>
            ))}
          </AchievementsGrid>
        </ProgressSection>
      )}
    </Container>
  );
};
