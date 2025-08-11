import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Timer,
  Target,
  Navigation,
  Route,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/common/Button';

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Header = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ComingSoonCard = styled(motion.div)`
  background: white;
  border-radius: 2rem;
  padding: 3rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

const IconWrapper = styled.div`
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 2rem 0;
  text-align: left;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
`;

const FeatureIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const FeatureText = styled.span`
  font-weight: 500;
  color: #374151;
`;

const ComingSoonBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #f59e0b;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

export const SortingRaceGame: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <BackButton variant="outline" onClick={() => navigate('/games')}>
          <ArrowLeft size={16} />
          Back to Games
        </BackButton>
      </Header>

      <ComingSoonCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ComingSoonBadge>
          <Lock size={16} />
          Coming Soon
        </ComingSoonBadge>

        <IconWrapper>
          <Zap size={32} />
        </IconWrapper>

        <Title>🏁 Sorting Race</Title>
        <Subtitle>
          Race against time to sort arrays using different algorithms!
          Compare performance and learn the strengths of each sorting method.
        </Subtitle>

        <FeatureList>
          <FeatureItem>
            <FeatureIcon>
              <Zap size={12} />
            </FeatureIcon>
            <FeatureText>Multiple sorting algorithms</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <Trophy size={12} />
            </FeatureIcon>
            <FeatureText>Performance comparison</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <Code size={12} />
            </FeatureIcon>
            <FeatureText>Real-time visualization</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <Calendar size={12} />
            </FeatureIcon>
            <FeatureText>Timed challenges</FeatureText>
          </FeatureItem>
        </FeatureList>

        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '0.75rem',
          padding: '1rem',
          margin: '2rem 0',
          color: '#92400e'
        }}>
          <strong>🚀 What to expect:</strong>
          <ul style={{ margin: '0.5rem 0 0 1rem', textAlign: 'left' }}>
            <li>Interactive bubble sort, quick sort, and merge sort</li>
            <li>Real-time performance metrics and comparisons</li>
            <li>Difficulty levels with different array sizes</li>
            <li>Leaderboards and achievement system</li>
          </ul>
        </div>

        <ActionButtons>
          <Button onClick={() => navigate('/games')}>
            Explore Other Games
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/data-structures')}
          >
            Learn Sorting First
          </Button>
        </ActionButtons>
      </ComingSoonCard>
    </Container>
  );
};
