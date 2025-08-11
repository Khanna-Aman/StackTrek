import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Target,
  Zap,
  Trophy,
  Code,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/common/Button';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'array' | 'stack' | 'queue' | 'tree' | 'graph' | 'sorting';
  timeLimit: number; // in seconds
  xpReward: number;
  instructions: string[];
  initialCode?: string;
  testCases: TestCase[];
  hints?: string[];
}

export interface TestCase {
  input: any;
  expectedOutput: any;
  description: string;
}

interface ChallengeSystemProps {
  challenge: Challenge;
  onComplete?: (success: boolean, timeSpent: number, score: number) => void;
  onSkip?: () => void;
}

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const ChallengeHeader = styled.div`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  color: white;
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  position: relative;
  overflow: hidden;
`;

const ChallengeTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ChallengeDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  opacity: 0.9;
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ChallengeMetadata = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: rgba(255, 255, 255, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const DifficultyBadge = styled.span<{ $difficulty: Challenge['difficulty'] }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  text-transform: uppercase;
  background: ${({ $difficulty }) => {
    switch ($difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  color: white;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
  }
`;

const InstructionsPanel = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const InstructionsList = styled.ol`
  list-style: none;
  counter-reset: instruction-counter;
  padding: 0;
  margin: 0;
`;

const InstructionItem = styled.li`
  counter-increment: instruction-counter;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  padding-left: ${({ theme }) => theme.spacing[8]};
  position: relative;
  line-height: ${({ theme }) => theme.lineHeights.relaxed};

  &::before {
    content: counter(instruction-counter);
    position: absolute;
    left: 0;
    top: 0;
    width: 24px;
    height: 24px;
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
  }
`;

const ChallengeArea = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const TimerSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const Timer = styled.div<{ $warning?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ $warning, theme }) =>
    $warning ? '#ef4444' : theme.colors.primary};
  
  ${({ $warning }) => $warning && `
    animation: ${pulseAnimation} 1s infinite;
  `}
`;

const ControlButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CodeEditor = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', monospace;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const TestResults = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  max-height: 200px;
  overflow-y: auto;
`;

const TestCase = styled.div<{ $passed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ $passed, theme }) =>
    $passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border-left: 4px solid ${({ $passed }) =>
    $passed ? '#10b981' : '#ef4444'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const CompletionModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div) <{ $success: boolean }>`
  background: ${({ $success }) =>
    $success ? 'linear-gradient(135deg, #10b981, #34d399)' :
      'linear-gradient(135deg, #ef4444, #f87171)'};
  color: white;
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
  max-width: 400px;
  width: 90%;
`;

export const ChallengeSystem: React.FC<ChallengeSystemProps> = ({
  challenge,
  onComplete,
  onSkip
}) => {
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [isRunning, setIsRunning] = useState(false);
  const [code, setCode] = useState(challenge.initialCode || '');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(challenge.timeLimit);
    setCode(challenge.initialCode || '');
    setTestResults([]);
    setIsCompleted(false);
    setShowModal(false);
  };

  const handleTimeUp = () => {
    setIsCompleted(true);
    setSuccess(false);
    setShowModal(true);
    const timeSpent = challenge.timeLimit - timeLeft;
    onComplete?.(false, timeSpent, 0);
  };

  const handleRunTests = () => {
    if (!code.trim()) {
      setTestResults([{
        id: 0,
        description: 'No code provided',
        passed: false,
        input: '',
        expected: 'Valid code implementation',
        actual: 'Empty code'
      }]);
      return;
    }

    // Basic code validation - check if code contains some implementation
    const hasImplementation = code.includes('function') ||
      code.includes('def ') ||
      code.includes('class ') ||
      code.includes('return') ||
      code.includes('console.log') ||
      code.includes('print(');

    if (!hasImplementation) {
      setTestResults([{
        id: 0,
        description: 'Code validation failed',
        passed: false,
        input: '',
        expected: 'Valid function implementation',
        actual: 'No valid implementation found'
      }]);
      return;
    }

    // For now, show that tests need actual implementation
    const results = challenge.testCases.map((testCase, index) => {
      return {
        id: index,
        description: testCase.description,
        passed: false,
        input: testCase.input,
        expected: testCase.expectedOutput,
        actual: '🚧 Code compiler coming in next version! This is a test version.'
      };
    });

    setTestResults(results);

    // Don't automatically pass - require actual implementation
    // In a real system, you would execute the code against test cases
  };

  const isWarning = timeLeft <= 60 && isRunning;

  return (
    <>
      <Container>
        <ChallengeHeader>
          <ChallengeTitle>{challenge.title}</ChallengeTitle>
          <ChallengeDescription>{challenge.description}</ChallengeDescription>
          <ChallengeMetadata>
            <MetadataItem>
              <Target size={16} />
              <DifficultyBadge $difficulty={challenge.difficulty}>
                {challenge.difficulty}
              </DifficultyBadge>
            </MetadataItem>
            <MetadataItem>
              <Clock size={16} />
              {Math.floor(challenge.timeLimit / 60)} minutes
            </MetadataItem>
            <MetadataItem>
              <Star size={16} />
              {challenge.xpReward} XP
            </MetadataItem>
          </ChallengeMetadata>
        </ChallengeHeader>

        <MainContent>
          <InstructionsPanel>
            <SectionTitle>
              <Code size={20} />
              Instructions
            </SectionTitle>
            <InstructionsList>
              {challenge.instructions.map((instruction, index) => (
                <InstructionItem key={index}>{instruction}</InstructionItem>
              ))}
            </InstructionsList>
          </InstructionsPanel>

          <ChallengeArea>
            <TimerSection>
              <Timer $warning={isWarning}>
                <Clock size={20} />
                {formatTime(timeLeft)}
              </Timer>
              <ControlButtons>
                {!isRunning ? (
                  <Button size="sm" onClick={handleStart} disabled={isCompleted}>
                    <Play size={16} />
                    Start
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={handlePause}>
                    <Pause size={16} />
                    Pause
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RotateCcw size={16} />
                  Reset
                </Button>
              </ControlButtons>
            </TimerSection>

            <div>
              <SectionTitle>Your Solution</SectionTitle>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                ℹ️ <strong>Note:</strong> Code compiler and execution will be implemented in the next version.
                This is currently a test version for UI demonstration.
              </div>
              <CodeEditor
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your solution here... (Code compiler coming in next version - this is a test version)"
                disabled={!isRunning}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <Button onClick={handleRunTests} disabled={!isRunning || !code.trim()}>
                <Zap size={16} />
                Run Tests
              </Button>
              <Button variant="outline" onClick={onSkip}>
                Skip Challenge
                <ArrowRight size={16} />
              </Button>
            </div>

            {testResults.length > 0 && (
              <div>
                <SectionTitle>Test Results</SectionTitle>
                <TestResults>
                  {testResults.map((result) => (
                    <TestCase key={result.id} $passed={result.passed}>
                      {result.passed ? (
                        <CheckCircle size={16} color="#10b981" />
                      ) : (
                        <XCircle size={16} color="#ef4444" />
                      )}
                      <span>{result.description}</span>
                    </TestCase>
                  ))}
                </TestResults>
              </div>
            )}
          </ChallengeArea>
        </MainContent>
      </Container>

      {/* Completion Modal */}
      <AnimatePresence>
        {showModal && (
          <CompletionModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              $success={success}
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
            >
              {success ? (
                <>
                  <Trophy size={64} style={{ marginBottom: '16px' }} />
                  <h2 style={{ marginBottom: '12px' }}>Challenge Complete!</h2>
                  <p style={{ marginBottom: '24px' }}>
                    Great job! You've earned {challenge.xpReward} XP.
                  </p>
                </>
              ) : (
                <>
                  <Clock size={64} style={{ marginBottom: '16px' }} />
                  <h2 style={{ marginBottom: '12px' }}>Time's Up!</h2>
                  <p style={{ marginBottom: '24px' }}>
                    Don't worry, you can try again anytime.
                  </p>
                </>
              )}
              <Button onClick={() => setShowModal(false)}>
                Continue
              </Button>
            </ModalContent>
          </CompletionModal>
        )}
      </AnimatePresence>
    </>
  );
};
