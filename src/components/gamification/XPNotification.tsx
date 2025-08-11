import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';

interface XPNotificationProps {
  xpGained: number;
  isVisible: boolean;
  onComplete?: () => void;
}

const Container = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  min-width: 200px;
`;

const IconContainer = styled(motion.div)`
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  flex: 1;
`;

const XPText = styled(motion.div)`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const Description = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.9;
`;

const XPCounter = styled(motion.span)`
  display: inline-block;
`;

export const XPNotification: React.FC<XPNotificationProps> = ({
  xpGained,
  isVisible,
  onComplete,
}) => {
  const [displayXP, setDisplayXP] = useState(0);

  useEffect(() => {
    if (isVisible && xpGained > 0) {
      // Animate the XP counter
      const duration = 1000; // 1 second
      const steps = 20;
      const increment = xpGained / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= xpGained) {
          setDisplayXP(xpGained);
          clearInterval(timer);
          
          // Auto-hide after showing for 3 seconds
          setTimeout(() => {
            onComplete?.();
          }, 2000);
        } else {
          setDisplayXP(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, xpGained, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <Container
          initial={{ opacity: 0, x: 100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        >
          <IconContainer
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 0.8,
              ease: "easeInOut"
            }}
          >
            <Zap size={20} />
          </IconContainer>
          
          <Content>
            <XPText>
              +<XPCounter
                key={displayXP}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {displayXP}
              </XPCounter> XP
            </XPText>
            <Description>Experience gained!</Description>
          </Content>
          
          <motion.div
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <TrendingUp size={16} />
          </motion.div>
        </Container>
      )}
    </AnimatePresence>
  );
};
