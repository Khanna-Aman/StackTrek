import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, Eye, RotateCcw } from 'lucide-react';
import { EnhancedTutorialSystem } from '@/components/tutorial/EnhancedTutorialSystem';
import { stackTutorial } from '@/data/tutorials/stackTutorial';

interface StackItem {
  value: number;
  id: string;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const VisualizationArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StackContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  min-height: 300px;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  position: relative;
  z-index: 1;
`;

const StackBase = styled.div`
  width: 120px;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  position: relative;
  
  &::before {
    content: 'Bottom';
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const StackElement = styled(motion.div) <{ $isTop?: boolean; $highlighted?: boolean }>`
  width: 100px;
  height: 50px;
  background: ${({ theme, $isTop, $highlighted }) =>
    $highlighted ? '#f59e0b' :
      $isTop ? theme.colors.primary :
        `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.secondaryLight})`};
  color: ${({ $isTop, $highlighted }) => ($isTop || $highlighted) ? 'white' : 'inherit'};
  border: 2px solid ${({ theme, $isTop, $highlighted }) =>
    $highlighted ? '#d97706' :
      $isTop ? theme.colors.primaryHover : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  ${({ $isTop }) => $isTop && `
    &::after {
      content: 'TOP';
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: bold;
      color: var(--primary-color);
    }
  `}
`;

const ControlsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const InputGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  width: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  text-align: center;
`;

const StepIndicator = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: relative;
  z-index: 10;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StackInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const InfoLabel = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

export const TutorialStackVisualization: React.FC = () => {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [lastOperation, setLastOperation] = useState<string>('');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Demo operations based on tutorial steps
  useEffect(() => {
    switch (currentStep) {
      case 0: // Introduction
        setStack([
          { value: 10, id: generateId() },
          { value: 20, id: generateId() },
          { value: 30, id: generateId() }
        ]);
        setLastOperation('Stack with LIFO principle');
        break;
      case 1: // Operations
        setStack([
          { value: 5, id: generateId() },
          { value: 15, id: generateId() }
        ]);
        setLastOperation('Basic stack operations');
        break;
      case 2: // Push
        setStack([{ value: 10, id: generateId() }]);
        setLastOperation('Push operation demo');
        break;
      case 3: // Pop
        setStack([
          { value: 10, id: generateId() },
          { value: 20, id: generateId() },
          { value: 30, id: generateId() }
        ]);
        setLastOperation('Pop operation demo');
        break;
      case 4: // Applications
        setStack([
          { value: 1, id: generateId() },
          { value: 2, id: generateId() },
          { value: 3, id: generateId() },
          { value: 4, id: generateId() }
        ]);
        setLastOperation('Real-world applications');
        break;
      case 5: // Implementation
        setStack([
          { value: 100, id: generateId() },
          { value: 200, id: generateId() }
        ]);
        setLastOperation('Implementation strategies');
        break;
      default:
        break;
    }
  }, [currentStep]);

  const handlePush = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      const newItem = { value, id: generateId() };
      setStack(prev => [...prev, newItem]);
      setInputValue('');
      setLastOperation(`Pushed ${value}`);

      // Highlight the new top element
      setTimeout(() => {
        setHighlightedIndex(stack.length);
        setTimeout(() => setHighlightedIndex(null), 1000);
      }, 100);
    }
  };

  const handlePop = () => {
    if (stack.length > 0) {
      const poppedValue = stack[stack.length - 1].value;
      setStack(prev => prev.slice(0, -1));
      setLastOperation(`Popped ${poppedValue}`);

      // Highlight the element being removed
      setHighlightedIndex(stack.length - 1);
      setTimeout(() => setHighlightedIndex(null), 500);
    }
  };

  const handlePeek = () => {
    if (stack.length > 0) {
      const topValue = stack[stack.length - 1].value;
      setLastOperation(`Peeked: ${topValue}`);

      // Highlight the top element
      setHighlightedIndex(stack.length - 1);
      setTimeout(() => setHighlightedIndex(null), 1500);
    }
  };

  const handleClear = () => {
    setStack([]);
    setInputValue('');
    setHighlightedIndex(null);
    setLastOperation('Stack cleared');
  };

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    setHighlightedIndex(null);
  };

  const getStepDescription = () => {
    const descriptions = [
      'Stack follows LIFO: Last In, First Out principle',
      'Core operations: push, pop, peek, isEmpty, size',
      'Push adds elements to the top of the stack',
      'Pop removes and returns the top element',
      'Stacks power function calls, undo operations, and more',
      'Can be implemented with arrays or linked lists'
    ];
    return descriptions[currentStep] || '';
  };

  return (
    <Container>
      <EnhancedTutorialSystem
        title={stackTutorial.title}
        description={stackTutorial.description}
        steps={stackTutorial.steps}
        onStepChange={handleStepChange}
      >
        <VisualizationArea>
          <StepIndicator>
            {getStepDescription()}
          </StepIndicator>

          <StackContainer>
            <StackBase />
            <AnimatePresence>
              {stack.length > 0 ? (
                stack.map((item, index) => (
                  <StackElement
                    key={item.id}
                    $isTop={index === stack.length - 1}
                    $highlighted={highlightedIndex === index}
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => index === stack.length - 1 && handlePop()}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.value}
                  </StackElement>
                ))
              ) : (
                <EmptyState>
                  <div>📚</div>
                  <div>Empty Stack</div>
                  <div>Push some elements!</div>
                </EmptyState>
              )}
            </AnimatePresence>
          </StackContainer>

          <StackInfo>
            <InfoItem>
              <InfoLabel>Size</InfoLabel>
              <InfoValue>{stack.length}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Top</InfoLabel>
              <InfoValue>{stack.length > 0 ? stack[stack.length - 1].value : 'None'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Empty</InfoLabel>
              <InfoValue>{stack.length === 0 ? 'Yes' : 'No'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Last Operation</InfoLabel>
              <InfoValue>{lastOperation || 'None'}</InfoValue>
            </InfoItem>
          </StackInfo>

          <ControlsSection>
            <InputGroup>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value"
                onKeyDown={(e) => e.key === 'Enter' && handlePush()}
              />
              <Button size="sm" onClick={handlePush}>
                <Plus size={16} />
                Push
              </Button>
            </InputGroup>

            <Button size="sm" variant="outline" onClick={handlePop} disabled={stack.length === 0}>
              <Minus size={16} />
              Pop
            </Button>

            <Button size="sm" variant="outline" onClick={handlePeek} disabled={stack.length === 0}>
              <Eye size={16} />
              Peek
            </Button>

            <Button size="sm" variant="outline" onClick={handleClear}>
              <RotateCcw size={16} />
              Clear
            </Button>
          </ControlsSection>
        </VisualizationArea>
      </EnhancedTutorialSystem>
    </Container>
  );
};
