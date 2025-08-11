import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Play, Pause, RotateCcw, Shuffle, Target } from 'lucide-react';

interface SearchItem {
  value: number;
  id: string;
  isTarget?: boolean;
  isChecking?: boolean;
  isFound?: boolean;
  isInRange?: boolean;
}

type SearchAlgorithm = 'linear' | 'binary' | 'jump' | 'interpolation';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ControlsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const AlgorithmSelector = styled.select`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  min-width: 160px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &:hover {
    border-color: #10b981;
  }
`;

const TargetInput = styled.input`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  width: 100px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const SpeedControl = styled.input`
  width: 120px;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #e2e8f0, #10b981);
  outline: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
    transition: all 0.3s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
`;

const VisualizationArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid rgba(255, 255, 255, 0.8);
  overflow-x: auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 0 0 ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl};
  }
`;

const SearchItem = styled(motion.div) <{
  $isTarget?: boolean;
  $isChecking?: boolean;
  $isFound?: boolean;
  $isInRange?: boolean;
}>`
  width: 60px;
  height: 60px;
  background: ${({ $isTarget, $isChecking, $isFound, $isInRange }) => {
    if ($isFound) return 'linear-gradient(135deg, #10b981, #059669)';
    if ($isTarget) return 'linear-gradient(135deg, #ef4444, #dc2626)';
    if ($isChecking) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    if ($isInRange) return 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
    return 'linear-gradient(135deg, #0891b2, #0e7490)';
  }};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin: 0 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  box-shadow: ${({ $isChecking, $isFound }) => {
    if ($isFound) return '0 4px 12px rgba(16, 185, 129, 0.4)';
    if ($isChecking) return '0 4px 12px rgba(245, 158, 11, 0.4)';
    return '0 2px 8px rgba(0, 0, 0, 0.1)';
  }};
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;

  ${({ $isTarget }) => $isTarget && `
    &::after {
      content: '🎯';
      position: absolute;
      top: -8px;
      right: -8px;
      font-size: 16px;
    }
  `}
`;

const StatsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const algorithmInfo = {
  linear: {
    name: 'Linear Search',
    description: 'Sequentially checks each element until the target is found.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)'
  },
  binary: {
    name: 'Binary Search',
    description: 'Efficiently searches sorted arrays by repeatedly dividing the search interval.',
    timeComplexity: 'O(log n)',
    spaceComplexity: 'O(1)'
  },
  jump: {
    name: 'Jump Search',
    description: 'Jumps ahead by fixed steps, then performs linear search in the block.',
    timeComplexity: 'O(√n)',
    spaceComplexity: 'O(1)'
  },
  interpolation: {
    name: 'Interpolation Search',
    description: 'Estimates the position of the target based on value distribution.',
    timeComplexity: 'O(log log n)',
    spaceComplexity: 'O(1)'
  }
};

export const SearchingVisualization: React.FC = () => {
  const [array, setArray] = useState<SearchItem[]>([]);
  const [algorithm, setAlgorithm] = useState<SearchAlgorithm>('linear');
  const [target, setTarget] = useState<number>(50);
  const [speed, setSpeed] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [comparisons, setComparisons] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [found, setFound] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateRandomArray = useCallback((size: number = 15) => {
    const newArray: SearchItem[] = [];
    const sortedValues = Array.from({ length: size }, (_, i) => (i + 1) * 7);

    for (let i = 0; i < size; i++) {
      newArray.push({
        value: sortedValues[i],
        id: `item-${i}-${Date.now()}`,
      });
    }

    setArray(newArray);
    setComparisons(0);
    setCurrentStep(0);
    setIsComplete(false);
    setFound(false);

    // Set a random target from the array
    const randomTarget = sortedValues[Math.floor(Math.random() * sortedValues.length)];
    setTarget(randomTarget);
  }, []);

  const resetArray = () => {
    setArray(prev => prev.map(item => ({
      ...item,
      isTarget: false,
      isChecking: false,
      isFound: false,
      isInRange: false
    })));
    setComparisons(0);
    setCurrentStep(0);
    setIsComplete(false);
    setFound(false);
    setIsPlaying(false);
  };

  const linearSearch = useCallback(async () => {
    const arr = [...array];
    let compCount = 0;
    let stepCount = 0;

    // Reset all states
    arr.forEach(item => {
      item.isChecking = false;
      item.isFound = false;
      item.isInRange = false;
    });
    setArray([...arr]);

    for (let i = 0; i < arr.length; i++) {
      if (!isPlaying) return;

      // Clear previous highlighting
      arr.forEach(item => {
        item.isChecking = false;
      });

      // Highlight current element being checked
      arr[i].isChecking = true;
      setArray([...arr]);
      compCount++;
      stepCount++;
      setComparisons(compCount);
      setCurrentStep(stepCount);

      // Wait to show the checking animation
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, Math.max(300, 2000 - speed * 15));
      });

      if (!isPlaying) return;

      if (arr[i].value === target) {
        // Found the target!
        arr[i].isFound = true;
        arr[i].isChecking = false;
        setArray([...arr]);
        setFound(true);
        setIsComplete(true);
        setIsPlaying(false);
        return;
      }

      // Not found, clear highlighting and continue
      arr[i].isChecking = false;
      setArray([...arr]);

      // Small delay before checking next element
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, Math.max(150, 1000 - speed * 8));
      });
    }

    // Target not found
    setIsComplete(true);
    setIsPlaying(false);
  }, [array, target, speed, isPlaying]);

  const binarySearch = useCallback(async () => {
    const arr = [...array];
    let left = 0;
    let right = arr.length - 1;
    let compCount = 0;
    let stepCount = 0;

    while (left <= right) {
      if (!isPlaying) return;

      const mid = Math.floor((left + right) / 2);

      // Highlight the range being searched
      for (let i = left; i <= right; i++) {
        arr[i].isInRange = true;
      }

      // Highlight the middle element
      arr[mid].isChecking = true;
      setArray([...arr]);
      compCount++;
      stepCount++;
      setComparisons(compCount);
      setCurrentStep(stepCount);

      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 101 - speed);
      });

      if (arr[mid].value === target) {
        arr[mid].isFound = true;
        arr[mid].isChecking = false;
        setArray([...arr]);
        setFound(true);
        setIsComplete(true);
        setIsPlaying(false);
        return;
      }

      // Clear previous highlighting
      for (let i = 0; i < arr.length; i++) {
        arr[i].isInRange = false;
        arr[i].isChecking = false;
      }

      if (arr[mid].value < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }

      setArray([...arr]);
    }

    setIsComplete(true);
    setIsPlaying(false);
  }, [array, target, speed, isPlaying]);

  const jumpSearch = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    const stepSize = Math.floor(Math.sqrt(n));
    let step = stepSize;
    let prev = 0;
    let compCount = 0;
    let stepCount = 0;

    // Jump through the array
    while (arr[Math.min(step, n) - 1].value < target) {
      if (!isPlaying) return;

      // Highlight the jump
      arr[Math.min(step, n) - 1].isChecking = true;
      setArray([...arr]);
      compCount++;
      stepCount++;
      setComparisons(compCount);
      setCurrentStep(stepCount);

      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 101 - speed);
      });

      arr[Math.min(step, n) - 1].isChecking = false;
      prev = step;
      step += stepSize;

      if (prev >= n) {
        setIsComplete(true);
        setIsPlaying(false);
        return;
      }
    }

    // Linear search in the identified block
    for (let i = prev; i < Math.min(step, n); i++) {
      if (!isPlaying) return;

      arr[i].isChecking = true;
      setArray([...arr]);
      compCount++;
      stepCount++;
      setComparisons(compCount);
      setCurrentStep(stepCount);

      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 101 - speed);
      });

      if (arr[i].value === target) {
        arr[i].isFound = true;
        arr[i].isChecking = false;
        setArray([...arr]);
        setFound(true);
        setIsComplete(true);
        setIsPlaying(false);
        return;
      }

      arr[i].isChecking = false;
      setArray([...arr]);
    }

    setIsComplete(true);
    setIsPlaying(false);
  }, [array, target, speed, isPlaying]);

  const startSearch = async () => {
    if (isComplete) return;

    setIsPlaying(true);

    switch (algorithm) {
      case 'linear':
        await linearSearch();
        break;
      case 'binary':
      case 'jump':
      case 'interpolation':
        alert('This search algorithm is coming in the next version!');
        setIsPlaying(false);
        break;
      default:
        await linearSearch();
    }
  };

  const pauseSearch = () => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  React.useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Container>
      <ControlsSection>
        <AlgorithmSelector
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as SearchAlgorithm)}
          disabled={isPlaying}
        >
          <option value="linear">Linear Search</option>
          <option value="binary">Binary Search - Coming Soon</option>
          <option value="jump">Jump Search - Coming Soon</option>
          <option value="interpolation">Interpolation Search - Coming Soon</option>
        </AlgorithmSelector>

        <div>
          <label>Target: </label>
          <TargetInput
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
            disabled={isPlaying}
          />
        </div>

        <div>
          <label>Speed: </label>
          <SpeedControl
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            disabled={isPlaying}
          />
        </div>

        <Button
          onClick={isPlaying ? pauseSearch : startSearch}
          disabled={isComplete}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause' : 'Start'}
        </Button>

        <Button variant="outline" onClick={resetArray} disabled={isPlaying}>
          <RotateCcw size={16} />
          Reset
        </Button>

        <Button variant="outline" onClick={() => generateRandomArray()} disabled={isPlaying}>
          <Shuffle size={16} />
          New Array
        </Button>
      </ControlsSection>

      <VisualizationArea>
        <AnimatePresence>
          {array.map((item, index) => (
            <SearchItem
              key={item.id}
              $isTarget={item.value === target}
              $isChecking={item.isChecking}
              $isFound={item.isFound}
              $isInRange={item.isInRange}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {item.value}
            </SearchItem>
          ))}
        </AnimatePresence>
      </VisualizationArea>

      <StatsPanel>
        <StatItem>
          <StatValue>{comparisons}</StatValue>
          <StatLabel>Comparisons</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{currentStep}</StatValue>
          <StatLabel>Steps</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{array.length}</StatValue>
          <StatLabel>Array Size</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue style={{ color: found ? '#10b981' : isPlaying ? '#f59e0b' : '#64748b' }}>
            {found ? 'Found' : isPlaying ? 'Searching' : 'Ready'}
          </StatValue>
          <StatLabel>Status</StatLabel>
        </StatItem>
      </StatsPanel>
    </Container>
  );
};
