import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BarChart3,
  Database,
  Trophy,
  User,
  BookOpen,
  Gamepad2,
  Target,
  Zap,
  Code,
  Award,
  FileText,
  Shield,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useAppSelector } from '@/hooks/redux';
import { calculateWeeklyProgress } from '@/utils/weeklyProgress';

const SidebarContainer = styled.aside<{ $isMobile: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 280px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  z-index: ${({ theme }) => theme.zIndex.fixed};
  transform: ${({ $isMobile }) => ($isMobile ? 'translateX(-100%)' : 'translateX(0)')};
  transition: transform ${({ theme }) => theme.transitions.normal};
  overflow-y: auto;
`;

const Logo = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const LogoSubtext = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing[1]} 0 0 0;
`;

const Navigation = styled.nav`
  padding: ${({ theme }) => theme.spacing[4]} 0;
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const NavSectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const NavLinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  border-right: 3px solid transparent;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.primary};
    border-right-color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ProgressSection = styled.div`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProgressTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  transition: width ${({ theme }) => theme.transitions.normal};
`;

const ProgressText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const navigationItems = [
  {
    section: 'Main',
    items: [
      { to: '/', icon: Home, label: 'Home' },
    ],
  },
  {
    section: 'Learning',
    items: [
      { to: '/data-structures', icon: Database, label: 'Data Structures' },
      { to: '/tutorials', icon: BookOpen, label: 'Tutorials' },
      { to: '/algorithms', icon: Zap, label: 'Algorithms' },
      { to: '/code-examples', icon: Code, label: 'Code Examples' },
      { to: '/challenges', icon: Target, label: 'Challenges' },
    ],
  },
  {
    section: 'Community',
    items: [
      { to: '/achievements', icon: Award, label: 'Achievements' },
      { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
      { to: '/games', icon: Gamepad2, label: 'Mini Games' },
    ],
  },
  {
    section: 'Account',
    items: [{ to: '/profile', icon: User, label: 'Profile' }],
  },
  {
    section: 'About',
    items: [
      { to: '/about', icon: BookOpen, label: 'About StackTrek' },
      { to: '/terms', icon: FileText, label: 'Terms & Conditions' },
      { to: '/privacy', icon: Shield, label: 'Privacy Policy' },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const isMobile = useIsMobile();
  const user = useAppSelector(state => state.auth.user);
  const weeklyProgress = calculateWeeklyProgress(user);

  return (
    <SidebarContainer $isMobile={isMobile}>
      <Logo>
        <LogoText>StackTrek</LogoText>
        <LogoSubtext>Master data structures</LogoSubtext>
      </Logo>

      <Navigation>
        {navigationItems.map(section => (
          <NavSection key={section.section}>
            <NavSectionTitle>{section.section}</NavSectionTitle>
            <NavList>
              {section.items.map(item => (
                <NavItem key={item.to}>
                  <NavLinkStyled to={item.to}>
                    <item.icon />
                    {item.label}
                  </NavLinkStyled>
                </NavItem>
              ))}
            </NavList>
          </NavSection>
        ))}
      </Navigation>

      <ProgressSection>
        <ProgressTitle>Weekly Progress</ProgressTitle>
        <ProgressBar>
          <ProgressFill $progress={weeklyProgress.percentage} />
        </ProgressBar>
        <ProgressText>
          {weeklyProgress.percentage}% complete • {weeklyProgress.daysLeft} days left
        </ProgressText>
      </ProgressSection>
    </SidebarContainer>
  );
};
