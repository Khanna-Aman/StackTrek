import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Clock, 
  Star, 
  Play, 
  Trophy, 
  Zap,
  Database,
  Layers,
  ArrowRightLeft,
  GitBranch,
  Network,
  TrendingUp,
  Filter
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { challenges, getChallengesByCategory, getChallengesByDifficulty } from '@/data/challenges';
import { Challenge } from '@/components/challenges/ChallengeSystem';

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

const FiltersSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const FilterLabel = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $active }) => 
    $active ? 'white' : theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme, $active }) => 
      $active ? theme.colors.primaryHover : theme.colors.backgroundSecondary};
  }
`;

const ChallengesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const ChallengeCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary}, 
      ${({ theme }) => theme.colors.secondary});
  }
`;

const ChallengeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ChallengeInfo = styled.div`
  flex: 1;
`;

const ChallengeTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ChallengeDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const CategoryIcon = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  background: ${({ $color }) => $color};
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

const ChallengeMetadata = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DifficultyBadge = styled.span<{ $difficulty: Challenge['difficulty'] }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-transform: uppercase;
  background: ${({ $difficulty }) => {
    switch ($difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
`;

const ChallengeFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const XPReward = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const categoryIcons = {
  array: { icon: Database, color: '#3b82f6' },
  stack: { icon: Layers, color: '#10b981' },
  queue: { icon: ArrowRightLeft, color: '#f59e0b' },
  tree: { icon: GitBranch, color: '#8b5cf6' },
  graph: { icon: Network, color: '#ef4444' },
  sorting: { icon: TrendingUp, color: '#06b6d4' }
};

export const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const filteredChallenges = challenges.filter(challenge => {
    const categoryMatch = selectedCategory === 'all' || challenge.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const handleChallengeClick = (challengeId: string) => {
    navigate(`/challenges/${challengeId}`);
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'array', label: 'Arrays' },
    { id: 'stack', label: 'Stacks' },
    { id: 'queue', label: 'Queues' },
    { id: 'tree', label: 'Trees' },
    { id: 'graph', label: 'Graphs' },
    { id: 'sorting', label: 'Sorting' }
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' }
  ];

  return (
    <Container>
      <Header>
        <Title>Coding Challenges</Title>
        <Subtitle>
          Test your skills with interactive coding challenges. Solve problems, earn XP, and master data structures!
        </Subtitle>
      </Header>

      <FiltersSection>
        <FilterGroup>
          <FilterLabel>
            <Filter size={16} />
            Category:
          </FilterLabel>
          {categories.map(category => (
            <FilterButton
              key={category.id}
              $active={selectedCategory === category.id}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </FilterButton>
          ))}
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Difficulty:</FilterLabel>
          {difficulties.map(difficulty => (
            <FilterButton
              key={difficulty.id}
              $active={selectedDifficulty === difficulty.id}
              onClick={() => setSelectedDifficulty(difficulty.id)}
            >
              {difficulty.label}
            </FilterButton>
          ))}
        </FilterGroup>
      </FiltersSection>

      <ChallengesGrid>
        {filteredChallenges.map((challenge, index) => {
          const categoryInfo = categoryIcons[challenge.category];
          const CategoryIconComponent = categoryInfo.icon;

          return (
            <ChallengeCard
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleChallengeClick(challenge.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChallengeHeader>
                <ChallengeInfo>
                  <ChallengeTitle>{challenge.title}</ChallengeTitle>
                  <ChallengeDescription>{challenge.description}</ChallengeDescription>
                </ChallengeInfo>
                <CategoryIcon $color={categoryInfo.color}>
                  <CategoryIconComponent />
                </CategoryIcon>
              </ChallengeHeader>

              <ChallengeMetadata>
                <MetadataItem>
                  <Target size={14} />
                  <DifficultyBadge $difficulty={challenge.difficulty}>
                    {challenge.difficulty}
                  </DifficultyBadge>
                </MetadataItem>
                <MetadataItem>
                  <Clock size={14} />
                  {Math.floor(challenge.timeLimit / 60)} min
                </MetadataItem>
              </ChallengeMetadata>

              <ChallengeFooter>
                <XPReward>
                  <Star size={16} />
                  {challenge.xpReward} XP
                </XPReward>
                <Button size="sm">
                  <Play size={14} />
                  Start Challenge
                </Button>
              </ChallengeFooter>
            </ChallengeCard>
          );
        })}
      </ChallengesGrid>

      {filteredChallenges.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: 'var(--text-secondary)' 
        }}>
          <Trophy size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
          <h3>No challenges found</h3>
          <p>Try adjusting your filters to see more challenges.</p>
        </div>
      )}
    </Container>
  );
};
