import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Database,
  List,
  Layers,
  ArrowRightLeft,
  Hash,
  Network,
  TrendingUp,
  Play,
  Clock,
  Award,
  CheckCircle,
  Star
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { useAppSelector } from '@/hooks/redux';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  max-width: 1200px;
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

const TutorialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const TutorialCard = styled(motion.div) <{ $completed?: boolean }>`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme, $completed }) =>
    $completed ? '#fbbf24' : theme.colors.border
  };
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  cursor: pointer;
  position: relative;
  ${({ $completed }) => $completed && `
    background: linear-gradient(135deg,
      rgba(251, 191, 36, 0.1) 0%,
      rgba(251, 191, 36, 0.05) 100%
    );
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.2);
  `}
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

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  background: ${({ $color }) => $color};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CardDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Difficulty = styled.span<{ $level: 'beginner' | 'intermediate' | 'advanced' }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background-color: ${({ $level }) =>
    $level === 'beginner' ? '#10b981' :
      $level === 'intermediate' ? '#f59e0b' : '#ef4444'};
  color: white;
`;

const FeatureSection = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
`;

const FeatureTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const FeatureItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const FeatureText = styled.div`
  text-align: center;
`;

const FeatureName = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const CompletionBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);

  svg {
    width: 18px;
    height: 18px;
  }
`;

const tutorials = [
  {
    id: 'array',
    name: 'Array Fundamentals',
    icon: Database,
    color: '#6366f1',
    description: 'Master arrays with interactive examples covering creation, access, insertion, deletion, and common operations.',
    difficulty: 'beginner' as const,
    duration: '15 min',
    steps: 7,
  },
  {
    id: 'linked-list',
    name: 'Linked Lists',
    icon: List,
    color: '#10b981',
    description: 'Learn about linked lists, node structures, traversal, and dynamic memory allocation.',
    difficulty: 'beginner' as const,
    duration: '20 min',
    steps: 6,
  },
  {
    id: 'stack',
    name: 'Stack Operations',
    icon: Layers,
    color: '#f59e0b',
    description: 'Understand LIFO principle, push/pop operations, and real-world stack applications.',
    difficulty: 'beginner' as const,
    duration: '12 min',
    steps: 5,
  },
  {
    id: 'queue',
    name: 'Queue Operations',
    icon: ArrowRightLeft,
    color: '#ef4444',
    description: 'Explore FIFO principle, enqueue/dequeue operations, and queue implementations.',
    difficulty: 'beginner' as const,
    duration: '12 min',
    steps: 5,
  },

  {
    id: 'hash-table',
    name: 'Hash Tables',
    icon: Hash,
    color: '#06b6d4',
    description: 'Learn hash functions, collision resolution, and the power of O(1) average-case operations.',
    difficulty: 'intermediate' as const,
    duration: '20 min',
    steps: 6,
  },
  {
    id: 'graph',
    name: 'Graph Theory',
    icon: Network,
    color: '#84cc16',
    description: 'Explore vertices, edges, graph representations, and fundamental graph algorithms.',
    difficulty: 'advanced' as const,
    duration: '30 min',
    steps: 8,
  },
  {
    id: 'heap',
    name: 'Heaps & Priority Queues',
    icon: TrendingUp,
    color: '#f97316',
    description: 'Master heap properties, heapify operations, and priority queue implementations.',
    difficulty: 'advanced' as const,
    duration: '25 min',
    steps: 7,
  },
];

const features = [
  {
    icon: BookOpen,
    name: 'Step-by-Step Learning',
    description: 'Follow guided tutorials with clear explanations and interactive examples.'
  },
  {
    icon: Play,
    name: 'Interactive Visualizations',
    description: 'See data structures come to life with animated, hands-on demonstrations.'
  },
  {
    icon: Award,
    name: 'Code Examples',
    description: 'Learn with real code snippets in multiple programming languages.'
  }
];

export const TutorialsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);

  // For demo purposes, let's assume some tutorials are completed
  // In a real app, this would come from user progress data
  const completedTutorials = new Set([
    'array', // Mark array tutorial as completed for demo
    'stack', // Mark stack tutorial as completed for demo
    // Add more completed tutorial IDs based on user.stats or progress
  ]);

  const handleTutorialClick = (tutorialId: string) => {
    // Check if tutorial has content
    const tutorialsWithContent = ['array', 'stack', 'linked-list'];

    if (tutorialsWithContent.includes(tutorialId)) {
      navigate(`/tutorials/${tutorialId}`);
    } else {
      // Show coming soon message for tutorials without content
      alert(`🚧 ${tutorials.find(t => t.id === tutorialId)?.name} tutorial is coming in the next version! \n\nCurrently available tutorials:\n• Array Fundamentals\n• Stack Operations\n• Linked Lists`);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Interactive Tutorials</Title>
        <Subtitle>
          Master data structures through step-by-step guided learning with interactive visualizations and real code examples.
        </Subtitle>
      </Header>

      <TutorialGrid>
        {tutorials.map((tutorial, index) => {
          const isCompleted = completedTutorials.has(tutorial.id);

          return (
            <TutorialCard
              key={tutorial.id}
              $completed={isCompleted}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleTutorialClick(tutorial.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CardHeader>
                <IconWrapper $color={tutorial.color}>
                  <tutorial.icon />
                </IconWrapper>
                <CardTitle>{tutorial.name}</CardTitle>
              </CardHeader>

              <CardDescription>{tutorial.description}</CardDescription>

              <CardStats>
                <StatItem>
                  <Clock size={14} />
                  {tutorial.duration}
                </StatItem>
                <StatItem>
                  <BookOpen size={14} />
                  {tutorial.steps} steps
                </StatItem>
              </CardStats>

              <CardFooter>
                <Difficulty $level={tutorial.difficulty}>
                  {tutorial.difficulty}
                </Difficulty>
                <Button size="sm" onClick={(e) => e.stopPropagation()}>
                  {isCompleted ? 'Completed' : 'Start Tutorial'}
                  {isCompleted ? <CheckCircle size={14} /> : <Play size={14} />}
                </Button>
              </CardFooter>

              {isCompleted && (
                <CompletionBadge>
                  <Star />
                </CompletionBadge>
              )}
            </TutorialCard>
          );
        })}
      </TutorialGrid>

      <FeatureSection>
        <FeatureTitle>Why Choose StackTrek Tutorials?</FeatureTitle>
        <FeatureGrid>
          {features.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>
                <feature.icon />
              </FeatureIcon>
              <FeatureText>
                <FeatureName>{feature.name}</FeatureName>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureText>
            </FeatureItem>
          ))}
        </FeatureGrid>
      </FeatureSection>
    </Container>
  );
};
