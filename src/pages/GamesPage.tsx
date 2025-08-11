import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Zap,
  Target,
  Puzzle,
  Timer,
  Trophy,
  Star,
  Play,
  Lock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/common/Button';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const GameCard = styled(motion.div) <{ $available: boolean }>`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  cursor: ${({ $available }) => $available ? 'pointer' : 'not-allowed'};
  opacity: ${({ $available }) => $available ? 1 : 0.6};
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: ${({ $available }) => $available ? '0 10px 25px -3px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'};
  }
`;

const GameIcon = styled.div<{ $color: string }>`
  width: 4rem;
  height: 4rem;
  background: ${({ $color }) => $color};
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.5rem;
`;

const GameTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.75rem;
`;

const GameDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const GameStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const GameFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Difficulty = styled.span<{ $level: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${({ $level }) => {
    switch ($level) {
      case 'easy': return '#dcfce7';
      case 'medium': return '#fef3c7';
      case 'hard': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${({ $level }) => {
    switch ($level) {
      case 'easy': return '#166534';
      case 'medium': return '#92400e';
      case 'hard': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const ComingSoonBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f59e0b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AvailableBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  xpReward: number;
  available: boolean;
}

const games: Game[] = [
  {
    id: 'tower-of-hanoi',
    title: 'Tower of Hanoi',
    description: 'Master the classic recursive puzzle! Move disks between towers following the rules. Perfect for understanding recursion and problem-solving strategies.',
    icon: Target,
    color: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    difficulty: 'medium',
    duration: '5-15 min',
    xpReward: 100,
    available: true
  },
  {
    id: 'hidden-array',
    title: 'Hidden Array Search',
    description: 'Find the target number in a sorted array! Click tiles to reveal numbers. Use your knowledge of sorted arrays to find the target efficiently.',
    icon: Puzzle,
    color: 'linear-gradient(135deg, #10b981, #059669)',
    difficulty: 'medium',
    duration: '3-8 min',
    xpReward: 100,
    available: true
  },
  {
    id: 'sorting-race',
    title: 'Sorting Race',
    description: 'Race against time to sort arrays using different algorithms. Compare bubble sort, quick sort, and merge sort performance!',
    icon: Zap,
    color: 'linear-gradient(135deg, #f59e0b, #d97706)',
    difficulty: 'hard',
    duration: '10-15 min',
    xpReward: 100,
    available: false
  },
  {
    id: 'tree-builder',
    title: 'Tree Builder',
    description: 'Construct balanced binary trees by placing nodes in the correct positions. Learn tree traversal and balancing concepts!',
    icon: Gamepad2,
    color: 'linear-gradient(135deg, #ef4444, #dc2626)',
    difficulty: 'medium',
    duration: '8-12 min',
    xpReward: 85,
    available: false
  }
];

export const GamesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGameClick = (game: Game) => {
    if (game.available) {
      navigate(`/games/${game.id}`);
    } else {
      alert(`🎮 ${game.title} is coming soon! \n\nCurrently available games:\n• Tower of Hanoi\n• Hidden Array Search`);
    }
  };

  return (
    <Container>
      <Header>
        <Title>🎮 Mini Games</Title>
        <Subtitle>
          Learn data structures and algorithms through fun, interactive games.
          Earn XP, compete with friends, and master programming concepts while having a blast!
        </Subtitle>
      </Header>

      <GamesGrid>
        {games.map((game, index) => (
          <GameCard
            key={game.id}
            $available={game.available}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => handleGameClick(game)}
            whileHover={game.available ? { scale: 1.02 } : {}}
            whileTap={game.available ? { scale: 0.98 } : {}}
          >
            {game.available ? (
              <AvailableBadge>
                <CheckCircle size={12} />
                Available
              </AvailableBadge>
            ) : (
              <ComingSoonBadge>
                <Lock size={12} />
                Coming Soon
              </ComingSoonBadge>
            )}

            <GameIcon $color={game.color}>
              <game.icon size={24} />
            </GameIcon>

            <GameTitle>{game.title}</GameTitle>
            <GameDescription>{game.description}</GameDescription>

            <GameStats>
              <StatItem>
                <Timer size={14} />
                {game.duration}
              </StatItem>
              <StatItem>
                <Star size={14} />
                {game.xpReward} XP
              </StatItem>
            </GameStats>

            <GameFooter>
              <Difficulty $level={game.difficulty}>
                {game.difficulty}
              </Difficulty>
              <Button
                size="sm"
                disabled={!game.available}
                onClick={(e) => e.stopPropagation()}
              >
                {game.available ? (
                  <>
                    <Play size={14} />
                    Play Now
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    Locked
                  </>
                )}
              </Button>
            </GameFooter>
          </GameCard>
        ))}
      </GamesGrid>
    </Container>
  );
};
