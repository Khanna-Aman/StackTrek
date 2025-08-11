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

export const GraphAlgorithmsVisualization: React.FC = () => {
  return (
    <Container>
      <Title>Graph Algorithms - Coming Soon</Title>
      <Description>
        I'm working hard to bring you interactive visualizations of graph algorithms.
        This section will include step-by-step animations and educational content for:
      </Description>
      <FeatureList>
        <li>Breadth-First Search (BFS)</li>
        <li>Depth-First Search (DFS)</li>
        <li>Dijkstra's Shortest Path</li>
        <li>A* Pathfinding Algorithm</li>
        <li>Minimum Spanning Tree (MST)</li>
        <li>Topological Sorting</li>
      </FeatureList>
      <Description style={{ marginTop: '2rem', fontStyle: 'italic' }}>
        Stay tuned for the next version
      </Description>
    </Container>
  );
};
