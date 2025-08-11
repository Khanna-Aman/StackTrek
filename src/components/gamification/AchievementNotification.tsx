import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface AchievementNotificationProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onComplete?: () => void;
}

const Container = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.surface} 0%,
    ${({ theme }) => theme.colors.backgroundSecondary} 100%);
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  text-align: center;
  min-width: 400px;
  max-width: 500px;
`;

const Backdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const TrophyIcon = styled(motion.div)`
  width: 80px;
  height: 80px;
  margin: 0 auto ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    opacity: 0.3;
  }
`;

const Title = styled(motion.h2)`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Subtitle = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const AchievementIcon = styled(motion.div)`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const AchievementName = styled(motion.h3)`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const AchievementDescription = styled(motion.p)`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Category = styled.div`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Stars = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const StarIcon = styled(motion.div)<{ $delay: number }>`
  position: absolute;
  color: ${({ theme }) => theme.colors.primary};
`;

const CloseText = styled(motion.div)`
  margin-top: ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  isVisible,
  onComplete,
}) => {
  useEffect(() => {
    if (isVisible) {
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onComplete?.();
      }, 5000);

      // Close on click or escape key
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onComplete?.();
        }
      };

      document.addEventListener('keydown', handleKeyPress);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isVisible, onComplete]);

  if (!achievement) return null;

  // Generate random star positions
  const stars = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: i * 0.1,
  }));

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onComplete}
          />
          <Container
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            onClick={onComplete}
          >
            <Stars>
              {stars.map((star) => (
                <StarIcon
                  key={star.id}
                  $delay={star.delay}
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: star.delay,
                    ease: "easeInOut"
                  }}
                >
                  <Star size={16} fill="currentColor" />
                </StarIcon>
              ))}
            </Stars>

            <Header>
              <TrophyIcon
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20,
                  delay: 0.2
                }}
              >
                <Trophy size={40} />
              </TrophyIcon>
              
              <Title
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Achievement Unlocked!
              </Title>
              
              <Subtitle>Congratulations on your progress!</Subtitle>
            </Header>

            <AchievementIcon
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 25,
                delay: 0.6
              }}
            >
              {achievement.icon}
            </AchievementIcon>

            <AchievementName
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {achievement.name}
            </AchievementName>

            <AchievementDescription
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              {achievement.description}
            </AchievementDescription>

            <Category>{achievement.category}</Category>

            <CloseText
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
            >
              Click anywhere or press ESC to close
            </CloseText>
          </Container>
        </>
      )}
    </AnimatePresence>
  );
};
