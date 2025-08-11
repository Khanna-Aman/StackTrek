import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Star, 
  Target, 
  Zap, 
  Trophy, 
  Medal, 
  Crown, 
  Flame,
  BookOpen,
  Code,
  Users,
  Clock
} from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'learning' | 'speed' | 'consistency' | 'social' | 'mastery';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

interface AchievementSystemProps {
  achievements: Achievement[];
  onAchievementClick?: (achievement: Achievement) => void;
  showUnlockedOnly?: boolean;
}

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.5); }
  50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.8), 0 0 30px rgba(16, 185, 129, 0.6); }
  100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.5); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const CategoryTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing[2]};
`;

const CategoryTab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.backgroundSecondary};
  color: ${({ $active, theme }) => 
    $active ? 'white' : theme.colors.textSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) => 
      $active ? theme.colors.primaryHover : theme.colors.backgroundTertiary};
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const AchievementCard = styled(motion.div)<{ 
  $unlocked: boolean; 
  $rarity: Achievement['rarity'] 
}>`
  background: ${({ theme, $unlocked }) => 
    $unlocked ? theme.colors.surface : theme.colors.backgroundSecondary};
  border: 2px solid ${({ theme, $unlocked, $rarity }) => {
    if (!$unlocked) return theme.colors.border;
    switch ($rarity) {
      case 'legendary': return '#fbbf24';
      case 'epic': return '#a855f7';
      case 'rare': return '#3b82f6';
      default: return '#10b981';
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[4]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;
  opacity: ${({ $unlocked }) => $unlocked ? 1 : 0.6};

  ${({ $unlocked, $rarity }) => $unlocked && $rarity === 'legendary' && `
    animation: ${glowAnimation} 2s infinite;
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $unlocked, $rarity }) => {
      if (!$unlocked) return 'transparent';
      switch ($rarity) {
        case 'legendary': return 'linear-gradient(90deg, #fbbf24, #f59e0b)';
        case 'epic': return 'linear-gradient(90deg, #a855f7, #9333ea)';
        case 'rare': return 'linear-gradient(90deg, #3b82f6, #2563eb)';
        default: return 'linear-gradient(90deg, #10b981, #059669)';
      }
    }};
  }
`;

const AchievementHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const AchievementIcon = styled.div<{ 
  $unlocked: boolean; 
  $rarity: Achievement['rarity'] 
}>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $unlocked, $rarity }) => {
    if (!$unlocked) return '#6b7280';
    switch ($rarity) {
      case 'legendary': return 'linear-gradient(135deg, #fbbf24, #f59e0b)';
      case 'epic': return 'linear-gradient(135deg, #a855f7, #9333ea)';
      case 'rare': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      default: return 'linear-gradient(135deg, #10b981, #059669)';
    }
  }};
  color: white;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const AchievementInfo = styled.div`
  flex: 1;
`;

const AchievementTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const AchievementDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const AchievementFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const RarityBadge = styled.span<{ $rarity: Achievement['rarity'] }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-transform: uppercase;
  background: ${({ $rarity }) => {
    switch ($rarity) {
      case 'legendary': return '#fbbf24';
      case 'epic': return '#a855f7';
      case 'rare': return '#3b82f6';
      default: return '#10b981';
    }
  }};
  color: white;
`;

const XPReward = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const ProgressFill = styled(motion.div)<{ $percentage: number }>`
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const UnlockedDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const categoryIcons = {
  learning: BookOpen,
  speed: Zap,
  consistency: Flame,
  social: Users,
  mastery: Crown
};

const categories = [
  { id: 'all', label: 'All', icon: Award },
  { id: 'learning', label: 'Learning', icon: BookOpen },
  { id: 'speed', label: 'Speed', icon: Zap },
  { id: 'consistency', label: 'Consistency', icon: Flame },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'mastery', label: 'Mastery', icon: Crown }
];

export const AchievementSystem: React.FC<AchievementSystemProps> = ({
  achievements,
  onAchievementClick,
  showUnlockedOnly = false
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredAchievements = achievements.filter(achievement => {
    if (showUnlockedOnly && !achievement.unlocked) return false;
    if (activeCategory === 'all') return true;
    return achievement.category === activeCategory;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <Container>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: 'bold' }}>
          Achievements ({unlockedCount}/{totalCount})
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Unlock achievements by completing challenges and learning new concepts!
        </p>
      </div>

      <CategoryTabs>
        {categories.map((category) => (
          <CategoryTab
            key={category.id}
            $active={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
          >
            <category.icon size={16} style={{ marginRight: '8px' }} />
            {category.label}
          </CategoryTab>
        ))}
      </CategoryTabs>

      <AchievementsGrid>
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              $unlocked={achievement.unlocked}
              $rarity={achievement.rarity}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onAchievementClick?.(achievement)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AchievementHeader>
                <AchievementIcon 
                  $unlocked={achievement.unlocked} 
                  $rarity={achievement.rarity}
                >
                  <achievement.icon />
                </AchievementIcon>
                <AchievementInfo>
                  <AchievementTitle>{achievement.title}</AchievementTitle>
                  <AchievementDescription>
                    {achievement.description}
                  </AchievementDescription>
                </AchievementInfo>
              </AchievementHeader>

              {achievement.progress !== undefined && achievement.maxProgress && (
                <>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '8px' 
                  }}>
                    Progress: {achievement.progress}/{achievement.maxProgress}
                  </div>
                  <ProgressBar>
                    <ProgressFill
                      $percentage={(achievement.progress / achievement.maxProgress) * 100}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
                      }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </ProgressBar>
                </>
              )}

              <AchievementFooter>
                <RarityBadge $rarity={achievement.rarity}>
                  {achievement.rarity}
                </RarityBadge>
                <XPReward>
                  <Star size={14} />
                  {achievement.xpReward} XP
                </XPReward>
              </AchievementFooter>

              {achievement.unlocked && achievement.unlockedAt && (
                <UnlockedDate>
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </UnlockedDate>
              )}
            </AchievementCard>
          ))}
        </AnimatePresence>
      </AchievementsGrid>
    </Container>
  );
};
