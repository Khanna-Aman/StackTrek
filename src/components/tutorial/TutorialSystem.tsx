import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { ChevronLeft, ChevronRight, BookOpen, Play, CheckCircle } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  code?: string;
  highlight?: string[];
  interactive?: boolean;
}

interface TutorialSystemProps {
  title: string;
  description: string;
  steps: TutorialStep[];
  onComplete?: () => void;
  children?: React.ReactNode;
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 800px;
  gap: ${({ theme }) => theme.spacing[6]};
  height: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const VisualizationArea = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TutorialPanel = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const TutorialHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primaryLight} 0%, 
    ${({ theme }) => theme.colors.secondaryLight} 100%);
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
  font-size: ${({ theme }) => theme.fontSizes.sm};
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
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.secondary}
  );
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const StepContent = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]};
  overflow-y: auto;
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StepText = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  p {
    margin-bottom: ${({ theme }) => theme.spacing[3]};
  }

  ul {
    margin-left: ${({ theme }) => theme.spacing[4]};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
  }

  li {
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }
`;

const CodeBlock = styled.pre`
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  overflow-x: auto;
  margin: ${({ theme }) => theme.spacing[4]} 0;
  white-space: pre-wrap;
`;

const StepNavigation = styled.div`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const StepIndicator = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const InteractivePrompt = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.successLight};
  border: 1px solid ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  margin: ${({ theme }) => theme.spacing[4]} 0;
`;

const InteractiveText = styled.p`
  color: ${({ theme }) => theme.colors.success};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const TutorialSystem: React.FC<TutorialSystemProps> = ({
  title,
  description,
  steps,
  onComplete,
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNextStep = () => {
    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps(prev => new Set([...prev, currentStep]));
    } else {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      onComplete?.();
    }
  };

  const handlePreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
  };

  const currentStepData = steps[currentStep];
  const isStepCompleted = completedSteps.has(currentStep);

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
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StepTitle>{currentStepData.title}</StepTitle>

              <StepText>
                <div dangerouslySetInnerHTML={{ __html: currentStepData.content }} />
              </StepText>

              {currentStepData.code && (
                <CodeBlock>{currentStepData.code}</CodeBlock>
              )}

              {currentStepData.interactive && !isStepCompleted && (
                <InteractivePrompt
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <InteractiveText>
                    <Play size={16} />
                    Try the interactive example above to continue!
                  </InteractiveText>
                </InteractivePrompt>
              )}

              {isStepCompleted && (
                <InteractivePrompt
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <InteractiveText>
                    <CheckCircle size={16} />
                    Step completed! Great job!
                  </InteractiveText>
                </InteractivePrompt>
              )}
            </motion.div>
          </AnimatePresence>
        </StepContent>

        <StepNavigation>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousStep}
            disabled={isFirstStep}
          >
            <ChevronLeft size={16} />
            Previous
          </Button>

          <StepIndicator>
            Step {currentStep + 1} of {steps.length}
          </StepIndicator>

          <Button
            size="sm"
            onClick={handleNextStep}
            disabled={currentStepData.interactive && !isStepCompleted}
          >
            {isLastStep ? 'Complete' : 'Next'}
            {!isLastStep && <ChevronRight size={16} />}
          </Button>
        </StepNavigation>
      </TutorialPanel>
    </Container>
  );
};
