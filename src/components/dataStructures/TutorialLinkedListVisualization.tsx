import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, Search, RotateCcw } from 'lucide-react';
import { EnhancedTutorialSystem } from '@/components/tutorial/EnhancedTutorialSystem';
import { linkedListTutorial } from '@/data/tutorials/linkedListTutorial';

interface Node {
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
  padding: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const ListContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  min-height: 80px;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const NodeContainer = styled(motion.div) <{ $highlighted: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NodeElement = styled.div<{ $highlighted: boolean }>`
  display: flex;
  background: ${({ $highlighted, theme }) =>
    $highlighted ? theme.colors.primary : theme.colors.surface};
  border: 2px solid ${({ $highlighted, theme }) =>
    $highlighted ? theme.colors.primaryDark : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all 0.3s ease;
`;

const DataPart = styled.div<{ $highlighted: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ $highlighted, theme }) =>
    $highlighted ? theme.colors.white : theme.colors.text};
  min-width: 60px;
  text-align: center;
`;

const PointerPart = styled.div<{ $highlighted: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ $highlighted, theme }) =>
    $highlighted ? theme.colors.primaryDark : theme.colors.muted};
  color: ${({ $highlighted, theme }) =>
    $highlighted ? theme.colors.white : theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  min-width: 40px;
  text-align: center;
`;

const Arrow = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const NullIndicator = styled.div`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.danger};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const HeadPointer = styled.div`
  position: absolute;
  top: -30px;
  left: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Controls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const InputGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  width: 80px;
  text-align: center;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StatusMessage = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.info};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const EmptyState = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  position: relative;
`;

export const TutorialLinkedListVisualization: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { value: 10, id: 'node-0' },
    { value: 20, id: 'node-1' },
    { value: 30, id: 'node-2' },
    { value: 40, id: 'node-3' }
  ]);
  const [insertValue, setInsertValue] = useState<string>('');
  const [insertPosition, setInsertPosition] = useState<string>('');
  const [deleteValue, setDeleteValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  const insertAtHead = () => {
    const value = parseInt(insertValue);
    if (isNaN(value)) return;

    const newNode: Node = {
      value,
      id: `node-${Date.now()}`
    };

    setNodes(prev => [newNode, ...prev]);
    setLastOperation(`Inserted ${value} at head`);
    setInsertValue('');

    // Highlight the new node
    setHighlightedNodeId(newNode.id);
    setTimeout(() => setHighlightedNodeId(null), 2000);
  };

  const insertAtTail = () => {
    const value = parseInt(insertValue);
    if (isNaN(value)) return;

    const newNode: Node = {
      value,
      id: `node-${Date.now()}`
    };

    setNodes(prev => [...prev, newNode]);
    setLastOperation(`Inserted ${value} at tail`);
    setInsertValue('');

    // Highlight the new node
    setHighlightedNodeId(newNode.id);
    setTimeout(() => setHighlightedNodeId(null), 2000);
  };

  const insertAtPosition = () => {
    const value = parseInt(insertValue);
    const position = parseInt(insertPosition);
    if (isNaN(value) || isNaN(position) || position < 0) return;

    const newNode: Node = {
      value,
      id: `node-${Date.now()}`
    };

    setNodes(prev => {
      const newNodes = [...prev];
      const insertIndex = Math.min(position, newNodes.length);
      newNodes.splice(insertIndex, 0, newNode);
      return newNodes;
    });

    setLastOperation(`Inserted ${value} at position ${position}`);
    setInsertValue('');
    setInsertPosition('');

    // Highlight the new node
    setHighlightedNodeId(newNode.id);
    setTimeout(() => setHighlightedNodeId(null), 2000);
  };

  const deleteByValue = () => {
    const value = parseInt(deleteValue);
    if (isNaN(value)) return;

    const nodeIndex = nodes.findIndex(node => node.value === value);
    if (nodeIndex === -1) {
      setLastOperation(`Value ${value} not found`);
      return;
    }

    setNodes(prev => prev.filter(node => node.value !== value));
    setLastOperation(`Deleted ${value} from list`);
    setDeleteValue('');
  };

  const searchForValue = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;

    const nodeIndex = nodes.findIndex(node => node.value === value);
    if (nodeIndex === -1) {
      setLastOperation(`Value ${value} not found`);
      setHighlightedNodeId(null);
    } else {
      const foundNode = nodes[nodeIndex];
      setLastOperation(`Found ${value} at position ${nodeIndex}`);
      setHighlightedNodeId(foundNode.id);
      setTimeout(() => setHighlightedNodeId(null), 3000);
    }
    setSearchValue('');
  };

  const resetList = () => {
    setNodes([
      { value: 10, id: 'node-0' },
      { value: 20, id: 'node-1' },
      { value: 30, id: 'node-2' },
      { value: 40, id: 'node-3' }
    ]);
    setLastOperation('List reset to initial state');
    setHighlightedNodeId(null);
  };

  const visualizationComponent = (
    <Container>
      <VisualizationArea>
        <ListContainer>
          {nodes.length === 0 ? (
            <EmptyState>
              Empty Linked List
              <HeadPointer>HEAD → NULL</HeadPointer>
            </EmptyState>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
              {nodes.length > 0 && (
                <HeadPointer>HEAD</HeadPointer>
              )}
              <AnimatePresence>
                {nodes.map((node, index) => (
                  <NodeContainer
                    key={node.id}
                    $highlighted={highlightedNodeId === node.id}
                    initial={{ scale: 0, x: -20 }}
                    animate={{ scale: 1, x: 0 }}
                    exit={{ scale: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NodeElement $highlighted={highlightedNodeId === node.id}>
                      <DataPart $highlighted={highlightedNodeId === node.id}>
                        {node.value}
                      </DataPart>
                      <PointerPart $highlighted={highlightedNodeId === node.id}>
                        →
                      </PointerPart>
                    </NodeElement>
                    {index < nodes.length - 1 && <Arrow />}
                    {index === nodes.length - 1 && <NullIndicator>NULL</NullIndicator>}
                  </NodeContainer>
                ))}
              </AnimatePresence>
            </div>
          )}
        </ListContainer>

        <Controls>
          <InputGroup>
            <Input
              type="number"
              placeholder="Value"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
            />
            <Button size="sm" onClick={insertAtHead}>
              <Plus size={14} />
              Add Head
            </Button>
            <Button size="sm" onClick={insertAtTail}>
              <Plus size={14} />
              Add Tail
            </Button>
          </InputGroup>

          <InputGroup>
            <Input
              type="number"
              placeholder="Position"
              value={insertPosition}
              onChange={(e) => setInsertPosition(e.target.value)}
            />
            <Button size="sm" onClick={insertAtPosition}>
              <Plus size={14} />
              Insert At
            </Button>
          </InputGroup>

          <InputGroup>
            <Input
              type="number"
              placeholder="Delete"
              value={deleteValue}
              onChange={(e) => setDeleteValue(e.target.value)}
            />
            <Button size="sm" variant="outline" onClick={deleteByValue}>
              <Minus size={14} />
              Delete
            </Button>
          </InputGroup>

          <InputGroup>
            <Input
              type="number"
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Button size="sm" variant="outline" onClick={searchForValue}>
              <Search size={14} />
              Find
            </Button>
          </InputGroup>

          <Button size="sm" variant="outline" onClick={resetList}>
            <RotateCcw size={14} />
            Reset
          </Button>
        </Controls>

        {lastOperation && (
          <StatusMessage>
            {lastOperation}
          </StatusMessage>
        )}
      </VisualizationArea>
    </Container>
  );

  return (
    <EnhancedTutorialSystem
      title={linkedListTutorial.title}
      description={linkedListTutorial.description}
      steps={linkedListTutorial.steps}
    >
      {visualizationComponent}
    </EnhancedTutorialSystem>
  );
};
