import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, Search, RotateCcw } from 'lucide-react';
import { EnhancedTutorialSystem } from '@/components/tutorial/EnhancedTutorialSystem';
import { binaryTreeTutorial } from '@/data/tutorials/binaryTreeTutorial';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
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
`;

const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const TreeLevel = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  position: relative;
`;

const TreeNodeElement = styled(motion.div)<{ $highlighted?: boolean; $found?: boolean; $isRoot?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: ${({ theme, $highlighted, $found, $isRoot }) => 
    $isRoot ? '#f59e0b' : $found ? '#10b981' : $highlighted ? theme.colors.primary : 
    `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.secondaryLight})`};
  color: ${({ $highlighted, $found, $isRoot }) => ($highlighted || $found || $isRoot) ? 'white' : 'inherit'};
  border: 2px solid ${({ theme, $highlighted, $found, $isRoot }) => 
    $isRoot ? '#d97706' : $found ? '#059669' : $highlighted ? theme.colors.primaryHover : theme.colors.border};
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

const ControlsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  justify-content: center;
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  text-align: center;
`;

const StepIndicator = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const TutorialBinaryTreeVisualization: React.FC = () => {
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [foundNode, setFoundNode] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

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

  const searchNode = useCallback((root: TreeNode | null, value: number): TreeNode | null => {
    if (!root || root.value === value) return root;
    if (value < root.value) return searchNode(root.left || null, value);
    return searchNode(root.right || null, value);
  }, []);

  // Demo operations based on tutorial steps
  useEffect(() => {
    switch (currentStep) {
      case 0: // Introduction
        let demoTree: TreeNode | null = null;
        demoTree = insertNode(demoTree, 50);
        demoTree = insertNode(demoTree, 30);
        demoTree = insertNode(demoTree, 70);
        demoTree = insertNode(demoTree, 20);
        demoTree = insertNode(demoTree, 40);
        setTree(demoTree);
        break;
      case 1: // Structure
        setTree({ value: 50, id: generateId() });
        break;
      case 2: // Insertion
        setTree(null);
        break;
      case 3: // Search
        let searchTree: TreeNode | null = null;
        searchTree = insertNode(searchTree, 50);
        searchTree = insertNode(searchTree, 30);
        searchTree = insertNode(searchTree, 70);
        searchTree = insertNode(searchTree, 20);
        searchTree = insertNode(searchTree, 40);
        searchTree = insertNode(searchTree, 60);
        searchTree = insertNode(searchTree, 80);
        setTree(searchTree);
        break;
      case 4: // Traversal
        let traversalTree: TreeNode | null = null;
        traversalTree = insertNode(traversalTree, 50);
        traversalTree = insertNode(traversalTree, 30);
        traversalTree = insertNode(traversalTree, 70);
        traversalTree = insertNode(traversalTree, 20);
        traversalTree = insertNode(traversalTree, 40);
        setTree(traversalTree);
        break;
      default:
        break;
    }
  }, [currentStep, insertNode]);

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setTree(prev => insertNode(prev, value));
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

  const handleStepChange = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const getStepDescription = () => {
    const descriptions = [
      'Binary trees organize data hierarchically with at most two children per node',
      'Each node contains a value and references to left and right children',
      'New nodes are inserted by comparing values and following BST rules',
      'Searching efficiently navigates the tree using value comparisons',
      'Tree traversal visits all nodes in different systematic orders',
      'Deletion handles three cases: leaf, one child, and two children',
      'Binary trees power many real-world applications and systems'
    ];
    return descriptions[currentStep] || '';
  };

  const renderTree = (node: TreeNode | null, level: number = 0): React.ReactNode => {
    if (!node) return null;

    return (
      <TreeLevel key={`${node.id}-${level}`}>
        <TreeNodeElement
          $highlighted={highlightedNode === node.id}
          $found={foundNode === node.id}
          $isRoot={level === 0}
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
          <div style={{ display: 'flex', gap: '80px', marginTop: '40px' }}>
            {node.left ? renderTree(node.left, level + 1) : <div style={{ width: '50px' }} />}
            {node.right ? renderTree(node.right, level + 1) : <div style={{ width: '50px' }} />}
          </div>
        )}
      </TreeLevel>
    );
  };

  return (
    <Container>
      <EnhancedTutorialSystem
        title={binaryTreeTutorial.title}
        description={binaryTreeTutorial.description}
        steps={binaryTreeTutorial.steps}
        onStepChange={handleStepChange}
      >
        <VisualizationArea>
          <StepIndicator>
            {getStepDescription()}
          </StepIndicator>

          <TreeContainer>
            <AnimatePresence>
              {tree ? (
                renderTree(tree)
              ) : (
                <EmptyState>
                  <div>🌳</div>
                  <div>Empty Binary Search Tree</div>
                  <div>Add some numbers to get started!</div>
                </EmptyState>
              )}
            </AnimatePresence>
          </TreeContainer>

          <ControlsSection>
            <InputGroup>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value"
                onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
              />
              <Button size="sm" onClick={handleInsert}>
                <Plus size={16} />
                Insert
              </Button>
            </InputGroup>

            <InputGroup>
              <Input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button size="sm" variant="outline" onClick={handleSearch}>
                <Search size={16} />
                Find
              </Button>
            </InputGroup>

            <Button size="sm" variant="outline" onClick={handleClear}>
              <RotateCcw size={16} />
              Clear
            </Button>
          </ControlsSection>
        </VisualizationArea>
      </EnhancedTutorialSystem>
    </Container>
  );
};
