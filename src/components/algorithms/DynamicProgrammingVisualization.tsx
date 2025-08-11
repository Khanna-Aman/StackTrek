import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[8]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  min-height: 400px;
  text-align: center;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  max-width: 500px;
  line-height: 1.6;
`;

const FeatureList = styled.ul`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: left;
  margin-top: ${({ theme }) => theme.spacing[4]};

  li {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    padding-left: ${({ theme }) => theme.spacing[2]};
    position: relative;

    &::before {
      content: '•';
      position: absolute;
      left: 0;
      color: ${({ theme }) => theme.colors.primary};
      font-weight: bold;
    }
  }
`;

export const DynamicProgrammingVisualization: React.FC = () => {
  return (
    <Container>
      <Title>Dynamic Programming - Coming Soon</Title>
      <Description>
        I'm developing interactive visualizations for dynamic programming algorithms.
        This section will feature step-by-step animations and educational content for:
      </Description>
      <FeatureList>
        <li>Fibonacci Sequence</li>
        <li>0/1 Knapsack Problem</li>
        <li>Longest Common Subsequence (LCS)</li>
        <li>Coin Change Problem</li>
        <li>Edit Distance (Levenshtein)</li>
        <li>Maximum Subarray (Kadane's Algorithm)</li>
      </FeatureList>
      <Description style={{ marginTop: '2rem', fontStyle: 'italic' }}>
        Coming in the next version
      </Description>
    </Container>
  );
};
