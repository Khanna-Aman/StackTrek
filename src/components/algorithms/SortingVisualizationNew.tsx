import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface SortItem {
  value: number;
  id: string;
  colorKey: number; // 0 = normal, 1 = comparing, 2 = sorted
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

const VisualizationArea = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  min-height: 400px;
  padding: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02));
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const SortBar = styled(motion.div)<{ $height: number; $colorKey: number }>`
  width: 40px;
  background: ${({ $colorKey }) => {
    if ($colorKey === 1) return '#ff304f'; // comparing
    if ($colorKey === 2) return '#83e85a'; // sorted
    return '#3d5af1'; // normal
  }};
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 14px;
  height: ${({ $height }) => $height}px;
  transition: background-color 0.3s ease;
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

// Bubble Sort Algorithm - generates all steps
const bubbleSort = (array: number[]): { steps: number[][], colors: number[][] } => {
  const steps: number[][] = [];
  const colors: number[][] = [];
  const arr = [...array];
  let colorKey = new Array(arr.length).fill(0);
  
  steps.push([...arr]);
  colors.push([...colorKey]);

  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      // Mark elements being compared
      colorKey[j] = 1;
      colorKey[j + 1] = 1;
      steps.push([...arr]);
      colors.push([...colorKey]);

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push([...arr]);
        colors.push([...colorKey]);
      }

      // Reset comparison colors
      colorKey[j] = 0;
      colorKey[j + 1] = 0;
    }
    // Mark sorted element
    colorKey[arr.length - 1 - i] = 2;
    steps.push([...arr]);
    colors.push([...colorKey]);
  }
  
  // Mark all as sorted
  colorKey.fill(2);
  colors[colors.length - 1] = [...colorKey];
  
  return { steps, colors };
};

export const SortingVisualization: React.FC = () => {
  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42]);
  const [colorKey, setColorKey] = useState<number[]>(new Array(11).fill(0));
  const [steps, setSteps] = useState<number[][]>([]);
  const [colors, setColors] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [comparisons, setComparisons] = useState<number>(0);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const generateSteps = useCallback(() => {
    const { steps: newSteps, colors: newColors } = bubbleSort(array);
    setSteps(newSteps);
    setColors(newColors);
    setCurrentStep(0);
    setComparisons(Math.floor(newSteps.length / 2)); // Approximate comparisons
  }, [array]);

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  const startSort = () => {
    if (currentStep >= steps.length - 1) return;
    
    setIsPlaying(true);
    clearTimeouts();
    
    let i = 0;
    const remainingSteps = steps.length - currentStep;
    
    while (i < remainingSteps) {
      const timeout = setTimeout(() => {
        const stepIndex = currentStep + i;
        if (stepIndex < steps.length) {
          setArray([...steps[stepIndex]]);
          setColorKey([...colors[stepIndex]]);
          setCurrentStep(stepIndex + 1);
          
          if (stepIndex === steps.length - 1) {
            setIsComplete(true);
            setIsPlaying(false);
          }
        }
      }, 500 * i);
      
      timeoutsRef.current.push(timeout);
      i++;
    }
  };

  const pauseSort = () => {
    setIsPlaying(false);
    clearTimeouts();
  };

  const resetSort = () => {
    clearTimeouts();
    setIsPlaying(false);
    setIsComplete(false);
    setCurrentStep(0);
    setArray([64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42]);
    setColorKey(new Array(11).fill(0));
    generateSteps();
  };

  useEffect(() => {
    generateSteps();
  }, [generateSteps]);

  useEffect(() => {
    return () => clearTimeouts();
  }, []);

  const bars = array.map((value, index) => (
    <SortBar
      key={`bar-${index}`}
      $height={value * 3}
      $colorKey={colorKey[index] || 0}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {value}
    </SortBar>
  ));

  return (
    <Container>
      <ControlsSection>
        <Button
          onClick={isPlaying ? pauseSort : startSort}
          disabled={isComplete}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause' : 'Start'}
        </Button>

        <Button variant="outline" onClick={resetSort} disabled={isPlaying}>
          <RotateCcw size={16} />
          Reset
        </Button>
      </ControlsSection>

      <VisualizationArea>
        {bars}
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
          <StatValue style={{ color: isComplete ? '#10b981' : isPlaying ? '#f59e0b' : '#64748b' }}>
            {isComplete ? 'Complete' : isPlaying ? 'Sorting' : 'Ready'}
          </StatValue>
          <StatLabel>Status</StatLabel>
        </StatItem>
      </StatsSection>
    </Container>
  );
};
