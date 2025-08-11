import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, RotateCcw, GitBranch, ArrowRight } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight?: number;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ControlsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const InputGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  width: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const GraphContainer = styled.div`
  position: relative;
  height: 400px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  cursor: crosshair;
`;

const GraphSvg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const NodeElement = styled(motion.div)<{ $selected?: boolean }>`
  position: absolute;
  width: 40px;
  height: 40px;
  background: ${({ theme, $selected }) => 
    $selected ? theme.colors.primary : 
    `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.secondaryLight})`};
  color: ${({ $selected }) => $selected ? 'white' : 'inherit'};
  border: 2px solid ${({ theme, $selected }) => 
    $selected ? theme.colors.primaryHover : theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  user-select: none;
  transform: translate(-50%, -50%);
  box-shadow: ${({ theme }) => theme.shadows.sm};
  pointer-events: auto;

  &:hover {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const EdgeLine = styled.line`
  stroke: ${({ theme }) => theme.colors.border};
  stroke-width: 2;
  marker-end: url(#arrowhead);
`;

const EdgeWeight = styled.text`
  fill: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
`;

const ModeSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ModeButton = styled(Button)<{ $active: boolean }>`
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? 'white' : theme.colors.textSecondary};
`;

const InfoPanel = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AdjacencyList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const AdjacencyItem = styled.div`
  padding: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

type Mode = 'add-node' | 'add-edge' | 'delete';

export const GraphVisualization: React.FC = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [mode, setMode] = useState<Mode>('add-node');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeLabel, setNodeLabel] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('');

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (mode !== 'add-node') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const label = nodeLabel || `${nodes.length + 1}`;
    const newNode: GraphNode = {
      id: generateId(),
      label,
      x,
      y
    };

    setNodes(prev => [...prev, newNode]);
    setNodeLabel('');
  };

  const handleNodeClick = (nodeId: string) => {
    if (mode === 'delete') {
      setNodes(prev => prev.filter(n => n.id !== nodeId));
      setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
      return;
    }

    if (mode === 'add-edge') {
      if (!selectedNode) {
        setSelectedNode(nodeId);
      } else if (selectedNode !== nodeId) {
        const weight = edgeWeight ? parseInt(edgeWeight) : undefined;
        const newEdge: GraphEdge = {
          id: generateId(),
          from: selectedNode,
          to: nodeId,
          weight
        };
        setEdges(prev => [...prev, newEdge]);
        setSelectedNode(null);
        setEdgeWeight('');
      }
    }
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setNodeLabel('');
    setEdgeWeight('');
  };

  const getAdjacencyList = () => {
    const adjacency: { [key: string]: string[] } = {};
    
    nodes.forEach(node => {
      adjacency[node.label] = [];
    });

    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (fromNode && toNode) {
        adjacency[fromNode.label].push(toNode.label);
      }
    });

    return adjacency;
  };

  const renderEdges = () => {
    return edges.map(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (!fromNode || !toNode) return null;

      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;

      return (
        <g key={edge.id}>
          <EdgeLine
            x1={fromNode.x}
            y1={fromNode.y}
            x2={toNode.x}
            y2={toNode.y}
          />
          {edge.weight && (
            <EdgeWeight x={midX} y={midY - 10}>
              {edge.weight}
            </EdgeWeight>
          )}
        </g>
      );
    });
  };

  const adjacencyList = getAdjacencyList();

  return (
    <Container>
      <ControlsSection>
        <ModeSelector>
          <ModeButton
            size="sm"
            $active={mode === 'add-node'}
            onClick={() => setMode('add-node')}
          >
            Add Node
          </ModeButton>
          <ModeButton
            size="sm"
            $active={mode === 'add-edge'}
            onClick={() => setMode('add-edge')}
          >
            Add Edge
          </ModeButton>
          <ModeButton
            size="sm"
            $active={mode === 'delete'}
            onClick={() => setMode('delete')}
          >
            Delete
          </ModeButton>
        </ModeSelector>

        {mode === 'add-node' && (
          <InputGroup>
            <Input
              type="text"
              value={nodeLabel}
              onChange={(e) => setNodeLabel(e.target.value)}
              placeholder="Node label"
            />
          </InputGroup>
        )}

        {mode === 'add-edge' && (
          <InputGroup>
            <Input
              type="number"
              value={edgeWeight}
              onChange={(e) => setEdgeWeight(e.target.value)}
              placeholder="Weight"
            />
            {selectedNode && <span>Select target node</span>}
          </InputGroup>
        )}

        <Button size="sm" variant="outline" onClick={handleClear}>
          <RotateCcw size={16} />
          Clear
        </Button>
      </ControlsSection>

      <GraphContainer onClick={handleContainerClick}>
        <GraphSvg>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="currentColor"
              />
            </marker>
          </defs>
          {renderEdges()}
        </GraphSvg>

        <AnimatePresence>
          {nodes.map(node => (
            <NodeElement
              key={node.id}
              $selected={selectedNode === node.id}
              style={{ left: node.x, top: node.y }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(node.id);
              }}
            >
              {node.label}
            </NodeElement>
          ))}
        </AnimatePresence>
      </GraphContainer>

      <InfoPanel>
        <strong>Graph:</strong> A collection of vertices (nodes) connected by edges. 
        This implementation shows a directed graph where edges have direction.
        <br />
        <strong>Instructions:</strong> Click to add nodes, select "Add Edge" mode and click two nodes to connect them.
        
        {Object.keys(adjacencyList).length > 0 && (
          <>
            <br /><br />
            <strong>Adjacency List:</strong>
            <AdjacencyList>
              {Object.entries(adjacencyList).map(([node, neighbors]) => (
                <AdjacencyItem key={node}>
                  <strong>{node}:</strong> [{neighbors.join(', ')}]
                </AdjacencyItem>
              ))}
            </AdjacencyList>
          </>
        )}
      </InfoPanel>
    </Container>
  );
};
