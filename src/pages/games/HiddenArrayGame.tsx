import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { RotateCcw, Target, Eye, EyeOff, Trophy, Clock } from 'lucide-react';

interface ArrayItem {
  value: number;
  id: string;
  isFlipped: boolean;
  isTarget: boolean;
  isFound: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  max-width: 1000px;
  margin: 0 auto;
`;

const GameHeader = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1));
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(16, 185, 129, 0.2);
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ControlsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const TargetDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid rgba(16, 185, 129, 0.3);
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ArrayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: rgba(255, 255, 255, 0.02);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ArrayTile = styled(motion.div) <{
  $isFlipped: boolean;
  $isTarget: boolean;
  $isFound: boolean;
}>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 700;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${({ $isFlipped, $isFound, $isTarget, theme }) => {
    if ($isFound) {
      return `
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
        transform: scale(1.05);
      `;
    } else if ($isFlipped) {
      return `
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
        color: ${theme.colors.text};
        border: 2px solid rgba(239, 68, 68, 0.3);
      `;
    } else {
      return `
        background: linear-gradient(135deg, rgba(30, 58, 138, 0.8), rgba(30, 58, 138, 0.6));
        color: transparent;
        border: 2px solid rgba(30, 58, 138, 0.9);

        &:hover {
          background: linear-gradient(135deg, rgba(30, 58, 138, 0.9), rgba(30, 58, 138, 0.7));
          border-color: rgba(30, 58, 138, 1);
          transform: translateY(-2px);
        }
      `;
    }
  }}
`;

const StatsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[3]};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const GameResult = styled(motion.div) <{ $isWin: boolean }>`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ $isWin }) =>
    $isWin
      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))'
      : 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))'
  };
  border: 2px solid ${({ $isWin }) =>
    $isWin
      ? 'rgba(16, 185, 129, 0.3)'
      : 'rgba(239, 68, 68, 0.3)'
  };
`;

const generateSortedArray = (size: number): ArrayItem[] => {
  const values: number[] = [];
  let current = Math.floor(Math.random() * 10) + 1;

  for (let i = 0; i < size; i++) {
    values.push(current);
    current += Math.floor(Math.random() * 15) + 1; // Random gaps between 1-15
  }

  return values.map((value, index) => ({
    value,
    id: `item-${index}`,
    isFlipped: false,
    isTarget: false,
    isFound: false
  }));
};

export const HiddenArrayGame: React.FC = () => {
  const [array, setArray] = useState<ArrayItem[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [gameComplete, setGameComplete] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [flipTimeout, setFlipTimeout] = useState<NodeJS.Timeout | null>(null);

  const initializeGame = useCallback(() => {
    const newArray = generateSortedArray(12);
    const targetIndex = Math.floor(Math.random() * newArray.length);
    const targetValue = newArray[targetIndex].value;

    newArray[targetIndex].isTarget = true;

    setArray(newArray);
    setTarget(targetValue);
    setAttempts(0);
    setGameComplete(false);
    setGameWon(false);
    setStartTime(Date.now());
    setEndTime(0);

    if (flipTimeout) {
      clearTimeout(flipTimeout);
      setFlipTimeout(null);
    }
  }, []);

  const startNewGame = () => {
    if (flipTimeout) {
      clearTimeout(flipTimeout);
      setFlipTimeout(null);
    }
    initializeGame();
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleTileClick = (index: number) => {
    if (gameComplete || array[index].isFlipped) return;

    const newArray = [...array];
    newArray[index].isFlipped = true;
    setArray(newArray);
    setAttempts(prev => prev + 1);

    if (newArray[index].isTarget) {
      // Found the target!
      newArray[index].isFound = true;
      setArray(newArray);
      setGameComplete(true);
      setGameWon(true);
      setEndTime(Date.now());
    } else {
      // Wrong tile, flip back after 1 second
      // Clear any existing timeout
      if (flipTimeout) {
        clearTimeout(flipTimeout);
      }

      const timeout = setTimeout(() => {
        const resetArray = newArray.map(item => ({
          ...item,
          isFlipped: false
        }));
        setArray(resetArray);
      }, 1500);
      setFlipTimeout(timeout);
    }
  };

  const getGameTime = () => {
    if (startTime === 0) return 0;
    const end = endTime || Date.now();
    return Math.floor((end - startTime) / 1000);
  };

  return (
    <Container>
      <GameHeader>
        <Title>🔍 Hidden Array Search</Title>
        <Description>
          Find the target number in this sorted array! Click tiles to reveal numbers.
          The array is sorted in ascending order to help you strategize your search.
        </Description>
        <TargetDisplay>
          <Target size={20} />
          Find: {target}
        </TargetDisplay>

      </GameHeader>

      <ControlsSection>
        <Button onClick={startNewGame}>
          <RotateCcw size={16} />
          New Game
        </Button>
      </ControlsSection>

      <ArrayGrid>
        <AnimatePresence>
          {array.map((item, index) => (
            <ArrayTile
              key={item.id}
              $isFlipped={item.isFlipped}
              $isTarget={item.isTarget}
              $isFound={item.isFound}
              onClick={() => handleTileClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {item.isFlipped || item.isFound ? item.value : ''}
            </ArrayTile>
          ))}
        </AnimatePresence>
      </ArrayGrid>

      <StatsPanel>
        <StatItem>
          <StatValue>{attempts}</StatValue>
          <StatLabel>Attempts</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{getGameTime()}s</StatValue>
          <StatLabel>Time</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{array.length}</StatValue>
          <StatLabel>Array Size</StatLabel>
        </StatItem>
      </StatsPanel>

      <AnimatePresence>
        {gameComplete && (
          <GameResult
            $isWin={gameWon}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >

            <h3 style={{ marginBottom: '1rem', color: 'var(--text-color)' }}>
              {gameWon ? 'Congratulations!' : 'Game Over'}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              {gameWon
                ? `You found ${target} in ${attempts} attempts and ${getGameTime()} seconds!`
                : 'Better luck next time!'
              }
            </p>
          </GameResult>
        )}
      </AnimatePresence>
    </Container>
  );
};
