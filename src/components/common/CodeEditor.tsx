import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from './Button';

// Try to import syntax highlighter, fallback to basic if not available
let SyntaxHighlighter: any = null;
let syntaxThemes: any = {};

try {
  const { Prism } = require('react-syntax-highlighter');
  const { vscDarkPlus, vs } = require('react-syntax-highlighter/dist/esm/styles/prism');
  SyntaxHighlighter = Prism;
  syntaxThemes = { vscDarkPlus, vs };
} catch (error) {
  console.log('Syntax highlighter not available, using basic editor');
}
import { Play, Copy, RotateCcw, Check } from 'lucide-react';
import { useTheme } from '@/styles/ThemeProvider';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  onRun?: (code: string) => void;
  onCodeChange?: (code: string) => void;
  height?: string;
  className?: string;
}

const Container = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-left: auto;
`;

const LanguageLabel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const EditorContainer = styled.div<{ $height: string }>`
  position: relative;
  height: ${({ $height }) => $height};
  overflow: hidden;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  resize: none;
  padding: ${({ theme }) => theme.spacing[4]};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  background: transparent;

  &::selection {
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const HighlightOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;

  pre {
    margin: 0 !important;
    padding: ${({ theme }) => theme.spacing[4]} !important;
    background: transparent !important;
    font-family: ${({ theme }) => theme.fonts.mono} !important;
    font-size: ${({ theme }) => theme.fontSizes.sm} !important;
    line-height: 1.5 !important;
  }
`;

const ReadOnlyContainer = styled.div<{ $height: string }>`
  height: ${({ $height }) => $height};
  overflow: auto;

  pre {
    margin: 0 !important;
    padding: ${({ theme }) => theme.spacing[4]} !important;
    background: transparent !important;
    font-family: ${({ theme }) => theme.fonts.mono} !important;
    font-size: ${({ theme }) => theme.fontSizes.sm} !important;
    line-height: 1.5 !important;
    height: 100%;
  }
`;

const Output = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  padding: ${({ theme }) => theme.spacing[4]};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-height: 150px;
  overflow-y: auto;
`;

const defaultCode = `// Example: Array operations
const arr = [1, 2, 3, 4, 5];

// Insert element at index 2
arr.splice(2, 0, 99);
console.log('After insert:', arr);

// Delete element at index 1
arr.splice(1, 1);
console.log('After delete:', arr);

// Search for element
const index = arr.indexOf(99);
console.log('Index of 99:', index);`;

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = defaultCode,
  language = 'javascript',
  readOnly = false,
  showLineNumbers = true,
  onRun,
  onCodeChange,
  height = '300px',
  className,
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();

  const syntaxTheme = SyntaxHighlighter && syntaxThemes ?
    (isDark ? syntaxThemes.vscDarkPlus : syntaxThemes.vs) : null;

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = event.target.value;
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleRun = () => {
    if (!onRun) {
      // Simple console.log capture for demo
      const logs: string[] = [];
      const originalLog = console.log;

      console.log = (...args) => {
        logs.push(args.map(arg => String(arg)).join(' '));
      };

      try {
        // eslint-disable-next-line no-eval
        eval(code);
        setOutput(logs.join('\n') || 'Code executed successfully (no output)');
      } catch (error) {
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        console.log = originalLog;
      }
    } else {
      onRun(code);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    onCodeChange?.(initialCode);
  };

  return (
    <Container className={className}>
      <Header>
        <HeaderLeft>
          <LanguageLabel>{language.toUpperCase()}</LanguageLabel>
        </HeaderLeft>
        <HeaderRight>
          {!readOnly && onRun && (
            <Button size="xs" onClick={handleRun}>
              <Play size={14} />
              Run
            </Button>
          )}
          <Button size="xs" variant="outline" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          {!readOnly && (
            <Button size="xs" variant="ghost" onClick={handleReset}>
              <RotateCcw size={14} />
              Reset
            </Button>
          )}
        </HeaderRight>
      </Header>

      <EditorContainer $height={height}>
        {readOnly ? (
          <ReadOnlyContainer $height={height}>
            {SyntaxHighlighter && syntaxTheme ? (
              <SyntaxHighlighter
                language={language}
                style={syntaxTheme}
                showLineNumbers={showLineNumbers}
                wrapLines
                customStyle={{
                  background: 'transparent',
                  padding: '1rem',
                  margin: 0,
                }}
              >
                {code}
              </SyntaxHighlighter>
            ) : (
              <pre style={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontFamily: 'monospace',
                fontSize: '14px',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {code}
              </pre>
            )}
          </ReadOnlyContainer>
        ) : (
          <>
            {SyntaxHighlighter && syntaxTheme && (
              <HighlightOverlay>
                <SyntaxHighlighter
                  language={language}
                  style={syntaxTheme}
                  showLineNumbers={showLineNumbers}
                  wrapLines
                  customStyle={{
                    background: 'transparent',
                    padding: '1rem',
                    margin: 0,
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </HighlightOverlay>
            )}
            <TextArea
              value={code}
              onChange={handleCodeChange}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              data-gramm="false"
              style={{
                fontFamily: 'monospace',
                background: SyntaxHighlighter ? 'transparent' : undefined
              }}
            />
          </>
        )}
      </EditorContainer>

      {output && (
        <Output>
          <pre>{output}</pre>
        </Output>
      )}
    </Container>
  );
};
