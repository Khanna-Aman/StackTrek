import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  Search,
  GitBranch,
  Route,
  Zap,
  BarChart3
} from 'lucide-react';
import SimpleBubbleSort from '@/components/algorithms/SimpleBubbleSort';
import SimpleSearchAlgorithms from '@/components/algorithms/SimpleSearchAlgorithms';
import { GraphAlgorithmsVisualization } from '@/components/algorithms/GraphAlgorithmsVisualization';
import { DynamicProgrammingVisualization } from '@/components/algorithms/DynamicProgrammingVisualization';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  max-width: 600px;
  margin: 0 auto;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0 0;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;

  &:hover {
    background: ${({ $active, theme }) =>
    $active ? theme.colors.primaryHover : theme.colors.backgroundSecondary};
  }

  ${({ $active, theme }) => $active && `
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${theme.colors.primary};
    }
  `}
`;

const ContentArea = styled(motion.div)`
  min-height: 600px;
`;

const AlgorithmGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const AlgorithmCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const CardIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  background: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardComplexity = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ComplexityItem = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PlaceholderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  text-align: center;
`;

type AlgorithmCategory = 'sorting' | 'searching' | 'graph' | 'dynamic';

const algorithmCategories = [
  { id: 'sorting', label: 'Sorting', icon: ArrowUpDown },
  { id: 'searching', label: 'Searching', icon: Search },
  { id: 'graph', label: 'Graph', icon: GitBranch },
  { id: 'dynamic', label: 'Dynamic Programming', icon: Zap },
];

const sortingAlgorithms = [
  {
    name: 'Bubble Sort',
    description: 'Simple comparison-based algorithm that repeatedly steps through the list.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    color: '#6366f1'
  },
  {
    name: 'Quick Sort',
    description: 'Efficient divide-and-conquer algorithm using pivot partitioning.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    color: '#10b981'
  },
  {
    name: 'Merge Sort',
    description: 'Stable divide-and-conquer algorithm that merges sorted subarrays.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    color: '#f59e0b'
  },
  {
    name: 'Heap Sort',
    description: 'Comparison-based algorithm using a binary heap data structure.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(1)',
    color: '#ef4444'
  }
];

export const AlgorithmsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<AlgorithmCategory>('sorting');

  const renderContent = () => {
    switch (activeCategory) {
      case 'sorting':
        return <SimpleBubbleSort />;

      case 'searching':
        return <SimpleSearchAlgorithms />;

      case 'graph':
        return <GraphAlgorithmsVisualization />;

      case 'dynamic':
        return <DynamicProgrammingVisualization />;

      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Algorithm Visualizations</Title>
        <Subtitle>
          Watch algorithms come to life with interactive step-by-step visualizations and performance analysis.
        </Subtitle>
      </Header>

      <TabsContainer>
        {algorithmCategories.map((category) => (
          <Tab
            key={category.id}
            $active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id as AlgorithmCategory)}
          >
            <category.icon size={18} />
            {category.label}
          </Tab>
        ))}
      </TabsContainer>

      <ContentArea
        key={activeCategory}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderContent()}
      </ContentArea>
    </Container>
  );
};
