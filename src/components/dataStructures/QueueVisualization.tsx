import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';

interface QueueVisualizationProps {
  initialQueue?: number[];
  maxSize?: number;
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
  width: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const QueueInfo = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
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
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
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

export const QueueVisualization: React.FC<QueueVisualizationProps> = ({
  initialQueue = [10, 20, 30],
  maxSize = 8,
  width = 800,
  height = 300,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [queue, setQueue] = useState<number[]>(initialQueue);
  const [enqueueValue, setEnqueueValue] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [animationType, setAnimationType] = useState<'enqueue' | 'dequeue' | null>(null);

  const cellWidth = 80;
  const cellHeight = 60;
  const startX = 100;
  const queueY = height / 2 - cellHeight / 2;

  useEffect(() => {
    renderQueue();
  }, [queue, animatingIndex]);

  const renderQueue = () => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Draw queue container
    const containerWidth = maxSize * (cellWidth + 5) - 5;
    svg.append('rect')
      .attr('x', startX - 10)
      .attr('y', queueY - 10)
      .attr('width', containerWidth + 20)
      .attr('height', cellHeight + 20)
      .attr('fill', 'none')
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 2)
      .attr('rx', 10);

    // Draw queue elements
    queue.forEach((value, index) => {
      const x = startX + index * (cellWidth + 5);
      const isAnimating = animatingIndex === index;

      // Element rectangle
      svg.append('rect')
        .attr('x', x)
        .attr('y', queueY)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', isAnimating ? '#6366f1' : '#f8fafc')
        .attr('stroke', isAnimating ? '#4f46e5' : '#e2e8f0')
        .attr('stroke-width', 2)
        .attr('rx', 8)
        .style('filter', isAnimating ? 'drop-shadow(0 4px 8px rgba(99, 102, 241, 0.3))' : 'none');

      // Element value
      svg.append('text')
        .attr('x', x + cellWidth / 2)
        .attr('y', queueY + cellHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', isAnimating ? 'white' : '#1e293b')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .text(value);

      // Index label
      svg.append('text')
        .attr('x', x + cellWidth / 2)
        .attr('y', queueY + cellHeight + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', '12px')
        .text(index);
    });

    // Draw empty slots
    for (let i = queue.length; i < maxSize; i++) {
      const x = startX + i * (cellWidth + 5);

      svg.append('rect')
        .attr('x', x)
        .attr('y', queueY)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', 'none')
        .attr('stroke', '#e2e8f0')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5')
        .attr('rx', 8);

      // Index label for empty slots
      svg.append('text')
        .attr('x', x + cellWidth / 2)
        .attr('y', queueY + cellHeight + 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#cbd5e1')
        .attr('font-size', '12px')
        .text(i);
    }

    // FRONT pointer
    if (queue.length > 0) {
      svg.append('text')
        .attr('x', startX + cellWidth / 2)
        .attr('y', queueY - 25)
        .attr('text-anchor', 'middle')
        .attr('fill', '#10b981')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text('FRONT');

      svg.append('line')
        .attr('x1', startX + cellWidth / 2)
        .attr('y1', queueY - 15)
        .attr('x2', startX + cellWidth / 2)
        .attr('y2', queueY - 5)
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead-green)');
    }

    // REAR pointer
    if (queue.length > 0) {
      const rearX = startX + (queue.length - 1) * (cellWidth + 5) + cellWidth / 2;

      svg.append('text')
        .attr('x', rearX)
        .attr('y', queueY - 25)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ef4444')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .text('REAR');

      svg.append('line')
        .attr('x1', rearX)
        .attr('y1', queueY - 15)
        .attr('x2', rearX)
        .attr('y2', queueY - 5)
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead-red)');
    }

    // Enqueue/Dequeue indicators
    svg.append('text')
      .attr('x', startX - 50)
      .attr('y', queueY + cellHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#ef4444')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('DEQUEUE');

    svg.append('text')
      .attr('x', startX + containerWidth + 50)
      .attr('y', queueY + cellHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#10b981')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('ENQUEUE');

    // Define arrow markers
    const defs = svg.append('defs');

    defs.append('marker')
      .attr('id', 'arrowhead-green')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#10b981');

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

    // Queue title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Queue (FIFO - First In, First Out)');
  };

  const handleEnqueue = () => {
    const value = parseInt(enqueueValue);

    if (isNaN(value)) {
      alert('Please enter a valid number');
      return;
    }

    if (queue.length >= maxSize) {
      alert('Queue overflow! Maximum size reached.');
      return;
    }

    const newQueue = [...queue, value];
    setQueue(newQueue);
    setAnimatingIndex(newQueue.length - 1);
    setAnimationType('enqueue');
    setLastOperation(`Enqueued ${value} to the rear of the queue`);

    setTimeout(() => {
      setAnimatingIndex(null);
      setAnimationType(null);
    }, 1500);
    setEnqueueValue('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      alert('Queue underflow! Queue is empty.');
      return;
    }

    const dequeuedValue = queue[0];
    setAnimatingIndex(0);
    setAnimationType('dequeue');
    setLastOperation(`Dequeued ${dequeuedValue} from the front of the queue`);

    setTimeout(() => {
      setQueue(queue.slice(1));
      setAnimatingIndex(null);
      setAnimationType(null);
    }, 1000);
  };

  const handlePeekFront = () => {
    if (queue.length === 0) {
      setLastOperation('Queue is empty - nothing to peek');
      return;
    }

    const frontValue = queue[0];
    setAnimatingIndex(0);
    setLastOperation(`Front element is ${frontValue}`);

    setTimeout(() => setAnimatingIndex(null), 2000);
  };

  const handlePeekRear = () => {
    if (queue.length === 0) {
      setLastOperation('Queue is empty - nothing to peek');
      return;
    }

    const rearValue = queue[queue.length - 1];
    setAnimatingIndex(queue.length - 1);
    setLastOperation(`Rear element is ${rearValue}`);

    setTimeout(() => setAnimatingIndex(null), 2000);
  };

  const handleReset = () => {
    setQueue(initialQueue);
    setAnimatingIndex(null);
    setAnimationType(null);
    setLastOperation('');
    setEnqueueValue('');
  };

  const isEmpty = queue.length === 0;
  const isFull = queue.length >= maxSize;

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
        <QueueInfo>
          <InfoItem>
            <InfoLabel>Size</InfoLabel>
            <InfoValue>{queue.length}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Capacity</InfoLabel>
            <InfoValue>{maxSize}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Front</InfoLabel>
            <InfoValue>{isEmpty ? 'Empty' : queue[0]}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Rear</InfoLabel>
            <InfoValue>{isEmpty ? 'Empty' : queue[queue.length - 1]}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Status</InfoLabel>
            <InfoValue style={{ color: isEmpty ? '#ef4444' : isFull ? '#f59e0b' : '#10b981' }}>
              {isEmpty ? 'Empty' : isFull ? 'Full' : 'Active'}
            </InfoValue>
          </InfoItem>
        </QueueInfo>

        <ControlRow>
          <Input
            type="number"
            placeholder="Enter value"
            value={enqueueValue}
            onChange={(e) => setEnqueueValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
          />
          <Button size="sm" onClick={handleEnqueue} disabled={isFull}>
            <ArrowRight size={16} />
            Enqueue
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDequeue} disabled={isEmpty}>
            <ArrowLeft size={16} />
            Dequeue
          </Button>
          <Button size="sm" variant="outline" onClick={handlePeekFront} disabled={isEmpty}>
            Peek Front
          </Button>
          <Button size="sm" variant="outline" onClick={handlePeekRear} disabled={isEmpty}>
            Peek Rear
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
