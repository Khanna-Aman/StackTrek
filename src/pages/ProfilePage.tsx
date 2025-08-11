import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import {
    User,
    Calendar,
    Trophy,
    Star,
    Target,
    Zap,
    Award,
    TrendingUp,
    Clock
} from 'lucide-react';
import { XPSystem, calculateLevel } from '@/components/gamification/XPSystem';

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
`;

const ProfileCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: 0 auto ${({ theme }) => theme.spacing[4]};
`;

const UserName = styled.h2`
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const UserEmail = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin: 0 auto ${({ theme }) => theme.spacing[2]};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ProfilePage: React.FC = () => {
    const { user, isAuthenticated } = useAppSelector(state => state.auth);

    if (!isAuthenticated || !user) {
        return (
            <Container>
                <Header>
                    <Title>Profile</Title>
                </Header>
                <ProfileCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                        <User size={48} style={{ marginBottom: '16px', color: 'var(--text-secondary)' }} />
                        <h3 style={{ marginBottom: '12px' }}>Sign In Required</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Please sign in to view your profile and track your learning progress.
                        </p>
                    </div>
                </ProfileCard>
            </Container>
        );
    }

    const stats = [
        {
            icon: Star,
            label: 'Current Level',
            value: user.level || 1
        },
        {
            icon: Trophy,
            label: 'Total XP',
            value: user.totalXp || 0
        },
        {
            icon: Target,
            label: 'Challenges',
            value: user.stats?.challengesCompleted || 0
        },
        {
            icon: Zap,
            label: 'Streak',
            value: `${user.streak || 0} days`
        },
        {
            icon: Clock,
            label: 'Time Spent',
            value: `${user.stats?.totalTimeSpent || 0}h`
        },
        {
            icon: Award,
            label: 'Achievements',
            value: user.achievements?.length || 0
        }
    ];

    return (
        <Container>
            <Header>
                <Title>Your Profile</Title>
            </Header>

            <ProfileCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Avatar>
                    {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <UserName>{user.username || 'User'}</UserName>
                <UserEmail>{user.email}</UserEmail>

                <StatsGrid>
                    {stats.map((stat, index) => (
                        <StatCard key={stat.label}>
                            <StatIcon>
                                <stat.icon size={24} />
                            </StatIcon>
                            <StatValue>{stat.value}</StatValue>
                            <StatLabel>{stat.label}</StatLabel>
                        </StatCard>
                    ))}
                </StatsGrid>
            </ProfileCard>

            <ProfileCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <SectionTitle>
                    <TrendingUp size={24} />
                    Progress Overview
                </SectionTitle>
                <XPSystem
                    currentXP={user.totalXp || 0}
                    currentLevel={calculateLevel(user.totalXp || 0)}
                    showLevelUp={false}
                />
            </ProfileCard>

            <ProfileCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <SectionTitle>
                    <Award size={24} />
                    Learning Statistics
                </SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <strong>Data Structures Completed:</strong> {user.stats?.dataStructuresCompleted || 0}
                    </div>
                    <div>
                        <strong>Average Score:</strong> {user.stats?.averageScore || 0}%
                    </div>
                    <div>
                        <strong>Perfect Scores:</strong> {user.stats?.perfectScores || 0}
                    </div>
                    <div>
                        <strong>Favorite Topic:</strong> {user.stats?.favoriteDataStructure || 'None yet'}
                    </div>
                </div>
            </ProfileCard>
        </Container>
    );
};