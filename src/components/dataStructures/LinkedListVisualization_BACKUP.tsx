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
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const VisualizationArea = styled.div<{ $width: number; $height: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.surface};
  position: relative;
  overflow: hidden;
`;

const SVGContainer = styled.svg`
  width: 100%;
  height: 100%;
`;

const ControlPanel = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ControlRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  width: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  min-width: 60px;
`;

const OperationInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primary}10;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const OperationText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export function LinkedListVisualization({
  initialValues = [10, 20, 30, 40],
  width = 900,
  height = 250,
}: LinkedListVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [head, setHead] = useState<Node | null>(null);
  const [insertValue, setInsertValue] = useState<string>('');
  const [insertPosition, setInsertPosition] = useState<string>('');
  const [deleteValue, setDeleteValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  // Create initial linked list
  const createInitialList = () => {
    if (initialValues.length === 0) {
      setHead(null);
      return;
    }

    const nodes: Node[] = initialValues.map((value, index) => ({
      value,
      next: null,
      id: `node-${index}`,
    }));

    // Link the nodes
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].next = nodes[i + 1];
    }

    setHead(nodes[0]);
  };

  // Initialize the list on component mount
  useEffect(() => {
    createInitialList();
  }, []);

  // D3.js visualization
  useEffect(() => {
    if (!svgRef.current || !head) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const nodeWidth = 80;
    const nodeHeight = 40;
    const nodeSpacing = 120;
    const startX = 50;
    const startY = height / 2;

    // Create nodes array for visualization
    const nodes: Array<{ node: Node; x: number; y: number }> = [];
    let current = head;
    let index = 0;

    while (current) {
      nodes.push({
        node: current,
        x: startX + index * nodeSpacing,
        y: startY,
      });
      current = current.next;
      index++;
    }

    // Draw connections (arrows)
    const connections = svg.selectAll('.connection')
      .data(nodes.slice(0, -1))
      .enter()
      .append('line')
      .attr('class', 'connection')
      .attr('x1', d => d.x + nodeWidth)
      .attr('y1', d => d.y)
      .attr('x2', d => d.x + nodeSpacing - 10)
      .attr('y2', d => d.y)
      .attr('stroke', '#6366f1')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

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
      .attr('fill', '#6366f1');

    // Draw nodes
    const nodeGroups = svg.selectAll('.node-group')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node-group')
      .attr('transform', d => `translate(${d.x}, ${d.y - nodeHeight/2})`);

    // Node rectangles
    nodeGroups.append('rect')
      .attr('width', nodeWidth)
      .attr('height', nodeHeight)
      .attr('rx', 8)
      .attr('fill', d => d.node.id === highlightedNodeId ? '#10b981' : '#f8fafc')
      .attr('stroke', d => d.node.id === highlightedNodeId ? '#059669' : '#e2e8f0')
      .attr('stroke-width', 2);

    // Node text
    nodeGroups.append('text')
      .attr('x', nodeWidth / 2)
      .attr('y', nodeHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#1e293b')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .text(d => d.node.value);

  }, [head, highlightedNodeId, height]);

  // Helper functions
  const insertAtPosition = (value: number, position: number) => {
    const newNode: Node = {
      value,
      next: null,
      id: `node-${Date.now()}`,
    };

    if (position === 0 || !head) {
      newNode.next = head;
      setHead(newNode);
      return;
    }

    let current = head;
    for (let i = 0; i < position - 1 && current.next; i++) {
      current = current.next;
    }

    newNode.next = current.next;
    current.next = newNode;
  };

  const deleteByValue = (value: number): boolean => {
    if (!head) return false;

    if (head.value === value) {
      setHead(head.next);
      return true;
    }

    let current = head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      return true;
    }

    return false;
  };

  const searchValue = (value: number): boolean => {
    let current = head;
    while (current) {
      if (current.value === value) {
        setHighlightedNodeId(current.id);
        return true;
      }
      current = current.next;
    }
    return false;
  };

  // Event handlers
  const handleInsert = () => {
    const value = parseInt(insertValue);
    const position = insertPosition ? parseInt(insertPosition) : 0;

    if (isNaN(value)) {
      alert('Please enter a valid value to insert');
      return;
    }

    insertAtPosition(value, Math.max(0, position));
    setLastOperation(`Inserted ${value} at position ${position}`);
    setInsertValue('');
    setInsertPosition('');
  };

  const handleDelete = () => {
    const value = parseInt(deleteValue);

    if (isNaN(value)) {
      alert('Please enter a valid value to delete');
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
}
