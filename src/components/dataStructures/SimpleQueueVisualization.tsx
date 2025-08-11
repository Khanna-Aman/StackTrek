import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

interface SimpleQueueVisualizationProps {
  initialQueue?: number[];
  maxSize?: number;
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
  padding: ${({ theme }) => theme.spacing[6]};
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow-x: auto;
`;

const QueueElement = styled(motion.div)<{ $isFront: boolean; $isRear: boolean }>`
  width: 80px;
  height: 60px;
  background-color: ${({ $isFront, $isRear, theme }) => 
    $isFront ? theme.colors.success : $isRear ? theme.colors.error : theme.colors.surface};
  color: ${({ $isFront, $isRear, theme }) => 
    ($isFront || $isRear) ? 'white' : theme.colors.text};
  border: 2px solid ${({ $isFront, $isRear, theme }) => 
    $isFront ? theme.colors.success : $isRear ? theme.colors.error : theme.colors.border};
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

const PositionLabel = styled.div<{ $color: string }>`
  position: absolute;
  top: -30px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ $color }) => $color};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
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
  width: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }
`;

const QueueInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
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
`;

export const SimpleQueueVisualization: React.FC<SimpleQueueVisualizationProps> = ({
  initialQueue = [10, 20, 30],
  maxSize = 8,
}) => {
  const [queue, setQueue] = useState<number[]>(initialQueue);
  const [enqueueValue, setEnqueueValue] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<string>('');

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

    setQueue([...queue, value]);
    setLastOperation(`Enqueued ${value} to the rear of the queue - Time: O(1), Space: O(1)`);
    setEnqueueValue('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      alert('Queue underflow! Queue is empty.');
      return;
    }

    const dequeuedValue = queue[0];
    setQueue(queue.slice(1));
    setLastOperation(`Dequeued ${dequeuedValue} from the front of the queue - Time: O(1), Space: O(1)`);
  };

  const handlePeekFront = () => {
    if (queue.length === 0) {
      setLastOperation('Queue is empty - nothing to peek');
      return;
    }

    const frontValue = queue[0];
    setLastOperation(`Front element is ${frontValue} - Time: O(1), Space: O(1)`);
  };

  const handlePeekRear = () => {
    if (queue.length === 0) {
      setLastOperation('Queue is empty - nothing to peek');
      return;
    }

    const rearValue = queue[queue.length - 1];
    setLastOperation(`Rear element is ${rearValue} - Time: O(1), Space: O(1)`);
  };

  const handleReset = () => {
    setQueue(initialQueue);
    setLastOperation('');
    setEnqueueValue('');
  };

  const isEmpty = queue.length === 0;
  const isFull = queue.length >= maxSize;

  return (
    <Container>
      <VisualizationArea>
        {queue.length === 0 ? (
          <EmptyState>Empty Queue</EmptyState>
        ) : (
          <AnimatePresence>
            {queue.map((value, index) => (
              <QueueElement
                key={`${value}-${index}`}
                $isFront={index === 0}
                $isRear={index === queue.length - 1}
                initial={{ scale: 0, x: 20 }}
                animate={{ scale: 1, x: 0 }}
                exit={{ scale: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {value}
                {index === 0 && <PositionLabel $color="#10b981">FRONT</PositionLabel>}
                {index === queue.length - 1 && <PositionLabel $color="#ef4444">REAR</PositionLabel>}
                <IndexLabel>{index}</IndexLabel>
              </QueueElement>
            ))}
          </AnimatePresence>
        )}
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
        </ControlRow>

        <ControlRow>
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
