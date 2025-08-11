import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, Search, RotateCcw, ArrowRight } from 'lucide-react';

interface Node {
  value: number;
  next: Node | null;
  id: string;
}

interface LinkedListVisualizationProps {
  initialValues?: number[];
  width?: number;
  height?: number;
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
  overflow-x: auto;
  overflow-y: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SVGContainer = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
  min-width: 600px;
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
  min-width: 80px;
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

export const LinkedListVisualization: React.FC<LinkedListVisualizationProps> = ({
  initialValues = [10, 20, 30, 40],
  width = 900,
  height = 250,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [head, setHead] = useState<Node | null>(null);
  const [insertValue, setInsertValue] = useState<string>('');
  const [insertPosition, setInsertPosition] = useState<string>('');
  const [deleteValue, setDeleteValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  const nodeWidth = 80;
  const nodeHeight = 50;
  const nodeSpacing = 120;
  const startX = 50;
  const startY = height / 2 - nodeHeight / 2;

  // Initialize linked list
  useEffect(() => {
    createInitialList();
  }, []);

  useEffect(() => {
    renderLinkedList();
  }, [head, highlightedNodeId]);

  const createInitialList = () => {
    let newHead: Node | null = null;
    let current: Node | null = null;

    initialValues.forEach((value, index) => {
      const newNode: Node = {
        value,
        next: null,
        id: `node-${index}-${Date.now()}`
      };

      if (!newHead) {
        newHead = newNode;
        current = newNode;
      } else if (current) {
        current.next = newNode;
        current = newNode;
      }
    });

    setHead(newHead);
  };

  const renderLinkedList = () => {
    // Rendering will be done in JSX below
  };

  // Convert linked list to array for rendering
  const nodes: Node[] = [];
  let current = head;
  while (current) {
    nodes.push(current);
    current = current.next;
  }

  // Create node groups
  const nodeGroups = svg.selectAll('.node-group')
    .data(nodes)
    .enter()
    .append('g')
    .attr('class', 'node-group')
    .attr('transform', (d, i) => `translate(${startX + i * nodeSpacing}, ${startY})`);

  // Node rectangles (data part)
  nodeGroups.append('rect')
    .attr('class', 'node-data')
    .attr('width', nodeWidth * 0.6)
    .attr('height', nodeHeight)
    .attr('rx', 8)
    .attr('fill', d => highlightedNodeId === d.id ? '#6366f1' : '#f8fafc')
    .attr('stroke', d => highlightedNodeId === d.id ? '#4f46e5' : '#e2e8f0')
    .attr('stroke-width', 2);

  // Node rectangles (pointer part)
  nodeGroups.append('rect')
    .attr('class', 'node-pointer')
    .attr('x', nodeWidth * 0.6)
    .attr('width', nodeWidth * 0.4)
    .attr('height', nodeHeight)
    .attr('rx', 8)
    .attr('fill', d => highlightedNodeId === d.id ? '#8b5cf6' : '#f1f5f9')
    .attr('stroke', d => highlightedNodeId === d.id ? '#7c3aed' : '#e2e8f0')
    .attr('stroke-width', 2);

  // Node values
  nodeGroups.append('text')
    .attr('x', nodeWidth * 0.3)
    .attr('y', nodeHeight / 2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', d => highlightedNodeId === d.id ? 'white' : '#1e293b')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text(d => d.value);

  // Pointer arrows
  nodeGroups.each(function (d, i) {
    if (d.next) {
      const group = d3.select(this);

      // Arrow line
      group.append('line')
        .attr('x1', nodeWidth + 10)
        .attr('y1', nodeHeight / 2)
        .attr('x2', nodeSpacing - 10)
        .attr('y2', nodeHeight / 2)
        .attr('stroke', highlightedNodeId === d.id ? '#6366f1' : '#64748b')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
    } else {
      // NULL pointer
      const group = d3.select(this);
      group.append('text')
        .attr('x', nodeWidth * 0.8)
        .attr('y', nodeHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#ef4444')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .text('NULL');
    }
  });

  // Define arrow marker
  svg.append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 8)
    .attr('refY', 0)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#64748b');

  // Head pointer
  svg.append('text')
    .attr('x', startX - 30)
    .attr('y', startY - 20)
    .attr('text-anchor', 'middle')
    .attr('fill', '#6366f1')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold')
    .text('HEAD');

  svg.append('line')
    .attr('x1', startX - 30)
    .attr('y1', startY - 10)
    .attr('x2', startX - 10)
    .attr('y2', startY + 10)
    .attr('stroke', '#6366f1')
    .attr('stroke-width', 2)
    .attr('marker-end', 'url(#arrowhead)');
};

const insertAtPosition = (value: number, position: number) => {
  const newNode: Node = {
    value,
    next: null,
    id: `node-${Date.now()}`
  };

  if (position === 0) {
    newNode.next = head;
    setHead(newNode);
    setHighlightedNodeId(newNode.id);
    return;
  }

  let current = head;
  for (let i = 0; i < position - 1 && current; i++) {
    current = current.next;
  }

  if (current) {
    newNode.next = current.next;
    current.next = newNode;
    setHighlightedNodeId(newNode.id);
  }
};

const deleteByValue = (value: number) => {
  if (!head) return false;

  if (head.value === value) {
    const deletedId = head.id;
    setHead(head.next);
    setHighlightedNodeId(deletedId);
    return true;
  }

  let current = head;
  while (current.next && current.next.value !== value) {
    current = current.next;
  }

  if (current.next) {
    const deletedId = current.next.id;
    current.next = current.next.next;
    setHighlightedNodeId(deletedId);
    return true;
  }

  return false;
};

const searchValue = (value: number): Node | null => {
  let current = head;
  while (current) {
    if (current.value === value) {
      setHighlightedNodeId(current.id);
      return current;
    }
    current = current.next;
  }
  return null;
};

const handleInsert = () => {
  const value = parseInt(insertValue);
  const position = parseInt(insertPosition);

  if (isNaN(value) || isNaN(position) || position < 0) {
    alert('Please enter valid value and position');
    return;
  }

  insertAtPosition(value, position);
  setLastOperation(`Inserted ${value} at position ${position}`);
  setTimeout(() => setHighlightedNodeId(null), 2000);
  setInsertValue('');
  setInsertPosition('');
};

const handleDelete = () => {
  const value = parseInt(deleteValue);

  if (isNaN(value)) {
    alert('Please enter a valid value');
    return;
  }

  const deleted = deleteByValue(value);
  if (deleted) {
    setLastOperation(`Deleted ${value} from the list`);
    setTimeout(() => setHighlightedNodeId(null), 2000);
  } else {
    setLastOperation(`${value} not found in the list`);
  }
  setDeleteValue('');
};

const handleSearch = () => {
  const value = parseInt(searchValue);

  if (isNaN(value)) {
    alert('Please enter a valid value to search');
    return;
  }

  const found = searchValue(value);
  if (found) {
    setLastOperation(`Found ${value} in the list`);
  } else {
    setLastOperation(`${value} not found in the list`);
  }
  setTimeout(() => setHighlightedNodeId(null), 3000);
  setSearchValue('');
};

const handleReset = () => {
  createInitialList();
  setHighlightedNodeId(null);
  setLastOperation('');
  setInsertValue('');
  setInsertPosition('');
  setDeleteValue('');
  setSearchValue('');
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
          placeholder="Position"
          value={insertPosition}
          onChange={(e) => setInsertPosition(e.target.value)}
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
          placeholder="Value"
          value={deleteValue}
          onChange={(e) => setDeleteValue(e.target.value)}
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
