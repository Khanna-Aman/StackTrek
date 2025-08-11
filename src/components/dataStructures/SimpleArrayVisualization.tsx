import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, Search, RotateCcw } from 'lucide-react';

interface SimpleArrayVisualizationProps {
  initialArray?: number[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const VisualizationArea = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.surface} 0%, 
    ${({ theme }) => theme.colors.backgroundSecondary} 100%);
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[8]};
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ArrayCell = styled(motion.div)<{ $highlighted: boolean }>`
  width: 80px;
  height: 60px;
  background-color: ${({ $highlighted, theme }) => 
    $highlighted ? theme.colors.primary : theme.colors.surface};
  color: ${({ $highlighted, theme }) => 
    $highlighted ? 'white' : theme.colors.text};
  border: 2px solid ${({ $highlighted, theme }) => 
    $highlighted ? theme.colors.primaryHover : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: relative;
`;

const IndexLabel = styled.div`
  position: absolute;
  bottom: -25px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ControlPanel = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
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
  width: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  min-width: 60px;
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
`;

export const SimpleArrayVisualization: React.FC<SimpleArrayVisualizationProps> = ({
  initialArray = [10, 25, 30, 45, 60],
}) => {
  const [array, setArray] = useState<number[]>(initialArray);
  const [insertValue, setInsertValue] = useState<string>('');
  const [insertIndex, setInsertIndex] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [deleteIndex, setDeleteIndex] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const handleInsert = () => {
    const value = parseInt(insertValue);
    const index = parseInt(insertIndex);
    
    if (isNaN(value) || isNaN(index) || index < 0 || index > array.length) {
      alert('Please enter valid value and index');
      return;
    }

    const newArray = [...array];
    newArray.splice(index, 0, value);
    setArray(newArray);
    setHighlightedIndex(index);
    setLastOperation(`Inserted ${value} at index ${index} - Time: O(n), Space: O(1)`);

    setTimeout(() => setHighlightedIndex(null), 2000);
    setInsertValue('');
    setInsertIndex('');
  };

  const handleDelete = () => {
    const index = parseInt(deleteIndex);
    
    if (isNaN(index) || index < 0 || index >= array.length) {
      alert('Please enter a valid index');
      return;
    }

    const deletedValue = array[index];
    const newArray = [...array];
    newArray.splice(index, 1);
    setArray(newArray);
    setLastOperation(`Deleted ${deletedValue} from index ${index} - Time: O(n), Space: O(1)`);

    setDeleteIndex('');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    
    if (isNaN(value)) {
      alert('Please enter a valid value to search');
      return;
    }

    const index = array.indexOf(value);
    
    if (index !== -1) {
      setHighlightedIndex(index);
      setLastOperation(`Found ${value} at index ${index} - Time: O(n), Space: O(1)`);
    } else {
      setLastOperation(`${value} not found in array - Time: O(n), Space: O(1)`);
    }

    setTimeout(() => setHighlightedIndex(null), 3000);
    setSearchValue('');
  };

  const handleReset = () => {
    setArray(initialArray);
    setHighlightedIndex(null);
    setLastOperation('');
    setInsertValue('');
    setInsertIndex('');
    setSearchValue('');
    setDeleteIndex('');
  };

  return (
    <Container>
      <VisualizationArea>
        {array.length === 0 ? (
          <EmptyState>Empty Array</EmptyState>
        ) : (
          array.map((value, index) => (
            <ArrayCell
              key={`${value}-${index}`}
              $highlighted={highlightedIndex === index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {value}
              <IndexLabel>{index}</IndexLabel>
            </ArrayCell>
          ))
        )}
      </VisualizationArea>

      <ControlPanel
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ControlRow>
          <Label>Insert:</Label>
          <Input
            type="number"
            placeholder="Value"
            value={insertValue}
            onChange={(e) => setInsertValue(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Index"
            value={insertIndex}
            onChange={(e) => setInsertIndex(e.target.value)}
          />
          <Button size="sm" onClick={handleInsert}>
            <Plus size={16} />
            Insert
          </Button>
        </ControlRow>

        <ControlRow>
          <Label>Delete:</Label>
          <Input
            type="number"
            placeholder="Index"
            value={deleteIndex}
            onChange={(e) => setDeleteIndex(e.target.value)}
          />
          <Button size="sm" variant="secondary" onClick={handleDelete}>
            <Minus size={16} />
            Delete
          </Button>

          <Label style={{ marginLeft: '20px' }}>Search:</Label>
          <Input
            type="number"
            placeholder="Value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button size="sm" variant="outline" onClick={handleSearch}>
            <Search size={16} />
            Search
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
