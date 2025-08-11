import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Code,
  Lightbulb,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  language?: string;
  explanation: string;
  tips?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface EnhancedTutorialSystemProps {
  title: string;
  description: string;
  steps: TutorialStep[];
  children: React.ReactNode;
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 800px;
  gap: ${({ theme }) => theme.spacing[6]};
  height: 100%;
  min-height: 600px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
`;

const VisualizationArea = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const TutorialPanel = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const TutorialHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primaryLight}, 
    ${({ theme }) => theme.colors.secondaryLight});
`;

const TutorialTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const TutorialDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const ProgressFill = styled(motion.div) <{ $progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const StepContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]};
  overflow-y: auto;
`;

const StepHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StepDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CodeBlock = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin: ${({ theme }) => theme.spacing[4]} 0;
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', monospace;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  overflow-x: auto;
`;

const CodeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Explanation = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing[4]};
  margin: ${({ theme }) => theme.spacing[4]} 0;
  border-radius: 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0;
`;

const TipsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const TipItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const ComplexityInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const ComplexityItem = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: center;
`;

const ComplexityLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ComplexityValue = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const StepIndicator = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const EnhancedTutorialSystem: React.FC<EnhancedTutorialSystemProps> = ({
  title,
  description,
  steps,
  children,
  onStepChange,
  onComplete
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  const handlePrevious = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      onStepChange?.(newStep);
    } else if (!isCompleted) {
      setIsCompleted(true);
      onComplete?.();
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsCompleted(false);
    onStepChange?.(0);
  };

  return (
    <Container>
      <VisualizationArea>
        {children}
      </VisualizationArea>

      <TutorialPanel
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <TutorialHeader>
          <TutorialTitle>
            <BookOpen size={24} />
            {title}
          </TutorialTitle>
          <TutorialDescription>{description}</TutorialDescription>
          <ProgressBar>
            <ProgressFill
              $progress={progress}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </ProgressBar>
        </TutorialHeader>

        <StepContent>
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepHeader>
                  <StepTitle>{currentStepData.title}</StepTitle>
                  <StepDescription>{currentStepData.description}</StepDescription>
                </StepHeader>

                {currentStepData.code && (
                  <CodeBlock>
                    <CodeHeader>
                      <Code size={14} />
                      {currentStepData.language || 'JavaScript'}
                    </CodeHeader>
                    <pre><code>{currentStepData.code}</code></pre>
                  </CodeBlock>
                )}

                <Explanation>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Lightbulb size={16} />
                    <strong>Explanation</strong>
                  </div>
                  {currentStepData.explanation}
                </Explanation>

                {currentStepData.tips && currentStepData.tips.length > 0 && (
                  <TipsList>
                    {currentStepData.tips.map((tip, index) => (
                      <TipItem key={index}>
                        <Lightbulb size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                        {tip}
                      </TipItem>
                    ))}
                  </TipsList>
                )}

                {(currentStepData.timeComplexity || currentStepData.spaceComplexity) && (
                  <ComplexityInfo>
                    {currentStepData.timeComplexity && (
                      <ComplexityItem>
                        <ComplexityLabel>
                          <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          Time Complexity
                        </ComplexityLabel>
                        <ComplexityValue>{currentStepData.timeComplexity}</ComplexityValue>
                      </ComplexityItem>
                    )}
                    {currentStepData.spaceComplexity && (
                      <ComplexityItem>
                        <ComplexityLabel>Space Complexity</ComplexityLabel>
                        <ComplexityValue>{currentStepData.spaceComplexity}</ComplexityValue>
                      </ComplexityItem>
                    )}
                  </ComplexityInfo>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', padding: '40px 20px' }}
              >
                <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '16px' }} />
                <h3 style={{ marginBottom: '12px' }}>Tutorial Completed!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  Great job! You've completed the {title} tutorial.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <Button variant="outline" onClick={() => navigate('/tutorials')}>
                    <ArrowLeft size={16} />
                    Back to Tutorials
                  </Button>
                  <Button onClick={handleReset}>
                    <RotateCcw size={16} />
                    Start Over
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </StepContent>

        <Controls>
          <StepIndicator>
            Step {currentStep + 1} of {steps.length}
          </StepIndicator>

          <NavigationButtons>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
              disabled={isCompleted}
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight size={16} />
            </Button>
          </NavigationButtons>
        </Controls>
      </TutorialPanel>
    </Container>
  );
};
