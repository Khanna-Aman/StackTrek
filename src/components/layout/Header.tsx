import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, User, LogIn, Zap, Trophy, AlertCircle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { toggleTheme } from '@/store/slices/themeSlice';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { LoginModal } from '@/components/auth/LoginModal';
import { UserProfile } from '@/components/user/UserProfile';
import { isFirebaseConfigured } from '@/config/firebase';
import { useNavigate } from 'react-router-dom';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchInput = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  padding-left: ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  width: 300px;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  width: 16px;
  height: 16px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const UserLevel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const NotificationButton = styled(Button)`
  position: relative;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  width: 16px;
  height: 16px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const XPDisplay = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: linear-gradient(135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const ProfileModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const NotificationDropdown = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
`;

const NotificationHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const NotificationItem = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const NotificationMessage = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyNotifications = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`;

const NotificationContainer = styled.div`
  position: relative;
`;

export const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);
  const { notifications } = useAppSelector(state => state.app);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  return (
    <HeaderContainer>
      <LeftSection>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search data structures, tutorials..."
          />
        </SearchContainer>
      </LeftSection>

      <RightSection>
        {!isFirebaseConfigured && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/setup/firebase')}
            title="Configure Firebase"
          >
            <AlertCircle size={20} />
          </Button>
        )}

        <NotificationContainer ref={notificationRef}>
          <NotificationButton
            variant="ghost"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <NotificationBadge>
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </NotificationBadge>
            )}
          </NotificationButton>

          <AnimatePresence>
            {showNotifications && (
              <NotificationDropdown
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <NotificationHeader>
                  Notifications
                </NotificationHeader>
                {notifications.length === 0 ? (
                  <EmptyNotifications>
                    No new notifications
                  </EmptyNotifications>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <NotificationItem key={notification.id}>
                      <NotificationTitle>{notification.title}</NotificationTitle>
                      <NotificationMessage>{notification.message}</NotificationMessage>
                    </NotificationItem>
                  ))
                )}
              </NotificationDropdown>
            )}
          </AnimatePresence>
        </NotificationContainer>

        {isAuthenticated && user ? (
          <>
            <XPDisplay
              onClick={() => setShowProfileModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Zap size={16} />
              {user.xp} XP
            </XPDisplay>

            <UserInfo onClick={() => setShowProfileModal(true)} style={{ cursor: 'pointer' }}>
              <UserDetails>
                <UserName>{user.username}</UserName>
                <UserLevel>Level {user.level}</UserLevel>
              </UserDetails>
              <Avatar
                src={user.avatar}
                alt={user.username}
                size="sm"
              />
            </UserInfo>
          </>
        ) : (
          <Button variant="primary" size="sm" onClick={() => setShowLoginModal(true)}>
            <LogIn size={16} />
            Sign In
          </Button>
        )}
      </RightSection>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <AnimatePresence>
        {showProfileModal && (
          <ProfileModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <UserProfile onClose={() => setShowProfileModal(false)} />
            </div>
          </ProfileModal>
        )}
      </AnimatePresence>
    </HeaderContainer>
  );
};
