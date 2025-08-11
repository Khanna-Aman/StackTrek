import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Database, 
  List, 
  Layers, 
  ArrowRightLeft, 
  GitBranch, 
  Hash, 
  Network, 
  TrendingUp,
  Code,
  BookOpen
} from 'lucide-react';
import { CodeExamplesViewer } from '@/components/code/CodeExamplesViewer';
import { arrayImplementationExamples, arrayAlgorithmExamples } from '@/data/codeExamples/arrayExamples';

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
  overflow-x: auto;
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
  white-space: nowrap;

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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 20px;
    height: 20px;
  }
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

const LanguageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const LanguageCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
`;

const LanguageName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const LanguageIcon = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

type DataStructure = 'array' | 'linked-list' | 'stack' | 'queue' | 'binary-tree' | 'hash-table' | 'graph' | 'heap';

const dataStructures = [
  { id: 'array', label: 'Arrays', icon: Database },
  { id: 'linked-list', label: 'Linked Lists', icon: List },
  { id: 'stack', label: 'Stacks', icon: Layers },
  { id: 'queue', label: 'Queues', icon: ArrowRightLeft },
  { id: 'binary-tree', label: 'Binary Trees', icon: GitBranch },
  { id: 'hash-table', label: 'Hash Tables', icon: Hash },
  { id: 'graph', label: 'Graphs', icon: Network },
  { id: 'heap', label: 'Heaps', icon: TrendingUp },
];

const supportedLanguages = [
  { name: 'JavaScript', color: '#f7df1e' },
  { name: 'Python', color: '#3776ab' },
  { name: 'Java', color: '#ed8b00' },
  { name: 'C++', color: '#00599c' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Go', color: '#00add8' },
  { name: 'Rust', color: '#000000' },
  { name: 'Swift', color: '#fa7343' },
];

export const CodeExamplesPage: React.FC = () => {
  const [activeDataStructure, setActiveDataStructure] = useState<DataStructure>('array');

  const renderContent = () => {
    switch (activeDataStructure) {
      case 'array':
        return (
          <div>
            <SectionTitle>
              <SectionIcon>
                <Code />
              </SectionIcon>
              Array Implementation
            </SectionTitle>
            <CodeExamplesViewer
              title="Dynamic Array Implementation"
              description="Complete implementation of a dynamic array data structure with all essential operations."
              examples={arrayImplementationExamples}
            />

            <SectionTitle>
              <SectionIcon>
                <BookOpen />
              </SectionIcon>
              Array Algorithms
            </SectionTitle>
            <CodeExamplesViewer
              title="Common Array Algorithms"
              description="Essential algorithms for working with arrays including search and optimization techniques."
              examples={arrayAlgorithmExamples}
            />
          </div>
        );
      
      default:
        return (
          <PlaceholderContent>
            <Code size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3>{dataStructures.find(ds => ds.id === activeDataStructure)?.label} Code Examples</h3>
            <p>Implementation examples coming soon!</p>
          </PlaceholderContent>
        );
    }
  };

  return (
    <Container>
      <Header>
        <Title>Code Examples & Implementations</Title>
        <Subtitle>
          Explore complete implementations of data structures and algorithms in multiple programming languages.
        </Subtitle>
      </Header>

      <LanguageGrid>
        {supportedLanguages.map((language) => (
          <LanguageCard key={language.name}>
            <LanguageIcon $color={language.color} />
            <LanguageName>{language.name}</LanguageName>
          </LanguageCard>
        ))}
      </LanguageGrid>

      <TabsContainer>
        {dataStructures.map((ds) => (
          <Tab
            key={ds.id}
            $active={activeDataStructure === ds.id}
            onClick={() => setActiveDataStructure(ds.id as DataStructure)}
          >
            <ds.icon size={18} />
            {ds.label}
          </Tab>
        ))}
      </TabsContainer>

      <ContentArea
        key={activeDataStructure}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderContent()}
      </ContentArea>
    </Container>
  );
};
