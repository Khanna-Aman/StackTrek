import React from 'react';
import styled from 'styled-components';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/useMediaQuery';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MainContent = styled.main<{ $isMobile: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${({ $isMobile }) => ($isMobile ? '0' : '280px')};
  transition: margin-left ${({ theme }) => theme.transitions.normal};
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]};
  max-width: 100%;
  overflow-x: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <LayoutContainer>
      <Sidebar />
      <MainContent $isMobile={isMobile}>
        <Header />
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};
