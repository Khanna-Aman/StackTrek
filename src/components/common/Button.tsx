import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
        border: 1px solid ${({ theme }) => theme.colors.primary};

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primaryHover};
          border-color: ${({ theme }) => theme.colors.primaryHover};
        }

        &:focus {
          box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.secondary};
        color: white;
        border: 1px solid ${({ theme }) => theme.colors.secondary};

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.secondaryHover};
          border-color: ${({ theme }) => theme.colors.secondaryHover};
        }

        &:focus {
          box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.secondaryLight};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.primary};
        border: 1px solid ${({ theme }) => theme.colors.primary};

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primaryLight};
        }

        &:focus {
          box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.textSecondary};
        border: 1px solid transparent;

        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.backgroundSecondary};
          color: ${({ theme }) => theme.colors.text};
        }

        &:focus {
          box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
        }
      `;
    case 'danger':
      return css`
        background-color: ${({ theme }) => theme.colors.error};
        color: white;
        border: 1px solid ${({ theme }) => theme.colors.error};

        &:hover:not(:disabled) {
          background-color: #dc2626;
          border-color: #dc2626;
        }

        &:focus {
          box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.errorLight};
        }
      `;
    default:
      return css``;
  }
};

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'xs':
      return css`
        padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
        font-size: ${({ theme }) => theme.fontSizes.xs};
        border-radius: ${({ theme }) => theme.borderRadius.sm};
      `;
    case 'sm':
      return css`
        padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
        font-size: ${({ theme }) => theme.fontSizes.sm};
        border-radius: ${({ theme }) => theme.borderRadius.md};
      `;
    case 'md':
      return css`
        padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
        font-size: ${({ theme }) => theme.fontSizes.base};
        border-radius: ${({ theme }) => theme.borderRadius.md};
      `;
    case 'lg':
      return css`
        padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
        font-size: ${({ theme }) => theme.fontSizes.lg};
        border-radius: ${({ theme }) => theme.borderRadius.lg};
      `;
    case 'xl':
      return css`
        padding: ${({ theme }) => theme.spacing[5]} ${({ theme }) => theme.spacing[8]};
        font-size: ${({ theme }) => theme.fontSizes.xl};
        border-radius: ${({ theme }) => theme.borderRadius.lg};
      `;
    default:
      return css``;
  }
};

const StyledButton = styled(motion.button)<{
  $variant: string;
  $size: string;
  $fullWidth: boolean;
  $disabled: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $size }) => getSizeStyles($size)}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $disabled={disabled || loading}
      disabled={disabled || loading}
      onClick={handleClick}
      type={type}
      className={className}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
};
