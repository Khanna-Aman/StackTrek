import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { SimpleArrayVisualization } from '@/components/dataStructures/SimpleArrayVisualization';
import { SimpleStackVisualization } from '@/components/dataStructures/SimpleStackVisualization';
import { SimpleQueueVisualization } from '@/components/dataStructures/SimpleQueueVisualization';
import { SimpleLinkedListVisualization } from '@/components/dataStructures/SimpleLinkedListVisualization';
import { ArrayVisualization } from '@/components/dataStructures/ArrayVisualization';
import { EnhancedStackVisualization } from '@/components/dataStructures/EnhancedStackVisualization';
import { EnhancedQueueVisualization } from '@/components/dataStructures/EnhancedQueueVisualization';
import { BinaryTreeVisualization } from '@/components/dataStructures/BinaryTreeVisualization';
import { HashTableVisualization } from '@/components/dataStructures/HashTableVisualization';
import { GraphVisualization } from '@/components/dataStructures/GraphVisualization';
import { HeapVisualization } from '@/components/dataStructures/HeapVisualization';

import { Button } from '@/components/common/Button';
import { Database, List, Layers, ArrowRightLeft, GitBranch, Hash, Network, TrendingUp } from 'lucide-react';

const DataStructuresContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const NavigationTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ModeSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const ModeButton = styled(Button) <{ $active: boolean }>`
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.textSecondary};

  &:hover {
    background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryHover : theme.colors.backgroundTertiary};
  }
`;

const Tab = styled(Button) <{ $active: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  border-bottom: 3px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primaryLight : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;

const ContentArea = styled(motion.div)`
  min-height: 600px;
`;

const WelcomeCard = styled(motion.div)`
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.primaryLight} 0%,
    ${({ theme }) => theme.colors.secondaryLight} 100%);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const WelcomeTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const WelcomeText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const DataStructureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const DataStructureCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
`;

const CardIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: white;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardComplexity = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const dataStructures = [
  {
    id: 'array',
    name: 'Array',
    icon: Database,
    description: 'A collection of elements stored in contiguous memory locations, allowing random access by index.',
    timeComplexity: 'Access: O(1), Search: O(n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    icon: List,
    description: 'A linear data structure where elements are stored in nodes, each containing data and a reference to the next node.',
    timeComplexity: 'Access: O(n), Insert: O(1)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'stack',
    name: 'Stack',
    icon: Layers,
    description: 'A LIFO (Last In, First Out) data structure that supports push and pop operations at one end.',
    timeComplexity: 'Push/Pop: O(1)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'queue',
    name: 'Queue',
    icon: ArrowRightLeft,
    description: 'A FIFO (First In, First Out) data structure that supports enqueue at rear and dequeue at front.',
    timeComplexity: 'Enqueue/Dequeue: O(1)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'binary-tree',
    name: 'Binary Tree',
    icon: GitBranch,
    description: 'A hierarchical data structure where each node has at most two children, commonly used for searching and sorting.',
    timeComplexity: 'Search/Insert: O(log n)',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'hash-table',
    name: 'Hash Table',
    icon: Hash,
    description: 'A data structure that maps keys to values using a hash function, providing fast access to data.',
    timeComplexity: 'Insert/Delete/Search: O(1) avg',
    spaceComplexity: 'O(n)',
  },
  {
    id: 'graph',
    name: 'Graph',
    icon: Network,
    description: 'A collection of vertices connected by edges, used to represent relationships between objects.',
    timeComplexity: 'Varies by algorithm',
    spaceComplexity: 'O(V + E)',
  },
  {
    id: 'heap',
    name: 'Heap',
    icon: TrendingUp,
    description: 'A complete binary tree that satisfies the heap property, commonly used for priority queues.',
    timeComplexity: 'Insert/Extract: O(log n)',
    spaceComplexity: 'O(n)',
  },
];

export const DataStructuresPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [activeTab, setActiveTab] = useState(type || 'overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'array':
        return <ArrayVisualization />;
      case 'linked-list':
        return <SimpleLinkedListVisualization />;
      case 'stack':
        return <EnhancedStackVisualization />;
      case 'queue':
        return <EnhancedQueueVisualization />;
      case 'binary-tree':
        return <BinaryTreeVisualization />;
      case 'hash-table':
        return <HashTableVisualization />;
      case 'graph':
        return <GraphVisualization />;
      case 'heap':
        return <HeapVisualization />;
      default:
        return (
          <>
            <WelcomeCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <WelcomeTitle>🎉 Interactive Data Structures</WelcomeTitle>
              <WelcomeText>
                Explore and learn fundamental data structures through interactive visualizations.
                Click on any data structure below to start your learning journey!
              </WelcomeText>
            </WelcomeCard>

            <DataStructureGrid>
              {dataStructures.map((ds, index) => (
                <DataStructureCard
                  key={ds.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => setActiveTab(ds.id)}
                >
                  <CardIcon>
                    <ds.icon />
                  </CardIcon>
                  <CardTitle>{ds.name}</CardTitle>
                  <CardDescription>{ds.description}</CardDescription>
                  <CardComplexity>
                    <span><strong>Time:</strong> {ds.timeComplexity}</span>
                    <span><strong>Space:</strong> {ds.spaceComplexity}</span>
                  </CardComplexity>
                </DataStructureCard>
              ))}
            </DataStructureGrid>
          </>
        );
    }
  };

  return (
    <DataStructuresContainer>
      <PageTitle>Data Structures Playground</PageTitle>

      <NavigationTabs>
        <Tab
          variant="ghost"
          $active={activeTab === 'overview'}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Tab>
        {dataStructures.map(ds => (
          <Tab
            key={ds.id}
            variant="ghost"
            $active={activeTab === ds.id}
            onClick={() => setActiveTab(ds.id)}
          >
            <ds.icon size={16} />
            {ds.name}
          </Tab>
        ))}
      </NavigationTabs>

      <ContentArea
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {renderContent()}
      </ContentArea>
    </DataStructuresContainer>
  );
};
