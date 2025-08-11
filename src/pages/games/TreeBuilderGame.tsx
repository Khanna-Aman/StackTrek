import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gamepad2, Lock, Calendar, GitBranch, Target, Zap } from 'lucide-react';
import { Button } from '@/components/common/Button';

const Container = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Header = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
`;

const BackButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ComingSoonCard = styled(motion.div)`
  background: white;
  border-radius: 2rem;
  padding: 3rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
  max-width: 600px;
  width: 100%;
`;

const IconWrapper = styled.div`
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 2rem 0;
  text-align: left;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
`;

const FeatureIcon = styled.div`
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const FeatureText = styled.span`
  font-weight: 500;
  color: #374151;
`;

const ComingSoonBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #ef4444;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const TreePreview = styled.div`
  background: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 1rem;
  padding: 2rem;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  color: #64748b;
  font-size: 3rem;
`;

export const TreeBuilderGame: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <BackButton variant="outline" onClick={() => navigate('/games')}>
          <ArrowLeft size={16} />
          Back to Games
        </BackButton>
      </Header>

      <ComingSoonCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ComingSoonBadge>
          <Lock size={16} />
          Coming Soon
        </ComingSoonBadge>

        <IconWrapper>
          <Gamepad2 size={32} />
        </IconWrapper>

        <Title>🌳 Tree Builder</Title>
        <Subtitle>
          Construct balanced binary trees by placing nodes in the correct positions. 
          Master tree traversal, balancing, and search operations!
        </Subtitle>

        <TreePreview>
          🌳
        </TreePreview>

        <FeatureList>
          <FeatureItem>
            <FeatureIcon>
              <GitBranch size={12} />
            </FeatureIcon>
            <FeatureText>Interactive tree building</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <Target size={12} />
            </FeatureIcon>
            <FeatureText>Balance challenges</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <Zap size={12} />
            </FeatureIcon>
            <FeatureText>Traversal algorithms</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>
              <Calendar size={12} />
            </FeatureIcon>
            <FeatureText>Progressive difficulty</FeatureText>
          </FeatureItem>
        </FeatureList>

        <div style={{ 
          background: '#fee2e2', 
          border: '1px solid #ef4444', 
          borderRadius: '0.75rem', 
          padding: '1rem', 
          margin: '2rem 0',
          color: '#991b1b'
        }}>
          <strong>🎯 Game Features:</strong>
          <ul style={{ margin: '0.5rem 0 0 1rem', textAlign: 'left' }}>
            <li>Drag-and-drop node placement</li>
            <li>Real-time tree balancing feedback</li>
            <li>In-order, pre-order, post-order traversals</li>
            <li>Binary search tree validation</li>
            <li>AVL and Red-Black tree challenges</li>
          </ul>
        </div>

        <ActionButtons>
          <Button onClick={() => navigate('/games')}>
            Explore Other Games
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/tutorials')}
          >
            Learn Trees First
          </Button>
        </ActionButtons>
      </ComingSoonCard>
    </Container>
  );
};
