import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

const Spinner = styled.div<{ $size: string; $color?: string }>`
  width: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '20px';
      case 'md':
        return '32px';
      case 'lg':
        return '48px';
      default:
        return '32px';
    }
  }};
  height: ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return '20px';
      case 'md':
        return '32px';
      case 'lg':
        return '48px';
      default:
        return '32px';
    }
  }};
  border: 3px solid ${({ theme }) => theme.colors.backgroundTertiary};
  border-top: 3px solid ${({ $color, theme }) => $color || theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color,
  className,
}) => {
  return (
    <SpinnerContainer className={className}>
      <Spinner $size={size} $color={color} />
    </SpinnerContainer>
  );
};
