import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, Search, RotateCcw, ArrowRight } from 'lucide-react';

interface Node {
  value: number;
  id: string;
}

interface SimpleLinkedListVisualizationProps {
  initialValues?: number[];
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
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow-x: auto;
`;

const NodeContainer = styled(motion.div)<{ $highlighted: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const NodeElement = styled.div<{ $highlighted: boolean }>`
  display: flex;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 2px solid ${({ $highlighted, theme }) => 
    $highlighted ? theme.colors.primary : theme.colors.border};
`;

const DataPart = styled.div<{ $highlighted: boolean }>`
  width: 60px;
  height: 50px;
  background-color: ${({ $highlighted, theme }) => 
    $highlighted ? theme.colors.primary : theme.colors.surface};
  color: ${({ $highlighted, theme }) => 
    $highlighted ? 'white' : theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const PointerPart = styled.div<{ $highlighted: boolean }>`
  width: 30px;
  height: 50px;
  background-color: ${({ $highlighted, theme }) => 
    $highlighted ? theme.colors.secondary : theme.colors.backgroundTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $highlighted, theme }) => 
    $highlighted ? 'white' : theme.colors.textMuted};
`;

const Arrow = styled(ArrowRight)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const NullIndicator = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const HeadPointer = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
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

const EmptyState = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  position: relative;
`;

export const SimpleLinkedListVisualization: React.FC<SimpleLinkedListVisualizationProps> = ({
  initialValues = [10, 20, 30, 40],
}) => {
  const [nodes, setNodes] = useState<Node[]>(
    initialValues.map((value, index) => ({ value, id: `node-${index}` }))
  );
  const [insertValue, setInsertValue] = useState<string>('');
  const [insertPosition, setInsertPosition] = useState<string>('');
  const [deleteValue, setDeleteValue] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [lastOperation, setLastOperation] = useState<string>('');
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

  const handleInsert = () => {
    const value = parseInt(insertValue);
    const position = parseInt(insertPosition);
    
    if (isNaN(value) || isNaN(position) || position < 0 || position > nodes.length) {
      alert('Please enter valid value and position');
      return;
    }

    const newNode: Node = {
      value,
      id: `node-${Date.now()}`
    };

    const newNodes = [...nodes];
    newNodes.splice(position, 0, newNode);
    setNodes(newNodes);
    setHighlightedNodeId(newNode.id);
    setLastOperation(`Inserted ${value} at position ${position} - Time: O(n), Space: O(1)`);

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

    const index = nodes.findIndex(node => node.value === value);
    if (index !== -1) {
      const deletedNode = nodes[index];
      setHighlightedNodeId(deletedNode.id);
      setLastOperation(`Deleted ${value} from the list - Time: O(n), Space: O(1)`);
      
      setTimeout(() => {
        const newNodes = nodes.filter(node => node.id !== deletedNode.id);
        setNodes(newNodes);
        setHighlightedNodeId(null);
      }, 1000);
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

    const foundNode = nodes.find(node => node.value === value);
    if (foundNode) {
      setHighlightedNodeId(foundNode.id);
      setLastOperation(`Found ${value} in the list - Time: O(n), Space: O(1)`);
    } else {
      setLastOperation(`${value} not found in the list - Time: O(n), Space: O(1)`);
    }
    
    setTimeout(() => setHighlightedNodeId(null), 3000);
    setSearchValue('');
  };

  const handleReset = () => {
    setNodes(initialValues.map((value, index) => ({ value, id: `node-${index}` })));
    setHighlightedNodeId(null);
    setLastOperation('');
    setInsertValue('');
    setInsertPosition('');
    setDeleteValue('');
    setSearchValue('');
  };

  return (
    <Container>
      <VisualizationArea>
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
