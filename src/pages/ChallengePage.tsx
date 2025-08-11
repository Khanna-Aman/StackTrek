import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { ChallengeSystem } from '@/components/challenges/ChallengeSystem';
import { getChallengeById } from '@/data/challenges';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { AuthService } from '@/services/authService';

const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const NotFound = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ChallengePage: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  const challenge = challengeId ? getChallengeById(challengeId) : null;

  const handleChallengeComplete = async (success: boolean, timeSpent: number, score: number) => {
    if (success && user) {
      try {
        // Award XP for completing the challenge
        await AuthService.addXP(user.uid, challenge!.xpReward);
        
        // Update user stats
        await AuthService.updateUserProfile(user.uid, {
          stats: {
            ...user.stats,
            challengesCompleted: (user.stats?.challengesCompleted || 0) + 1,
            totalTimeSpent: (user.stats?.totalTimeSpent || 0) + Math.floor(timeSpent / 60), // Convert to minutes
          }
        });

        console.log(`Challenge completed! Earned ${challenge!.xpReward} XP`);
      } catch (error) {
        console.error('Error updating user progress:', error);
      }
    }
  };

  const handleSkip = () => {
    navigate('/challenges');
  };

  const handleGoBack = () => {
    navigate('/challenges');
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  if (!challenge) {
    return (
      <Container>
        <Header>
          <BackButton variant="outline" onClick={handleGoBack}>
            <ArrowLeft size={16} />
            Back to Challenges
          </BackButton>
          <Button variant="outline" onClick={handleGoHome}>
            <Home size={16} />
            Dashboard
          </Button>
        </Header>
        <NotFound>
          <h2>Challenge Not Found</h2>
          <p>The challenge you're looking for doesn't exist or has been removed.</p>
          <Button onClick={handleGoBack} style={{ marginTop: '20px' }}>
            Browse Challenges
          </Button>
        </NotFound>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton variant="outline" onClick={handleGoBack}>
          <ArrowLeft size={16} />
          Back to Challenges
        </BackButton>
        <Button variant="outline" onClick={handleGoHome}>
          <Home size={16} />
          Dashboard
        </Button>
      </Header>
      
      <ChallengeSystem
        challenge={challenge}
        onComplete={handleChallengeComplete}
        onSkip={handleSkip}
      />
    </Container>
  );
};
