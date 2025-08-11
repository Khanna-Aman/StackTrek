import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import {
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  Calendar,
  Users,
  Target,
  Zap,
  Award,
  Clock
} from 'lucide-react';

interface LeaderboardUser {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  totalXP: number;
  weeklyXP: number;
  challengesCompleted: number;
  streak: number;
  rank: number;
  weeklyRank: number;
  badges: string[];
}

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

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  justify-content: center;
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.backgroundSecondary};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryHover : theme.colors.backgroundTertiary};
  }
`;

const MainLeaderboard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const PodiumSection = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[6]};
  color: white;
  text-align: center;
`;

const PodiumTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Podium = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const PodiumPlace = styled(motion.div) <{ $place: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  backdrop-filter: blur(10px);
  height: ${({ $place }) => {
    switch ($place) {
      case 1: return '140px';
      case 2: return '120px';
      case 3: return '100px';
      default: return '80px';
    }
  }};
  min-width: 110px;
  position: relative;
  border: 2px solid ${({ $place, theme }) => {
    switch ($place) {
      case 1: return '#fbbf24';
      case 2: return '#9ca3af';
      case 3: return '#cd7c2f';
      default: return 'transparent';
    }
  }};
`;

const PlaceIcon = styled.div<{ $place: number }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  background: ${({ $place }) => {
    switch ($place) {
      case 1: return '#fbbf24';
      case 2: return '#9ca3af';
      case 3: return '#cd7c2f';
      default: return '#6b7280';
    }
  }};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const PlaceName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  text-align: center;
  color: #1a1a1a;
`;

const PlaceXP = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  opacity: 0.9;
  text-align: center;
  color: #2a2a2a;
  line-height: 1.2;
`;

const LeaderboardList = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const LeaderboardItem = styled(motion.div) <{ $isCurrentUser?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  background: ${({ $isCurrentUser, theme }) =>
    $isCurrentUser ? theme.colors.primaryLight : theme.colors.backgroundSecondary};
  border: 2px solid ${({ $isCurrentUser, theme }) =>
    $isCurrentUser ? theme.colors.primary : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const RankBadge = styled.div<{ $rank: number }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: white;
  background: ${({ $rank }) => {
    if ($rank <= 3) return '#fbbf24';
    if ($rank <= 10) return '#10b981';
    if ($rank <= 50) return '#3b82f6';
    return '#6b7280';
  }};
`;

const UserInfo = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #10b981);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const UserDetails = styled.div`
  flex: 1;
`;

const Username = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: #1a1a1a;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const UserStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: #2a2a2a;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

// Mock data for demonstration
const mockLeaderboardData: LeaderboardUser[] = [
  {
    id: '1',
    username: 'CodeMaster',
    level: 15,
    totalXP: 2450,
    weeklyXP: 380,
    challengesCompleted: 24,
    streak: 12,
    rank: 1,
    weeklyRank: 1,
    badges: ['speed-demon', 'perfectionist']
  },
  {
    id: '2',
    username: 'AlgoNinja',
    level: 14,
    totalXP: 2200,
    weeklyXP: 320,
    challengesCompleted: 22,
    streak: 8,
    rank: 2,
    weeklyRank: 2,
    badges: ['tree-master']
  },
  {
    id: '3',
    username: 'DataWizard',
    level: 13,
    totalXP: 1980,
    weeklyXP: 290,
    challengesCompleted: 19,
    streak: 15,
    rank: 3,
    weeklyRank: 3,
    badges: ['consistency-king']
  }
];

export const LeaderboardPage: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState<'all-time' | 'weekly'>('all-time');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>(mockLeaderboardData);

  // Add current user to leaderboard if authenticated and not already present
  useEffect(() => {
    if (user) {
      setLeaderboardData(prev => {
        // Check if user already exists in leaderboard
        const userExists = prev.some(userData => userData.id === user.id);

        if (!userExists) {
          const currentUserData: LeaderboardUser = {
            id: user.id,
            username: user.username || user.email?.split('@')[0] || 'You',
            level: user.level || 1,
            totalXP: user.totalXp || 0,
            weeklyXP: 150, // Mock weekly XP
            challengesCompleted: user.stats?.challengesCompleted || 0,
            streak: user.streak || 0,
            rank: 4, // Mock rank
            weeklyRank: 4,
            badges: []
          };

          return [...prev.slice(0, 3), currentUserData, ...prev.slice(3)];
        }

        return prev;
      });
    }
  }, [user]);

  const topThree = leaderboardData.slice(0, 3);
  const restOfList = leaderboardData.slice(3);

  const tabs = [
    { id: 'all-time', label: 'All Time', icon: Trophy },
    { id: 'weekly', label: 'This Week', icon: Calendar }
  ];

  return (
    <Container>
      <Header>
        <Title>Leaderboard</Title>
        <Subtitle>
          Compete with learners worldwide and climb the ranks as you master data structures!
        </Subtitle>
      </Header>

      <TabsContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as 'all-time' | 'weekly')}
          >
            <tab.icon size={18} />
            {tab.label}
          </Tab>
        ))}
      </TabsContainer>

      <MainLeaderboard>
        <PodiumSection>
          <PodiumTitle>🏆 Top Performers</PodiumTitle>
          <Podium>
            {topThree.map((userData, index) => (
              <PodiumPlace
                key={userData.id}
                $place={index + 1}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <PlaceIcon $place={index + 1}>
                  {index === 0 ? <Crown /> : index === 1 ? <Medal /> : <Trophy />}
                </PlaceIcon>
                <PlaceName>{userData.username}</PlaceName>
                <PlaceXP>Level {userData.level}</PlaceXP>
                <PlaceXP>{activeTab === 'weekly' ? userData.weeklyXP : userData.totalXP} XP</PlaceXP>
              </PodiumPlace>
            ))}
          </Podium>
        </PodiumSection>

        <LeaderboardList>
          <AnimatePresence>
            {restOfList.map((userData, index) => (
              <LeaderboardItem
                key={userData.id}
                $isCurrentUser={userData.id === user?.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <RankBadge $rank={userData.rank}>
                  {userData.rank}
                </RankBadge>

                <UserInfo>
                  <Avatar>
                    {userData.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <UserDetails>
                    <Username>{userData.username}</Username>
                    <UserStats>
                      <StatItem>
                        <Star size={14} />
                        Level {userData.level}
                      </StatItem>
                      <StatItem>
                        <Target size={14} />
                        {userData.challengesCompleted} challenges
                      </StatItem>
                      <StatItem>
                        <Zap size={14} />
                        {userData.streak} day streak
                      </StatItem>
                    </UserStats>
                  </UserDetails>
                </UserInfo>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px' }}>
                    {activeTab === 'weekly' ? userData.weeklyXP : userData.totalXP} XP
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {activeTab === 'weekly' ? 'This week' : 'Total'}
                  </div>
                </div>
              </LeaderboardItem>
            ))}
          </AnimatePresence>
        </LeaderboardList>
      </MainLeaderboard>

      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'var(--surface)',
        borderRadius: '16px',
        border: '1px solid var(--border)'
      }}>
        <Trophy size={48} style={{ marginBottom: '16px', color: 'var(--primary)' }} />
        <h3 style={{ marginBottom: '12px' }}>Keep Learning!</h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          Complete more challenges and tutorials to climb the leaderboard!
        </p>
      </div>
    </Container>
  );
};
