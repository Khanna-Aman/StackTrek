import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Award, Zap } from 'lucide-react';

interface XPSystemProps {
  currentXP: number;
  currentLevel: number;
  showLevelUp?: boolean;
  onLevelUpComplete?: () => void;
}

const levelUpAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
`;

const sparkleAnimation = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(180deg); opacity: 1; }
  100% { transform: scale(0) rotate(360deg); opacity: 0; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const XPBar = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  height: 12px;
  overflow: hidden;
  position: relative;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const XPFill = styled(motion.div)<{ $percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, 
    #10b981, 
    #34d399, 
    #6ee7b7);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.3), 
      transparent);
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const XPInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const LevelBadge = styled(motion.div)<{ $isLevelingUp?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  position: relative;
  
  ${({ $isLevelingUp }) => $isLevelingUp && `
    animation: ${levelUpAnimation} 1s ease-in-out;
  `}
`;

const XPText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const LevelUpModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LevelUpContent = styled(motion.div)`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
`;

const LevelUpTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const LevelUpSubtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const LevelUpLevel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const Sparkle = styled(motion.div)<{ $delay: number }>`
  position: absolute;
  width: 20px;
  height: 20px;
  background: #fbbf24;
  border-radius: 50%;
  animation: ${sparkleAnimation} 2s infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  
  &::before {
    content: '✨';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }
`;

const XPGainNotification = styled(motion.div)`
  position: fixed;
  top: 100px;
  right: 20px;
  background: linear-gradient(135deg, #10b981, #34d399);
  color: white;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  z-index: 999;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

// XP calculation utilities
export const calculateLevel = (totalXP: number): number => {
  return Math.floor(totalXP / 100) + 1;
};

export const calculateXPForLevel = (level: number): number => {
  return (level - 1) * 100;
};

export const calculateXPForNextLevel = (level: number): number => {
  return level * 100;
};

export const calculateLevelProgress = (currentXP: number, currentLevel: number): number => {
  const currentLevelXP = calculateXPForLevel(currentLevel);
  const nextLevelXP = calculateXPForNextLevel(currentLevel);
  const progressXP = currentXP - currentLevelXP;
  const totalXPNeeded = nextLevelXP - currentLevelXP;
  return Math.min((progressXP / totalXPNeeded) * 100, 100);
};

export const XPSystem: React.FC<XPSystemProps> = ({
  currentXP,
  currentLevel,
  showLevelUp = false,
  onLevelUpComplete
}) => {
  const [isLevelingUp, setIsLevelingUp] = useState(false);
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGainAmount, setXPGainAmount] = useState(0);

  const progress = calculateLevelProgress(currentXP, currentLevel);
  const nextLevelXP = calculateXPForNextLevel(currentLevel);
  const currentLevelXP = calculateXPForLevel(currentLevel);
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentXP;

  useEffect(() => {
    if (showLevelUp) {
      setIsLevelingUp(true);
      const timer = setTimeout(() => {
        setIsLevelingUp(false);
        onLevelUpComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp, onLevelUpComplete]);

  const showXPGainNotification = (amount: number) => {
    setXPGainAmount(amount);
    setShowXPGain(true);
    setTimeout(() => setShowXPGain(false), 2000);
  };

  // Expose function for external use
  React.useImperativeHandle(React.createRef(), () => ({
    showXPGain: showXPGainNotification
  }));

  return (
    <>
      <Container>
        <XPInfo>
          <LevelBadge $isLevelingUp={isLevelingUp}>
            <Star size={16} />
            Level {currentLevel}
          </LevelBadge>
          <XPText>
            {xpInCurrentLevel} / {nextLevelXP - currentLevelXP} XP
          </XPText>
        </XPInfo>
        
        <XPBar>
          <XPFill
            $percentage={progress}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </XPBar>
        
        <XPText style={{ textAlign: 'center', fontSize: '12px' }}>
          {xpNeededForNext} XP to next level
        </XPText>
      </Container>

      {/* Level Up Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <LevelUpModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsLevelingUp(false);
              onLevelUpComplete?.();
            }}
          >
            <LevelUpContent
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              transition={{ type: "spring", damping: 15 }}
            >
              {/* Sparkles */}
              {[...Array(8)].map((_, i) => (
                <Sparkle
                  key={i}
                  $delay={i * 0.2}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <Award size={64} style={{ marginBottom: '16px' }} />
              </motion.div>
              
              <LevelUpTitle>Level Up!</LevelUpTitle>
              <LevelUpSubtitle>Congratulations! You've reached</LevelUpSubtitle>
              <LevelUpLevel>Level {currentLevel}</LevelUpLevel>
              <p style={{ opacity: 0.8 }}>Keep learning to unlock more achievements!</p>
            </LevelUpContent>
          </LevelUpModal>
        )}
      </AnimatePresence>

      {/* XP Gain Notification */}
      <AnimatePresence>
        {showXPGain && (
          <XPGainNotification
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <Zap size={20} />
            +{xpGainAmount} XP
          </XPGainNotification>
        )}
      </AnimatePresence>
    </>
  );
};
