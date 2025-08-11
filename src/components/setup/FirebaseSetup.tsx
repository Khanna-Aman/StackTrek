import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ExternalLink, Copy, Check, AlertCircle, Settings } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { isFirebaseConfigured } from '@/config/firebase';

const SetupContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const SetupCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SetupHeader = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const SetupTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const SetupDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const StatusBadge = styled.div<{ $configured: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background-color: ${({ theme, $configured }) =>
    $configured ? theme.colors.success : theme.colors.warning};
  color: white;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SecurityWarning = styled.div`
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
  color: #92400e;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const StepList = styled.ol`
  list-style: none;
  counter-reset: step-counter;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StepItem = styled.li`
  counter-increment: step-counter;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  position: relative;
  padding-left: ${({ theme }) => theme.spacing[12]};

  &::before {
    content: counter(step-counter);
    position: absolute;
    left: 0;
    top: 0;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, 
      ${({ theme }) => theme.colors.primary}, 
      ${({ theme }) => theme.colors.secondary});
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
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
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const CodeBlock = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  margin: ${({ theme }) => theme.spacing[3]} 0;
`;

const CopyButton = styled(Button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing[2]};
  right: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing[8]};
`;

export const FirebaseSetup: React.FC = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const envTemplate = `# Firebase Configuration
VITE_FIREBASE_API_KEY="your_api_key_here"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"`;

  return (
    <SetupContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SetupCard>
        <SetupHeader>
          <SetupTitle>
            <Settings size={32} />
            Firebase Setup
          </SetupTitle>
          <SetupDescription>
            Configure Firebase to enable authentication and user profiles (optional for StackTrek)
          </SetupDescription>
          {!isFirebaseConfigured && (
            <SecurityWarning>
              ⚠️ <strong>Security Notice:</strong> When setting up Firebase, ensure you use production mode and proper security rules. Never use test mode in production!
            </SecurityWarning>
          )}
          <StatusBadge $configured={isFirebaseConfigured}>
            {isFirebaseConfigured ? (
              <>
                <Check size={16} />
                Firebase Configured
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                Firebase Not Configured
              </>
            )}
          </StatusBadge>
        </SetupHeader>

        {!isFirebaseConfigured && (
          <>
            <StepList>
              <StepItem>
                <StepTitle>Create Firebase Project</StepTitle>
                <StepDescription>
                  Go to the Firebase Console and create a new project for your StackTrek application.
                </StepDescription>
                <Button
                  variant="outline"
                  onClick={() => window.open('https://console.firebase.google.com/', '_blank')}
                >
                  <ExternalLink size={16} />
                  Open Firebase Console
                </Button>
              </StepItem>

              <StepItem>
                <StepTitle>Enable Authentication</StepTitle>
                <StepDescription>
                  In your Firebase project, go to Authentication → Sign-in method and enable:
                  Email/Password, Google, and GitHub providers.
                </StepDescription>
              </StepItem>

              <StepItem>
                <StepTitle>Get Configuration</StepTitle>
                <StepDescription>
                  In Project Settings → General → Your apps, register a web app and copy the configuration.
                </StepDescription>
              </StepItem>

              <StepItem>
                <StepTitle>Update Environment Variables</StepTitle>
                <StepDescription>
                  Create or update your .env file with your Firebase configuration:
                </StepDescription>
                <CodeBlock>
                  {envTemplate}
                  <CopyButton
                    variant="ghost"
                    size="xs"
                    onClick={() => handleCopy(envTemplate, 'env')}
                  >
                    {copiedText === 'env' ? <Check size={14} /> : <Copy size={14} />}
                  </CopyButton>
                </CodeBlock>
              </StepItem>

              <StepItem>
                <StepTitle>Setup Firestore Database</StepTitle>
                <StepDescription>
                  Create a Firestore database in test mode and configure security rules for user data.
                </StepDescription>
              </StepItem>
            </StepList>

            <ActionButtons>
              <Button
                variant="outline"
                onClick={() => window.open('/firebase-setup.md', '_blank')}
              >
                <ExternalLink size={16} />
                Detailed Setup Guide
              </Button>
              <Button
                onClick={() => window.location.reload()}
              >
                Check Configuration
              </Button>
            </ActionButtons>
          </>
        )}

        {isFirebaseConfigured && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
              🎉 Firebase is properly configured! You can now use authentication and cloud features.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </SetupCard>
    </SetupContainer>
  );
};
