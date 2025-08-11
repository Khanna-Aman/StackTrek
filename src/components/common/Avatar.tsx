import React from 'react';
import styled from 'styled-components';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const getSizeStyles = (size: string) => {
  switch (size) {
    case 'xs':
      return '24px';
    case 'sm':
      return '32px';
    case 'md':
      return '40px';
    case 'lg':
      return '48px';
    case 'xl':
      return '64px';
    default:
      return '40px';
  }
};

const AvatarContainer = styled.div<{ $size: string }>`
  width: ${({ $size }) => getSizeStyles($size)};
  height: ${({ $size }) => getSizeStyles($size)};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarFallback = styled.div<{ $size: string }>`
  color: ${({ theme }) => theme.colors.textMuted};
  
  svg {
    width: ${({ $size }) => {
      const size = getSizeStyles($size);
      return `calc(${size} * 0.6)`;
    }};
    height: ${({ $size }) => {
      const size = getSizeStyles($size);
      return `calc(${size} * 0.6)`;
    }};
  }
`;

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'User avatar',
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <AvatarContainer $size={size} className={className}>
      {src && !imageError ? (
        <AvatarImage
          src={src}
          alt={alt}
          onError={handleImageError}
        />
      ) : (
        <AvatarFallback $size={size}>
          <User />
        </AvatarFallback>
      )}
    </AvatarContainer>
  );
};
