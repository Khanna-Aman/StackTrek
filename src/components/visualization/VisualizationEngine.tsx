import React, { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setAnimationSpeed, nextStep, previousStep, setStep } from '@/store/slices/gameSlice';

interface VisualizationEngineProps {
  width?: number;
  height?: number;
  data: any[];
  operations: Operation[];
  currentStep: number;
  onStepChange?: (step: number) => void;
  className?: string;
}

interface Operation {
  id: string;
  type: string;
  description: string;
  data: any;
  highlight?: string[];
  animate?: boolean;
}

const VisualizationContainer = styled.div<{ $width: number; $height: number }>`
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SVGContainer = styled.svg`
  width: 100%;
  height: 100%;
  display: block;
`;

const ControlsOverlay = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  box-shadow: ${({ theme }) => theme.shadows.md};
  z-index: 10;
`;

const ControlButton = styled.button<{ $disabled?: boolean }>`
  background-color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.backgroundTertiary : theme.colors.primary};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.textMuted : 'white'};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[2]};
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.fast};
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StepIndicator = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 ${({ theme }) => theme.spacing[3]};
  white-space: nowrap;
`;

const SpeedControl = styled.select`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const VisualizationEngine: React.FC<VisualizationEngineProps> = ({
  width = 800,
  height = 400,
  data,
  operations,
  currentStep,
  onStepChange,
  className,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dispatch = useAppDispatch();
  const { animationSpeed } = useAppSelector(state => state.game);

  // Animation duration based on speed setting
  const getAnimationDuration = useCallback(() => {
    switch (animationSpeed) {
      case 0.5: return 1000; // Slow
      case 1: return 500;    // Normal
      case 2: return 250;    // Fast
      default: return 500;
    }
  }, [animationSpeed]);

  // Initialize SVG
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous content

    // Set up SVG groups
    svg.append('g').attr('class', 'background');
    svg.append('g').attr('class', 'data-elements');
    svg.append('g').attr('class', 'labels');
    svg.append('g').attr('class', 'animations');

  }, [width, height]);

  // Render current step
  useEffect(() => {
    if (!svgRef.current || !operations[currentStep]) return;

    const svg = d3.select(svgRef.current);
    const operation = operations[currentStep];
    const duration = getAnimationDuration();

    // Clear previous highlights
    svg.selectAll('.highlight').classed('highlight', false);

    // Apply operation-specific rendering
    renderOperation(svg, operation, data, duration);

    // Highlight specified elements
    if (operation.highlight) {
      operation.highlight.forEach(selector => {
        svg.selectAll(selector).classed('highlight', true);
      });
    }

  }, [currentStep, operations, data, getAnimationDuration]);

  const renderOperation = (svg: any, operation: Operation, data: any[], duration: number) => {
    // This will be implemented by specific data structure components
    // Base implementation for common elements

    const dataGroup = svg.select('.data-elements');

    // Basic element rendering (will be overridden by specific implementations)
    const elements = dataGroup.selectAll('.data-element')
      .data(data)
      .join('g')
      .attr('class', 'data-element');

    if (operation.animate) {
      elements.transition()
        .duration(duration)
        .ease(d3.easeQuadInOut);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      dispatch(previousStep());
      onStepChange?.(newStep);
    }
  };

  const handleNextStep = () => {
    if (currentStep < operations.length - 1) {
      const newStep = currentStep + 1;
      dispatch(nextStep());
      onStepChange?.(newStep);
    }
  };

  const handleStepChange = (step: number) => {
    dispatch(setStep(step));
    onStepChange?.(step);
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const speed = parseFloat(event.target.value);
    dispatch(setAnimationSpeed(speed));
  };

  return (
    <VisualizationContainer $width={width} $height={height} className={className}>
      <SVGContainer ref={svgRef} />

      <ControlsOverlay>
        <ControlButton
          onClick={handlePreviousStep}
          $disabled={currentStep === 0}
          title="Previous Step"
        >
          ←
        </ControlButton>

        <StepIndicator>
          Step {currentStep + 1} of {operations.length}
        </StepIndicator>

        <ControlButton
          onClick={handleNextStep}
          $disabled={currentStep === operations.length - 1}
          title="Next Step"
        >
          →
        </ControlButton>

        <SpeedControl
          value={animationSpeed}
          onChange={handleSpeedChange}
          title="Animation Speed"
        >
          <option value={0.5}>Slow</option>
          <option value={1}>Normal</option>
          <option value={2}>Fast</option>
        </SpeedControl>
      </ControlsOverlay>
    </VisualizationContainer>
  );
};
