import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, Search, RotateCcw } from 'lucide-react';
import { EnhancedTutorialSystem } from '@/components/tutorial/EnhancedTutorialSystem';
import { arrayTutorial } from '@/data/tutorials/arrayTutorial';
import type { TutorialStep } from '@/types/tutorial';

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
  gap: ${({ theme }) => theme.spacing[6]};
`;

const ArrayContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 600px;
`;

const ArrayCell = styled(motion.div) <{ $highlighted?: boolean; $found?: boolean }>`
  width: 60px;
  height: 60px;
  background: ${({ theme, $highlighted, $found }) =>
    $found ? '#10b981' : $highlighted ? theme.colors.primary :
      `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.secondaryLight})`};
  color: ${({ $highlighted, $found }) => ($highlighted || $found) ? 'white' : 'inherit'};
  border: 2px solid ${({ theme, $highlighted, $found }) =>
    $found ? '#059669' : $highlighted ? theme.colors.primaryHover : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CellValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const CellIndex = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  opacity: 0.7;
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
  margin-top: ${({ theme }) => theme.spacing[4]};
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
  width: 100px;

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
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const TutorialArrayVisualization: React.FC = () => {
  const [array, setArray] = useState<number[]>([10, 25, 30, 40, 55]);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // Demo operations based on tutorial steps
  useEffect(() => {
    switch (currentStep) {
      case 0: // Introduction
        setArray([10, 25, 30, 40, 55]);
        setHighlightedIndex(null);
        setFoundIndex(null);
        break;
      case 1: // Creation
        setArray([1, 2, 3, 4, 5]);
        break;
      case 2: // Access
        setArray([10, 20, 30, 40, 50]);
        // Highlight first element
        setHighlightedIndex(0);
        setTimeout(() => setHighlightedIndex(2), 1000);
        setTimeout(() => setHighlightedIndex(4), 2000);
        setTimeout(() => setHighlightedIndex(null), 3000);
        break;
      case 3: // Insertion
        setArray([1, 2, 3]);
        break;
      case 4: // Deletion
        setArray([1, 2, 3, 4, 5]);
        break;
      case 5: // Searching
        setArray([10, 25, 30, 40, 55]);
        break;
      case 6: // Common operations
        setArray([1, 2, 3, 4, 5]);
        break;
      default:
        break;
    }
  }, [currentStep]);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setArray(prev => [...prev, value]);
      setInputValue('');
      // Highlight the new element
      setTimeout(() => {
        setHighlightedIndex(array.length);
        setTimeout(() => setHighlightedIndex(null), 1000);
      }, 100);
    }
  };

  const handleDelete = (index: number) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value)) {
      const index = array.findIndex(item => item === value);
      if (index !== -1) {
        setFoundIndex(index);
        setTimeout(() => setFoundIndex(null), 2000);
      }
    }
  };

  const handleClear = () => {
    setArray([]);
    setInputValue('');
    setSearchValue('');
    setHighlightedIndex(null);
    setFoundIndex(null);
  };

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const getStepDescription = () => {
    const descriptions = [
      'Arrays store elements in contiguous memory locations',
      'Arrays can be created and initialized in various ways',
      'Elements are accessed using zero-based indexing',
      'New elements can be added at different positions',
      'Elements can be removed from various positions',
      'Searching finds the position of specific values',
      'Arrays support many built-in operations'
    ];
    return descriptions[currentStep] || '';
  };

  return (
    <Container>
      <EnhancedTutorialSystem
        title={arrayTutorial.title}
        description={arrayTutorial.description}
        steps={arrayTutorial.steps}
        onStepChange={handleStepChange}
      >
        <VisualizationArea>
          <StepIndicator>
            {getStepDescription()}
          </StepIndicator>

          <ArrayContainer>
            <AnimatePresence>
              {array.length > 0 ? (
                array.map((value, index) => (
                  <ArrayCell
                    key={`${value}-${index}`}
                    $highlighted={highlightedIndex === index}
                    $found={foundIndex === index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleDelete(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CellValue>{value}</CellValue>
                    <CellIndex>[{index}]</CellIndex>
                  </ArrayCell>
                ))
              ) : (
                <EmptyState>
                  <div>📊</div>
                  <div>Empty Array</div>
                  <div>Add some elements to get started!</div>
                </EmptyState>
              )}
            </AnimatePresence>
          </ArrayContainer>

          <ControlsSection>
            <InputGroup>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value"
                onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
              />
              <Button size="sm" onClick={handleInsert}>
                <Plus size={16} />
                Add
              </Button>
            </InputGroup>

            <InputGroup>
              <Input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button size="sm" variant="outline" onClick={handleSearch}>
                <Search size={16} />
                Find
              </Button>
            </InputGroup>

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
