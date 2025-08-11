import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, Search, RotateCcw } from 'lucide-react';

interface ArrayVisualizationProps {
  initialArray?: number[];
  width?: number;
  height?: number;
}

interface ArrayOperation {
  type: 'insert' | 'delete' | 'search' | 'access';
  index: number;
  value?: number;
  description: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const VisualizationArea = styled.div<{ $width: number; $height: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.surface} 0%, 
    ${({ theme }) => theme.colors.backgroundSecondary} 100%);
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SVGContainer = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
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

const ComplexityInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ArrayVisualization: React.FC<ArrayVisualizationProps> = ({
  initialArray = [10, 25, 30, 45, 60],
  width = 800,
  height = 300,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [array, setArray] = useState<number[]>(initialArray);
  const [insertValue, setInsertValue] = useState<string>('');
  const [insertIndex, setInsertIndex] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [deleteIndex, setDeleteIndex] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<ArrayOperation | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  const cellWidth = 80;
  const cellHeight = 60;
  const startX = 50;
  const startY = height / 2 - cellHeight / 2;

  useEffect(() => {
    renderArray();
  }, [array, highlightedIndex]);

  const renderArray = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Create array cells with D3
    const cellGroup = svg.selectAll('.array-cell')
      .data(array)
      .enter()
      .append('g')
      .attr('class', 'array-cell')
      .attr('transform', (d, i) => `translate(${startX + i * (cellWidth + 10)}, ${startY})`);

    // Cell rectangles with smooth transitions
    cellGroup.append('rect')
      .attr('width', cellWidth)
      .attr('height', cellHeight)
      .attr('rx', 8)
      .attr('fill', (d, i) => highlightedIndex === i ? '#6366f1' : '#f8fafc')
      .attr('stroke', (d, i) => highlightedIndex === i ? '#4f46e5' : '#e2e8f0')
      .attr('stroke-width', 2)
      .style('transition', 'all 0.3s ease')
      .style('filter', (d, i) => highlightedIndex === i ? 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3))' : 'none');

    // Cell values
    cellGroup.append('text')
      .attr('x', cellWidth / 2)
      .attr('y', cellHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', (d, i) => highlightedIndex === i ? 'white' : '#1e293b')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(d => d);

    // Index labels
    cellGroup.append('text')
      .attr('x', cellWidth / 2)
      .attr('y', cellHeight + 20)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '12px')
      .text((d, i) => i);

    // Array brackets
    svg.append('text')
      .attr('x', startX - 20)
      .attr('y', startY + cellHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .text('[');

    svg.append('text')
      .attr('x', startX + array.length * (cellWidth + 10) - 10 + 20)
      .attr('y', startY + cellHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .text(']');
  };

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
    setLastOperation({
      type: 'insert',
      index,
      value,
      description: `Inserted ${value} at index ${index}`
    });

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
    setHighlightedIndex(index >= newArray.length ? newArray.length - 1 : index);
    setLastOperation({
      type: 'delete',
      index,
      value: deletedValue,
      description: `Deleted ${deletedValue} from index ${index}`
    });

    setTimeout(() => setHighlightedIndex(null), 2000);
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
      setLastOperation({
        type: 'search',
        index,
        value,
        description: `Found ${value} at index ${index}`
      });
    } else {
      setLastOperation({
        type: 'search',
        index: -1,
        value,
        description: `${value} not found in array`
      });
    }

    setTimeout(() => setHighlightedIndex(null), 3000);
    setSearchValue('');
  };

  const handleReset = () => {
    setArray(initialArray);
    setHighlightedIndex(null);
    setLastOperation(null);
    setInsertValue('');
    setInsertIndex('');
    setSearchValue('');
    setDeleteIndex('');
  };

  const getComplexity = (operation: string) => {
    switch (operation) {
      case 'insert':
      case 'delete':
        return 'O(n)';
      case 'search':
        return 'O(n)';
      case 'access':
        return 'O(1)';
      default:
        return '';
    }
  };

  return (
    <Container>
      <VisualizationArea $width={width} $height={height}>
        <SVGContainer ref={svgRef} />
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
            <OperationText>{lastOperation.description}</OperationText>
            <ComplexityInfo>
              <span><strong>Time Complexity:</strong> {getComplexity(lastOperation.type)}</span>
              <span><strong>Space Complexity:</strong> O(1)</span>
            </ComplexityInfo>
          </OperationInfo>
        )}
      </ControlPanel>
    </Container>
  );
};
