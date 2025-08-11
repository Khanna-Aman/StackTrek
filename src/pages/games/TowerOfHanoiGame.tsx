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
  Star,
  Timer,
  Target,
  CheckCircle,
  RotateCw
} from 'lucide-react';
import { Button } from '@/components/common/Button';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GameTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #1a1a1a;
`;

const GameStats = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
`;

const GameArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const PlayArea = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const TowersContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  min-height: 400px;
  background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
  border-radius: 0.5rem;
  padding: 2rem;
  position: relative;
`;

const Tower = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  min-height: 300px;
  width: 150px;
  position: relative;
  cursor: pointer;
  border: 2px solid ${({ $selected }) => $selected ? '#6366f1' : 'transparent'};
  border-radius: 0.5rem;
  padding: 1rem;
  background: ${({ $selected }) => $selected ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  
  &:hover {
    background: rgba(99, 102, 241, 0.05);
  }
`;

const TowerBase = styled.div`
  width: 120px;
  height: 10px;
  background: #64748b;
  border-radius: 0.25rem;
  position: absolute;
  bottom: 1rem;
`;

const TowerPole = styled.div`
  width: 6px;
  height: 250px;
  background: #64748b;
  position: absolute;
  bottom: 1.5rem;
  border-radius: 0.25rem;
`;

const TowerLabel = styled.div`
  position: absolute;
  bottom: -0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const Disk = styled(motion.div) <{ $size: number; $color: string }>`
  width: ${({ $size }) => 40 + $size * 15}px;
  height: 20px;
  background: ${({ $color }) => $color};
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2px;
  z-index: 10;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InfoCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const InfoTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const Controls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const DifficultySelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const DifficultyLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`;

const DifficultyButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const DifficultyButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ $active }) => $active ? '#6366f1' : '#d1d5db'};
  background: ${({ $active }) => $active ? '#6366f1' : 'white'};
  color: ${({ $active }) => $active ? 'white' : '#374151'};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => $active ? '#5b21b6' : '#f3f4f6'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ScoreDisplay = styled.div`
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const GameOverModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

interface Disk {
  id: number;
  size: number;
  color: string;
}

const diskColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

export const TowerOfHanoiGame: React.FC = () => {
  const navigate = useNavigate();
  const [towers, setTowers] = useState<Disk[][]>([[], [], []]);
  const [selectedTower, setSelectedTower] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [diskCount, setDiskCount] = useState(3);
  const [minMoves, setMinMoves] = useState(7); // 2^n - 1

  useEffect(() => {
    initializeGame();
  }, [diskCount]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => setTimeElapsed(timeElapsed + 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, timeElapsed]);

  useEffect(() => {
    // Check if game is won (all disks on tower 3)
    if (towers[2].length === diskCount && diskCount > 0 && isPlaying) {
      setIsPlaying(false);
      setGameOver(true);
    }
  }, [towers, diskCount, isPlaying]);

  const initializeGame = () => {
    const disks: Disk[] = [];
    for (let i = diskCount; i >= 1; i--) {
      disks.push({
        id: i,
        size: i,
        color: diskColors[(i - 1) % diskColors.length]
      });
    }
    setTowers([disks, [], []]);
    setSelectedTower(null);
    setMoves(0);
    setTimeElapsed(0);
    setMinMoves(Math.pow(2, diskCount) - 1);
    setGameOver(false);
  };

  const startGame = () => {
    setIsPlaying(true);
    initializeGame();
  };

  const pauseGame = () => {
    setIsPlaying(!isPlaying);
  };

  const resetGame = () => {
    setIsPlaying(false);
    initializeGame();
  };

  const changeDifficulty = (newDiskCount: number) => {
    if (isPlaying) return; // Don't allow changes during game
    setDiskCount(newDiskCount);
  };

  const getDifficultyLabel = (count: number) => {
    switch (count) {
      case 3: return 'Easy';
      case 4: return 'Medium';
      case 5: return 'Hard';
      case 6: return 'Expert';
      default: return 'Custom';
    }
  };

  const handleTowerClick = (towerIndex: number) => {
    if (!isPlaying) return;

    if (selectedTower === null) {
      // Select a tower to move from
      if (towers[towerIndex].length > 0) {
        setSelectedTower(towerIndex);
      }
    } else {
      // Move disk to this tower
      if (selectedTower === towerIndex) {
        // Deselect if clicking same tower
        setSelectedTower(null);
      } else {
        moveDisk(selectedTower, towerIndex);
        setSelectedTower(null);
      }
    }
  };

  const moveDisk = (fromTower: number, toTower: number) => {
    const newTowers = [...towers];
    const fromStack = newTowers[fromTower];
    const toStack = newTowers[toTower];

    if (fromStack.length === 0) return;

    const disk = fromStack[fromStack.length - 1];
    const topDisk = toStack.length > 0 ? toStack[toStack.length - 1] : null;

    // Check if move is valid (can't place larger disk on smaller)
    if (topDisk && disk.size > topDisk.size) {
      return;
    }

    // Make the move
    newTowers[fromTower] = fromStack.slice(0, -1);
    newTowers[toTower] = [...toStack, disk];

    setTowers(newTowers);
    setMoves(moves + 1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScore = () => {
    if (!gameOver) return 0;
    const efficiency = Math.max(0, 100 - Math.floor((moves - minMoves) / minMoves * 50));
    const timeBonus = Math.max(0, 100 - Math.floor(timeElapsed / 10));
    return efficiency + timeBonus;
  };

  return (
    <Container>
      <Header>
        <BackButton variant="outline" onClick={() => navigate('/games')}>
          <ArrowLeft size={16} />
          Back to Games
        </BackButton>
        <GameTitle>🗼 Tower of Hanoi</GameTitle>
        <GameStats>
          <StatItem>
            <Timer size={16} />
            {formatTime(timeElapsed)}
          </StatItem>
          <StatItem>
            <RotateCw size={16} />
            {moves} moves
          </StatItem>
          <StatItem>
            <Target size={16} />
            Min: {minMoves}
          </StatItem>
        </GameStats>
      </Header>

      <GameArea>
        <PlayArea>
          <TowersContainer>
            {towers.map((tower, towerIndex) => (
              <Tower
                key={towerIndex}
                $selected={selectedTower === towerIndex}
                onClick={() => handleTowerClick(towerIndex)}
              >
                <TowerBase />
                <TowerPole />
                <TowerLabel>
                  {towerIndex === 0 ? 'Source' : towerIndex === 1 ? 'Auxiliary' : 'Destination'}
                </TowerLabel>
                {tower.map((disk, diskIndex) => (
                  <Disk
                    key={disk.id}
                    $size={disk.size}
                    $color={disk.color}
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {disk.size}
                  </Disk>
                ))}
              </Tower>
            ))}
          </TowersContainer>
        </PlayArea>

        <Sidebar>
          <InfoCard>
            <InfoTitle>🎯 Objective</InfoTitle>
            <InfoText>
              Move all disks from the left tower to the right tower.
            </InfoText>
            <InfoText>
              <strong>Rules:</strong>
              <br />• Only move one disk at a time
              <br />• Never place a larger disk on a smaller one
              <br />• Use the middle tower as auxiliary space
            </InfoText>
            <InfoText>
              <strong>Current:</strong> {diskCount} disks ({getDifficultyLabel(diskCount)})
              <br />
              <strong>Optimal solution:</strong> {minMoves} moves
            </InfoText>
          </InfoCard>

          <InfoCard>
            <InfoTitle>🎮 Controls</InfoTitle>
            <Controls>
              {!isPlaying ? (
                <Button onClick={startGame} size="sm">
                  <Play size={16} />
                  Start
                </Button>
              ) : (
                <Button onClick={pauseGame} variant="outline" size="sm">
                  <Pause size={16} />
                  Pause
                </Button>
              )}
              <Button onClick={resetGame} variant="outline" size="sm">
                <RotateCcw size={16} />
                Reset
              </Button>
            </Controls>

            <DifficultySelector>
              <DifficultyLabel>Difficulty Level:</DifficultyLabel>
              <DifficultyButtons>
                {[3, 4, 5, 6].map((count) => (
                  <DifficultyButton
                    key={count}
                    $active={diskCount === count}
                    disabled={isPlaying}
                    onClick={() => changeDifficulty(count)}
                  >
                    {count} Disks
                    <br />
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                      {getDifficultyLabel(count)}
                    </span>
                  </DifficultyButton>
                ))}
              </DifficultyButtons>
            </DifficultySelector>

            <InfoText>
              Click a tower to select it, then click another tower to move the top disk.
            </InfoText>
          </InfoCard>

          <ScoreDisplay>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {getScore()}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
              Efficiency Score
            </div>
          </ScoreDisplay>
        </Sidebar>
      </GameArea>

      <AnimatePresence>
        {gameOver && (
          <GameOverModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <Trophy size={48} color="#6366f1" style={{ marginBottom: '1rem' }} />
              <h2 style={{ marginBottom: '1rem' }}>Puzzle Solved! 🎉</h2>
              <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
                Moves: <strong>{moves}</strong> (Optimal: {minMoves})
              </p>
              <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
                Time: <strong>{formatTime(timeElapsed)}</strong>
              </p>
              <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                Efficiency Score: <strong>{getScore()}</strong>
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Button onClick={startGame}>
                  Play Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/games')}>
                  Back to Games
                </Button>
              </div>
            </ModalContent>
          </GameOverModal>
        )}
      </AnimatePresence>
    </Container>
  );
};
