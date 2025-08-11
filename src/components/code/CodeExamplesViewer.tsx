import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/common/Button';

export interface CodeExample {
  language: string;
  code: string;
  description?: string;
  complexity?: {
    time: string;
    space: string;
  };
}

interface CodeExamplesViewerProps {
  title: string;
  description: string;
  examples: CodeExample[];
}

const Container = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primaryLight}, 
    ${({ theme }) => theme.colors.secondaryLight});
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const LanguageTabs = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
`;

const LanguageTab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.background : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  border-bottom: 2px solid ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  white-space: nowrap;

  &:hover {
    background: ${({ $active, theme }) =>
    $active ? theme.colors.background : theme.colors.backgroundTertiary};
  }
`;

const CodeContainer = styled.div`
  position: relative;
`;

const CodeBlock = styled.pre`
  margin: 0;
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'JetBrains Mono', 'Monaco', 'Menlo', monospace;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
  overflow-x: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const CodeActions = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ActionButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing[2]};
  min-width: auto;
`;

const CodeInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoLabel = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoValue = styled.span`
  font-family: 'JetBrains Mono', monospace;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const CodeDescription = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.relaxed};
`;

const LanguageIcon = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ color }) => color || '#6b7280'};
`;

const languageColors: { [key: string]: string } = {
  javascript: '#f7df1e',
  python: '#3776ab',
  java: '#ed8b00',
  'c++': '#00599c',
  typescript: '#3178c6',
  go: '#00add8',
  rust: '#000000',
  php: '#777bb4',
  ruby: '#cc342d',
  swift: '#fa7343'
};

export const CodeExamplesViewer: React.FC<CodeExamplesViewerProps> = ({
  title,
  description,
  examples
}) => {
  const [activeLanguage, setActiveLanguage] = useState(examples[0]?.language || '');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeExample = examples.find(ex => ex.language === activeLanguage) || examples[0];

  const handleCopyCode = async () => {
    if (activeExample) {
      try {
        await navigator.clipboard.writeText(activeExample.code);
        setCopiedCode(activeExample.language);
        setTimeout(() => setCopiedCode(null), 2000);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    }
  };

  const handleDownloadCode = () => {
    if (activeExample) {
      const fileExtensions: { [key: string]: string } = {
        javascript: 'js',
        python: 'py',
        java: 'java',
        'c++': 'cpp',
        typescript: 'ts',
        go: 'go',
        rust: 'rs',
        php: 'php',
        ruby: 'rb',
        swift: 'swift'
      };

      const extension = fileExtensions[activeExample.language.toLowerCase()] || 'txt';
      const filename = `${title.toLowerCase().replace(/\s+/g, '_')}.${extension}`;

      const blob = new Blob([activeExample.code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const openInPlayground = () => {
    const playgroundUrls: { [key: string]: string } = {
      javascript: 'https://codepen.io/pen/',
      python: 'https://repl.it/languages/python3',
      java: 'https://repl.it/languages/java',
      typescript: 'https://www.typescriptlang.org/play'
    };

    const url = playgroundUrls[activeExample?.language.toLowerCase()];
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <Container>
      <Header>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Header>

      <LanguageTabs>
        {examples.map((example) => (
          <LanguageTab
            key={example.language}
            $active={activeLanguage === example.language}
            onClick={() => setActiveLanguage(example.language)}
          >
            <LanguageIcon color={languageColors[example.language.toLowerCase()]} />
            {example.language}
          </LanguageTab>
        ))}
      </LanguageTabs>

      <CodeContainer>
        <CodeActions>
          <ActionButton
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            title="Copy code"
          >
            {copiedCode === activeExample?.language ? (
              <Check size={16} />
            ) : (
              <Copy size={16} />
            )}
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="sm"
            onClick={handleDownloadCode}
            title="Download code"
          >
            <Download size={16} />
          </ActionButton>
          {['javascript', 'python', 'java', 'typescript'].includes(
            activeExample?.language.toLowerCase()
          ) && (
              <ActionButton
                variant="ghost"
                size="sm"
                onClick={openInPlayground}
                title="Open in playground"
              >
                <ExternalLink size={16} />
              </ActionButton>
            )}
        </CodeActions>

        <AnimatePresence mode="wait">
          {activeExample && (
            <motion.div
              key={activeExample.language}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <CodeBlock>
                <code>{activeExample.code}</code>
              </CodeBlock>
            </motion.div>
          )}
        </AnimatePresence>
      </CodeContainer>

      {activeExample && (
        <CodeInfo>
          {activeExample.description && (
            <CodeDescription>{activeExample.description}</CodeDescription>
          )}

          {activeExample.complexity && (
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Time Complexity:</InfoLabel>
                <InfoValue>{activeExample.complexity.time}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Space Complexity:</InfoLabel>
                <InfoValue>{activeExample.complexity.space}</InfoValue>
              </InfoItem>
            </InfoGrid>
          )}
        </CodeInfo>
      )}
    </Container>
  );
};
