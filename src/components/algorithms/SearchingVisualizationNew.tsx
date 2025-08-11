import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface SearchItem {
  value: number;
  id: string;
  colorKey: number; // 0 = normal, 1 = checking, 2 = found, 3 = not found
}

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
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.2);
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

const VisualizationArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SearchElement = styled(motion.div)<{ $colorKey: number }>`
  width: 60px;
  height: 60px;
  background: ${({ $colorKey }) => {
    if ($colorKey === 1) return '#ff304f'; // checking
    if ($colorKey === 2) return '#83e85a'; // found
    return '#3d5af1'; // normal
  }};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  ${({ $colorKey }) => $colorKey === 1 && `
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 48, 79, 0.4);
  `}

  ${({ $colorKey }) => $colorKey === 2 && `
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(131, 232, 90, 0.4);
  `}
`;

const StatsSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  justify-content: center;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

// Linear Search Algorithm - generates all steps
const linearSearch = (array: number[], target: number): { steps: number[][], colors: number[][], found: boolean } => {
  const steps: number[][] = [];
  const colors: number[][] = [];
  const arr = [...array];
  let colorKey = new Array(arr.length).fill(0);
  let found = false;
  
  steps.push([...arr]);
  colors.push([...colorKey]);

  for (let i = 0; i < arr.length; i++) {
    // Mark current element as checking
    colorKey[i] = 1;
    steps.push([...arr]);
    colors.push([...colorKey]);

    if (arr[i] === target) {
      // Found the target
      colorKey[i] = 2;
      found = true;
      steps.push([...arr]);
      colors.push([...colorKey]);
      break;
    }

    // Reset current element
    colorKey[i] = 0;
    steps.push([...arr]);
    colors.push([...colorKey]);
  }
  
  return { steps, colors, found };
};

export const SearchingVisualization: React.FC = () => {
  const [array] = useState<number[]>([7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98]);
  const [colorKey, setColorKey] = useState<number[]>(new Array(14).fill(0));
  const [target, setTarget] = useState<number>(42);
  const [steps, setSteps] = useState<number[][]>([]);
  const [colors, setColors] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [found, setFound] = useState<boolean>(false);
  const [comparisons, setComparisons] = useState<number>(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const generateSteps = useCallback(() => {
    const { steps: newSteps, colors: newColors, found: targetFound } = linearSearch(array, target);
    setSteps(newSteps);
    setColors(newColors);
    setCurrentStep(0);
    setFound(targetFound);
    setComparisons(Math.floor(newSteps.length / 2)); // Approximate comparisons
  }, [array, target]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  const startSearch = () => {
    if (currentStep >= steps.length - 1) return;
    
    setIsPlaying(true);
    clearTimeouts();
    
    let i = 0;
    const remainingSteps = steps.length - currentStep;
    
    while (i < remainingSteps) {
      const timeout = setTimeout(() => {
        const stepIndex = currentStep + i;
        if (stepIndex < steps.length) {
          setColorKey([...colors[stepIndex]]);
          setCurrentStep(stepIndex + 1);
          
          if (stepIndex === steps.length - 1) {
            setIsComplete(true);
            setIsPlaying(false);
          }
        }
      }, 800 * i);
      
      timeoutsRef.current.push(timeout);
      i++;
    }
  };

  const pauseSearch = () => {
    setIsPlaying(false);
    clearTimeouts();
  };

  const resetSearch = () => {
    clearTimeouts();
    setIsPlaying(false);
    setIsComplete(false);
    setCurrentStep(0);
    setColorKey(new Array(14).fill(0));
    generateSteps();
  };

  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  const elements = array.map((value, index) => (
    <SearchElement
      key={`element-${index}`}
      $colorKey={colorKey[index] || 0}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {value}
    </SearchElement>
  ));

  return (
    <Container>
      <ControlsSection>
        <div>
          <label>Target: </label>
          <TargetInput
            type="number"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
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

        <Button variant="outline" onClick={resetSearch} disabled={isPlaying}>
          <RotateCcw size={16} />
          Reset
        </Button>
      </ControlsSection>

      <VisualizationArea>
        {elements}
      </VisualizationArea>

      <StatsSection>
        <StatItem>
          <StatValue>{comparisons}</StatValue>
          <StatLabel>Comparisons</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{currentStep}</StatValue>
          <StatLabel>Steps</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue style={{ color: found && isComplete ? '#10b981' : isComplete && !found ? '#ef4444' : isPlaying ? '#f59e0b' : '#64748b' }}>
            {found && isComplete ? 'Found' : isComplete && !found ? 'Not Found' : isPlaying ? 'Searching' : 'Ready'}
          </StatValue>
          <StatLabel>Status</StatLabel>
        </StatItem>
      </StatsSection>
    </Container>
  );
};
