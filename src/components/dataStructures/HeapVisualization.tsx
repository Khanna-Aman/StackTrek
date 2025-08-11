import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';

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

const HeapContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 400px;
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: auto;
`;

const HeapLevel = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 40px;
  position: relative;
`;

const HeapNode = styled(motion.div) <{ $highlighted?: boolean; $isRoot?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: ${({ theme, $highlighted, $isRoot }) =>
    $isRoot ? '#f59e0b' : $highlighted ? theme.colors.primary :
      `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.secondaryLight})`};
  color: ${({ $highlighted, $isRoot }) => ($highlighted || $isRoot) ? 'white' : 'inherit'};
  border: 2px solid ${({ theme, $highlighted, $isRoot }) =>
    $isRoot ? '#d97706' : $highlighted ? theme.colors.primaryHover : theme.colors.border};
  border-radius: 50%;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const ConnectionLine = styled.div<{ $direction: 'left' | 'right' }>`
  position: absolute;
  top: 25px;
  width: 25px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.border};
  transform-origin: ${({ $direction }) => $direction === 'left' ? 'right' : 'left'};
  transform: ${({ $direction }) =>
    $direction === 'left' ? 'rotate(-45deg)' : 'rotate(45deg)'};
`;

const ArrayRepresentation = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow-x: auto;
`;

const ArrayCell = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
  padding: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme, $highlighted }) =>
    $highlighted ? theme.colors.primary : theme.colors.background};
  color: ${({ $highlighted }) => $highlighted ? 'white' : 'inherit'};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ArrayIndex = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ArrayValue = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const HeapTypeSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const TypeButton = styled(Button) <{ $active: boolean }>`
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`;

const InfoPanel = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

type HeapType = 'max' | 'min';

export const HeapVisualization: React.FC = () => {
  const [heap, setHeap] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [heapType, setHeapType] = useState<HeapType>('max');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const getParentIndex = (index: number) => Math.floor((index - 1) / 2);
  const getLeftChildIndex = (index: number) => 2 * index + 1;
  const getRightChildIndex = (index: number) => 2 * index + 2;

  const heapifyUp = useCallback((arr: number[], index: number, type: HeapType) => {
    const newArr = [...arr];
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = getParentIndex(currentIndex);
      const shouldSwap = type === 'max'
        ? newArr[currentIndex] > newArr[parentIndex]
        : newArr[currentIndex] < newArr[parentIndex];

      if (!shouldSwap) break;

      [newArr[currentIndex], newArr[parentIndex]] = [newArr[parentIndex], newArr[currentIndex]];
      currentIndex = parentIndex;
    }

    return newArr;
  }, []);

  const heapifyDown = useCallback((arr: number[], index: number, type: HeapType) => {
    const newArr = [...arr];
    let currentIndex = index;

    while (true) {
      const leftChild = getLeftChildIndex(currentIndex);
      const rightChild = getRightChildIndex(currentIndex);
      let targetIndex = currentIndex;

      if (leftChild < newArr.length) {
        const shouldSwapLeft = type === 'max'
          ? newArr[leftChild] > newArr[targetIndex]
          : newArr[leftChild] < newArr[targetIndex];
        if (shouldSwapLeft) targetIndex = leftChild;
      }

      if (rightChild < newArr.length) {
        const shouldSwapRight = type === 'max'
          ? newArr[rightChild] > newArr[targetIndex]
          : newArr[rightChild] < newArr[targetIndex];
        if (shouldSwapRight) targetIndex = rightChild;
      }

      if (targetIndex === currentIndex) break;

      [newArr[currentIndex], newArr[targetIndex]] = [newArr[targetIndex], newArr[currentIndex]];
      currentIndex = targetIndex;
    }

    return newArr;
  }, []);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setHeap(prev => {
        const newHeap = [...prev, value];
        return heapifyUp(newHeap, newHeap.length - 1, heapType);
      });
      setInputValue('');
    }
  };

  const handleExtract = () => {
    if (heap.length === 0) return;

    setHeap(prev => {
      if (prev.length === 1) return [];

      const newHeap = [...prev];
      newHeap[0] = newHeap[newHeap.length - 1];
      newHeap.pop();
      return heapifyDown(newHeap, 0, heapType);
    });
  };

  const handleClear = () => {
    setHeap([]);
    setInputValue('');
    setHighlightedIndex(null);
  };

  const renderHeapTree = () => {
    if (heap.length === 0) return null;

    const levels: number[][] = [];
    let levelStart = 0;
    let levelSize = 1;

    while (levelStart < heap.length) {
      const level = heap.slice(levelStart, levelStart + levelSize);
      levels.push(level);
      levelStart += levelSize;
      levelSize *= 2;
    }

    return levels.map((level, levelIndex) => (
      <HeapLevel key={levelIndex}>
        {level.map((value, nodeIndex) => {
          const actualIndex = Math.pow(2, levelIndex) - 1 + nodeIndex;
          const hasLeftChild = getLeftChildIndex(actualIndex) < heap.length;
          const hasRightChild = getRightChildIndex(actualIndex) < heap.length;

          return (
            <HeapNode
              key={actualIndex}
              $highlighted={highlightedIndex === actualIndex}
              $isRoot={actualIndex === 0}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => setHighlightedIndex(actualIndex)}
              onMouseLeave={() => setHighlightedIndex(null)}
            >
              {value}
              {hasLeftChild && <ConnectionLine $direction="left" />}
              {hasRightChild && <ConnectionLine $direction="right" />}
            </HeapNode>
          );
        })}
      </HeapLevel>
    ));
  };

  return (
    <Container>
      <ControlsSection>
        <HeapTypeSelector>
          <TypeButton
            size="sm"
            $active={heapType === 'max'}
            onClick={() => setHeapType('max')}
          >
            <TrendingUp size={16} />
            Max Heap
          </TypeButton>
          <TypeButton
            size="sm"
            $active={heapType === 'min'}
            onClick={() => setHeapType('min')}
          >
            <TrendingDown size={16} />
            Min Heap
          </TypeButton>
        </HeapTypeSelector>

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
            Insert
          </Button>
          <Button size="sm" variant="outline" onClick={handleExtract}>
            <Minus size={16} />
            Extract {heapType === 'max' ? 'Max' : 'Min'}
          </Button>
        </InputGroup>

        <Button size="sm" variant="outline" onClick={handleClear}>
          <RotateCcw size={16} />
          Clear
        </Button>
      </ControlsSection>

      <HeapContainer>
        <AnimatePresence>
          {heap.length > 0 ? (
            renderHeapTree()
          ) : (
            <EmptyState>
              <div>🏔️</div>
              <div>Empty {heapType === 'max' ? 'Max' : 'Min'} Heap</div>
              <div>Add some numbers to get started!</div>
            </EmptyState>
          )}
        </AnimatePresence>
      </HeapContainer>

      {heap.length > 0 && (
        <div>
          <h4 style={{ marginBottom: '16px', color: 'var(--text-color)' }}>Array Representation:</h4>
          <ArrayRepresentation>
            {heap.map((value, index) => (
              <ArrayCell key={index} $highlighted={highlightedIndex === index}>
                <ArrayIndex>{index}</ArrayIndex>
                <ArrayValue>{value}</ArrayValue>
              </ArrayCell>
            ))}
          </ArrayRepresentation>
        </div>
      )}

      <InfoPanel>
        <strong>{heapType === 'max' ? 'Max' : 'Min'} Heap:</strong> A complete binary tree where each parent node is
        {heapType === 'max' ? ' greater than or equal to' : ' less than or equal to'} its children.
        <br />
        <strong>Operations:</strong> Insert O(log n), Extract {heapType === 'max' ? 'Max' : 'Min'} O(log n),
        Peek O(1). Commonly used for priority queues and heap sort.
      </InfoPanel>
    </Container>
  );
};
