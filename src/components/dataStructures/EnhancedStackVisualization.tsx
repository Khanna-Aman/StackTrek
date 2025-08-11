import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { ArrowUp, ArrowDown, RotateCcw } from 'lucide-react';

interface EnhancedStackVisualizationProps {
  initialStack?: number[];
  maxSize?: number;
  width?: number;
  height?: number;
}

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  align-items: flex-start;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
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

export const EnhancedStackVisualization: React.FC<EnhancedStackVisualizationProps> = ({
  initialStack = [10, 20, 30],
  maxSize = 8,
  width = 400,
  height = 500,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [stack, setStack] = useState<number[]>(initialStack);
  const [pushValue, setPushValue] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const cellWidth = 120;
  const cellHeight = 50;
  const stackX = width / 2 - cellWidth / 2;
  const stackBottomY = height - 100;

  useEffect(() => {
    renderStack();
  }, [stack, animatingIndex]);

  const renderStack = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Draw stack base with gradient
    const defs = svg.append('defs');

    const gradient = defs.append('linearGradient')
      .attr('id', 'stackGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#6366f1')
      .attr('stop-opacity', 0.8);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8b5cf6')
      .attr('stop-opacity', 0.8);

    // Stack base
    svg.append('rect')
      .attr('x', stackX - 10)
      .attr('y', stackBottomY)
      .attr('width', cellWidth + 20)
      .attr('height', 10)
      .attr('fill', '#64748b')
      .attr('rx', 5);

    // Stack walls
    svg.append('rect')
      .attr('x', stackX - 10)
      .attr('y', stackBottomY - maxSize * cellHeight)
      .attr('width', 10)
      .attr('height', maxSize * cellHeight)
      .attr('fill', '#94a3b8')
      .attr('opacity', 0.7);

    svg.append('rect')
      .attr('x', stackX + cellWidth)
      .attr('y', stackBottomY - maxSize * cellHeight)
      .attr('width', 10)
      .attr('height', maxSize * cellHeight)
      .attr('fill', '#94a3b8')
      .attr('opacity', 0.7);

    // Draw stack elements with D3 transitions
    const elements = svg.selectAll('.stack-element')
      .data(stack)
      .enter()
      .append('g')
      .attr('class', 'stack-element')
      .attr('transform', (d, i) => `translate(${stackX}, ${stackBottomY - (i + 1) * cellHeight})`);

    // Element rectangles with smooth animations
    elements.append('rect')
      .attr('width', cellWidth)
      .attr('height', cellHeight - 2)
      .attr('fill', (d, i) => animatingIndex === i ? 'url(#stackGradient)' : '#f8fafc')
      .attr('stroke', (d, i) => animatingIndex === i ? '#4f46e5' : '#e2e8f0')
      .attr('stroke-width', 2)
      .attr('rx', 8)
      .style('filter', (d, i) => animatingIndex === i ? 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.4))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))')
      .transition()
      .duration(300)
      .ease(d3.easeBackOut);

    // Element values
    elements.append('text')
      .attr('x', cellWidth / 2)
      .attr('y', cellHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', (d, i) => animatingIndex === i ? 'white' : '#1e293b')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text(d => d);

    // Index labels
    elements.append('text')
      .attr('x', -25)
      .attr('y', cellHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', '12px')
      .text((d, i) => i);

    // TOP pointer with animation
    if (stack.length > 0) {
      const topY = stackBottomY - stack.length * cellHeight;

      const topPointer = svg.append('g')
        .attr('class', 'top-pointer');

      topPointer.append('text')
        .attr('x', stackX + cellWidth + 30)
        .attr('y', topY + cellHeight / 2)
        .attr('text-anchor', 'start')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#ef4444')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text('← TOP')
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);

      // Animated arrow
      topPointer.append('line')
        .attr('x1', stackX + cellWidth + 25)
        .attr('y1', topY + cellHeight / 2)
        .attr('x2', stackX + cellWidth + 5)
        .attr('y2', topY + cellHeight / 2)
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead-red)')
        .style('opacity', 0)
        .transition()
        .duration(500)
        .style('opacity', 1);
    }

    // Define arrow markers
    defs.append('marker')
      .attr('id', 'arrowhead-red')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#ef4444');

    // Stack title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 50)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Stack (LIFO - Last In, First Out)');
  };

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

    const newStack = [...stack, value];
    setStack(newStack);
    setAnimatingIndex(newStack.length - 1);
    setLastOperation(`Pushed ${value} onto the stack - Time: O(1), Space: O(1)`);

    setTimeout(() => setAnimatingIndex(null), 1500);
    setPushValue('');
  };

  const handlePop = () => {
    if (stack.length === 0) {
      alert('Stack underflow! Stack is empty.');
      return;
    }

    const poppedValue = stack[stack.length - 1];
    setAnimatingIndex(stack.length - 1);
    setLastOperation(`Popped ${poppedValue} from the stack - Time: O(1), Space: O(1)`);

    setTimeout(() => {
      setStack(stack.slice(0, -1));
      setAnimatingIndex(null);
    }, 1000);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setLastOperation('Stack is empty - nothing to peek');
      return;
    }

    const topValue = stack[stack.length - 1];
    setAnimatingIndex(stack.length - 1);
    setLastOperation(`Top element is ${topValue} - Time: O(1), Space: O(1)`);

    setTimeout(() => setAnimatingIndex(null), 2000);
  };

  const handleReset = () => {
    setStack(initialStack);
    setAnimatingIndex(null);
    setLastOperation('');
    setPushValue('');
  };

  const isEmpty = stack.length === 0;
  const isFull = stack.length >= maxSize;

  return (
    <Container>
      <VisualizationArea $width={width} $height={height}>
        <SVGContainer ref={svgRef} />
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
            onKeyPress={(e) => e.key === 'Enter' && handlePush()}
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
