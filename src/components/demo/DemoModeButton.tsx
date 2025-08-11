import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setUser } from '@/store/slices/authSlice';
import { DemoAuthService } from '@/services/demoAuthService';
import { isFirebaseConfigured } from '@/config/firebase';
import { Play, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const DemoContainer = styled(motion.div)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.secondary}, 
    ${({ theme }) => theme.colors.primary});
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[4]};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  color: white;
  max-width: 300px;
`;

const DemoTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const DemoDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const DemoButton = styled(Button)`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
`;

const FeatureList = styled.ul`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-left: ${({ theme }) => theme.spacing[4]};
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }
`;

export const DemoModeButton: React.FC = () => {
  const dispatch = useAppDispatch();

  // Only show demo mode if Firebase is not configured AND user is not authenticated
  const { isAuthenticated } = useAppSelector(state => state.auth);

  if (isFirebaseConfigured || isAuthenticated) {
    return null;
  }

  const handleDemoLogin = async () => {
    try {
      const user = await DemoAuthService.signInDemo();
      dispatch(setUser(user));
      toast.success('🎮 Demo mode activated! Try the gamification features!');
    } catch (error) {
      toast.error('Failed to start demo mode');
    }
  };

  return (
    <DemoContainer
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <DemoTitle>
        <Zap size={20} />
        Demo Mode
      </DemoTitle>

      <DemoDescription>
        Firebase not configured? Try the gamification features in demo mode!
      </DemoDescription>

      <FeatureList>
        <li>🎯 XP & Level System</li>
        <li>🏆 Achievement Badges</li>
        <li>📊 User Profile & Stats</li>
        <li>🎉 Celebration Animations</li>
      </FeatureList>

      <DemoButton onClick={handleDemoLogin} size="sm">
        <Play size={16} />
        Try Demo Mode
      </DemoButton>
    </DemoContainer>
  );
};
