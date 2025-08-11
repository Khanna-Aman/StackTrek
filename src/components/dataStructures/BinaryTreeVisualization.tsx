import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, RotateCcw, Search } from 'lucide-react';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
  id: string;
}

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

const TreeContainer = styled.div`
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: auto;
`;

const TreeNodeElement = styled(motion.div) <{ $highlighted?: boolean; $found?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: ${({ theme, $highlighted, $found }) =>
    $found ? '#10b981' : $highlighted ? theme.colors.primary :
      `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.secondaryLight})`};
  color: ${({ $highlighted, $found }) => ($highlighted || $found) ? 'white' : 'inherit'};
  border: 2px solid ${({ theme, $highlighted, $found }) =>
    $found ? '#059669' : $highlighted ? theme.colors.primaryHover : theme.colors.border};
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

const TreeLevel = styled.div`
  display: flex;
  justify-content: center;
  gap: 60px;
  margin-bottom: 60px;
  position: relative;
`;

const TreeStructure = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ConnectionLine = styled.div<{ $direction: 'left' | 'right' }>`
  position: absolute;
  top: 25px;
  width: 30px;
  height: 2px;
  background-color: ${({ theme }) => theme.colors.border};
  transform-origin: ${({ $direction }) => $direction === 'left' ? 'right' : 'left'};
  transform: ${({ $direction }) =>
    $direction === 'left' ? 'rotate(-45deg)' : 'rotate(45deg)'};
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

export const BinaryTreeVisualization: React.FC = () => {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [foundNode, setFoundNode] = useState<string | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const insertNode = useCallback((root: TreeNode | null, value: number): TreeNode => {
    if (!root) {
      return { value, id: generateId() };
    }

    if (value < root.value) {
      root.left = insertNode(root.left || null, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right || null, value);
    }

    return root;
  }, []);

  const deleteNode = useCallback((root: TreeNode | null, value: number): TreeNode | null => {
    if (!root) return null;

    if (value < root.value) {
      root.left = deleteNode(root.left || null, value);
    } else if (value > root.value) {
      root.right = deleteNode(root.right || null, value);
    } else {
      // Node to be deleted found
      if (!root.left) return root.right || null;
      if (!root.right) return root.left || null;

      // Node with two children
      let minNode = root.right;
      while (minNode.left) {
        minNode = minNode.left;
      }
      root.value = minNode.value;
      root.right = deleteNode(root.right, minNode.value);
    }

    return root;
  }, []);

  const searchNode = useCallback((root: TreeNode | null, value: number): TreeNode | null => {
    if (!root || root.value === value) return root;
    if (value < root.value) return searchNode(root.left || null, value);
    return searchNode(root.right || null, value);
  }, []);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setTree(prev => insertNode(prev, value));
      setInputValue('');
    }
  };

  const handleDelete = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setTree(prev => deleteNode(prev, value));
      setInputValue('');
    }
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value)) {
      const found = searchNode(tree, value);
      setFoundNode(found ? found.id : null);
      setTimeout(() => setFoundNode(null), 2000);
    }
  };

  const handleClear = () => {
    setTree(null);
    setInputValue('');
    setSearchValue('');
    setHighlightedNode(null);
    setFoundNode(null);
  };

  const renderTree = (node: TreeNode | null, level: number = 0): React.ReactNode => {
    if (!node) return null;

    return (
      <TreeLevel key={`${node.id}-${level}`}>
        <TreeNodeElement
          $highlighted={highlightedNode === node.id}
          $found={foundNode === node.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onMouseEnter={() => setHighlightedNode(node.id)}
          onMouseLeave={() => setHighlightedNode(null)}
        >
          {node.value}
          {node.left && <ConnectionLine $direction="left" />}
          {node.right && <ConnectionLine $direction="right" />}
        </TreeNodeElement>
        {(node.left || node.right) && (
          <div style={{ display: 'flex', gap: '120px', marginTop: '40px' }}>
            {node.left ? renderTree(node.left, level + 1) : <div style={{ width: '50px' }} />}
            {node.right ? renderTree(node.right, level + 1) : <div style={{ width: '50px' }} />}
          </div>
        )}
      </TreeLevel>
    );
  };

  return (
    <Container>
      <ControlsSection>
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
          <Button size="sm" variant="outline" onClick={handleDelete}>
            <Minus size={16} />
            Delete
          </Button>
        </InputGroup>

        <InputGroup>
          <Input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button size="sm" variant="outline" onClick={handleSearch}>
            <Search size={16} />
            Search
          </Button>
        </InputGroup>

        <Button size="sm" variant="outline" onClick={handleClear}>
          <RotateCcw size={16} />
          Clear
        </Button>
      </ControlsSection>

      <TreeContainer>
        <AnimatePresence>
          {tree ? (
            <TreeStructure>
              {renderTree(tree)}
            </TreeStructure>
          ) : (
            <EmptyState>
              <div>🌳</div>
              <div>Empty Binary Search Tree</div>
              <div>Add some numbers to get started!</div>
            </EmptyState>
          )}
        </AnimatePresence>
      </TreeContainer>

      <InfoPanel>
        <strong>Binary Search Tree:</strong> A tree data structure where each node has at most two children.
        For each node, all values in the left subtree are smaller, and all values in the right subtree are larger.
        <br />
        <strong>Operations:</strong> Insert O(log n), Delete O(log n), Search O(log n) average case.
      </InfoPanel>
    </Container>
  );
};
