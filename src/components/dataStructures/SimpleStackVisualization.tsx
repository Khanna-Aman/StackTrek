import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

interface SimpleStackVisualizationProps {
  initialStack?: number[];
  maxSize?: number;
}

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const VisualizationArea = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.surface} 0%, 
    ${({ theme }) => theme.colors.backgroundSecondary} 100%);
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  min-height: 400px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: relative;
`;

const StackElement = styled(motion.div) <{ $isTop: boolean }>`
  width: 120px;
  height: 50px;
  background-color: ${({ $isTop, theme }) =>
    $isTop ? theme.colors.primary : theme.colors.surface};
  color: ${({ $isTop, theme }) =>
    $isTop ? 'white' : theme.colors.text};
  border: 2px solid ${({ $isTop, theme }) =>
    $isTop ? theme.colors.primaryHover : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;
`;

const TopIndicator = styled.div`
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const StackBase = styled.div`
  width: 140px;
  height: 10px;
  background-color: ${({ theme }) => theme.colors.textMuted};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const ControlPanel = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  min-width: 300px;
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  width: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const StackInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const OperationInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const OperationText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const EmptyState = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-align: center;
`;

export const SimpleStackVisualization: React.FC<SimpleStackVisualizationProps> = ({
  initialStack = [10, 20, 30],
  maxSize = 8,
}) => {
  const [stack, setStack] = useState<number[]>(initialStack);
  const [pushValue, setPushValue] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<string>('');

  const handlePush = () => {
    const value = parseInt(pushValue);

    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }

    if (stack.length >= maxSize) {
      alert('Stack overflow! Maximum size reached.');
      return;
    }

    setStack([...stack, value]);
    setLastOperation(`Pushed ${value} onto the stack - Time: O(1), Space: O(1)`);
    setPushValue('');
  };

  const handlePop = () => {
    if (stack.length === 0) {
      alert('Stack underflow! Stack is empty.');
      return;
    }

    const poppedValue = stack[stack.length - 1];
    setStack(stack.slice(0, -1));
    setLastOperation(`Popped ${poppedValue} from the stack - Time: O(1), Space: O(1)`);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setLastOperation('Stack is empty - nothing to peek');
      return;
    }

    const topValue = stack[stack.length - 1];
    setLastOperation(`Top element is ${topValue} - Time: O(1), Space: O(1)`);
  };

  const handleReset = () => {
    setStack(initialStack);
    setLastOperation('');
    setPushValue('');
  };

  const isEmpty = stack.length === 0;
  const isFull = stack.length >= maxSize;

  return (
    <Container>
      <VisualizationArea>
        <AnimatePresence>
          {stack.length === 0 ? (
            <EmptyState>Empty Stack</EmptyState>
          ) : (
            stack.map((value, index) => (
              <StackElement
                key={`${value}-${index}`}
                $isTop={index === stack.length - 1}
                initial={{ scale: 0, y: -20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {value}
                {index === stack.length - 1 && (
                  <TopIndicator>← TOP</TopIndicator>
                )}
              </StackElement>
            ))
          )}
        </AnimatePresence>
        <StackBase />
      </VisualizationArea>

      <ControlPanel
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StackInfo>
          <InfoItem>
            <InfoLabel>Size</InfoLabel>
            <InfoValue>{stack.length}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Capacity</InfoLabel>
            <InfoValue>{maxSize}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Top</InfoLabel>
            <InfoValue>{isEmpty ? 'Empty' : stack[stack.length - 1]}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Status</InfoLabel>
            <InfoValue style={{ color: isEmpty ? '#ef4444' : isFull ? '#f59e0b' : '#10b981' }}>
              {isEmpty ? 'Empty' : isFull ? 'Full' : 'Active'}
            </InfoValue>
          </InfoItem>
        </StackInfo>

        <ControlRow>
          <Input
            type="number"
            placeholder="Enter value"
            value={pushValue}
            onChange={(e) => setPushValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePush()}
          />
          <Button size="sm" onClick={handlePush} disabled={isFull}>
            <ArrowUp size={16} />
            Push
          </Button>
        </ControlRow>

        <ControlRow>
          <Button size="sm" variant="secondary" onClick={handlePop} disabled={isEmpty}>
            <ArrowDown size={16} />
            Pop
          </Button>
          <Button size="sm" variant="outline" onClick={handlePeek} disabled={isEmpty}>
            Peek
          </Button>
          <Button size="sm" variant="ghost" onClick={handleReset}>
            <RotateCcw size={16} />
            Reset
          </Button>
        </ControlRow>

        {lastOperation && (
          <OperationInfo>
            <OperationText>{lastOperation}</OperationText>
          </OperationInfo>
        )}
      </ControlPanel>
    </Container>
  );
};
