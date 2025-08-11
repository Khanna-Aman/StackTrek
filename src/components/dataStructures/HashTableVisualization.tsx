import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Plus, Minus, RotateCcw, Search, Hash } from 'lucide-react';

interface HashEntry {
  key: string;
  value: string;
  id: string;
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
  width: 100px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const HashTableContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  max-height: 500px;
  overflow-y: auto;
`;

const HashBucket = styled.div<{ $highlighted?: boolean }>`
  background-color: ${({ theme, $highlighted }) =>
    $highlighted ? theme.colors.primaryLight : theme.colors.surface};
  border: 2px solid ${({ theme, $highlighted }) =>
    $highlighted ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  transition: all ${({ theme }) => theme.transitions.normal};
`;

const BucketHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const BucketIndex = styled.div`
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}, 
    ${({ theme }) => theme.colors.secondary});
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;

const EntryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const HashEntryElement = styled(motion.div) <{ $found?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme, $found }) =>
    $found ? '#10b981' : theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme, $found }) =>
    $found ? '#059669' : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ $found }) => $found ? 'white' : 'inherit'};
  transition: all ${({ theme }) => theme.transitions.normal};
`;

const KeyValue = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const Key = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
`;

const Value = styled.span`
  opacity: 0.8;
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const EmptyBucket = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
  text-align: center;
  padding: ${({ theme }) => theme.spacing[2]};
`;

const InfoPanel = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HashFunction = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const HashTableVisualization: React.FC = () => {
  const [hashTable, setHashTable] = useState<(HashEntry[])[]>(Array(8).fill(null).map(() => []));
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [highlightedBucket, setHighlightedBucket] = useState<number | null>(null);
  const [foundEntry, setFoundEntry] = useState<string | null>(null);

  const TABLE_SIZE = 8;

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Simple hash function
  const hashFunction = useCallback((key: string): number => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash + key.charCodeAt(i)) % TABLE_SIZE;
    }
    return hash;
  }, []);

  const handleInsert = () => {
    if (!keyInput.trim() || !valueInput.trim()) return;

    const index = hashFunction(keyInput);
    const newEntry: HashEntry = {
      key: keyInput,
      value: valueInput,
      id: generateId()
    };

    setHashTable(prev => {
      const newTable = [...prev];
      // Check if key already exists and update it
      const existingIndex = newTable[index].findIndex(entry => entry.key === keyInput);
      if (existingIndex !== -1) {
        newTable[index][existingIndex] = newEntry;
      } else {
        newTable[index] = [...newTable[index], newEntry];
      }
      return newTable;
    });

    setHighlightedBucket(index);
    setTimeout(() => setHighlightedBucket(null), 1000);
    setKeyInput('');
    setValueInput('');
  };

  const handleDelete = () => {
    if (!keyInput.trim()) return;

    const index = hashFunction(keyInput);
    setHashTable(prev => {
      const newTable = [...prev];
      newTable[index] = newTable[index].filter(entry => entry.key !== keyInput);
      return newTable;
    });

    setHighlightedBucket(index);
    setTimeout(() => setHighlightedBucket(null), 1000);
    setKeyInput('');
  };

  const handleSearch = () => {
    if (!searchKey.trim()) return;

    const index = hashFunction(searchKey);
    const bucket = hashTable[index];
    const found = bucket.find(entry => entry.key === searchKey);

    setHighlightedBucket(index);
    if (found) {
      setFoundEntry(found.id);
      setTimeout(() => {
        setFoundEntry(null);
        setHighlightedBucket(null);
      }, 2000);
    } else {
      setTimeout(() => setHighlightedBucket(null), 1000);
    }
  };

  const handleClear = () => {
    setHashTable(Array(TABLE_SIZE).fill(null).map(() => []));
    setKeyInput('');
    setValueInput('');
    setSearchKey('');
    setHighlightedBucket(null);
    setFoundEntry(null);
  };

  const getTotalEntries = () => {
    return hashTable.reduce((total, bucket) => total + bucket.length, 0);
  };

  const getLoadFactor = () => {
    return (getTotalEntries() / TABLE_SIZE).toFixed(2);
  };

  return (
    <Container>
      <ControlsSection>
        <InputGroup>
          <Input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Key"
          />
          <Input
            type="text"
            value={valueInput}
            onChange={(e) => setValueInput(e.target.value)}
            placeholder="Value"
          />
          <Button size="sm" onClick={handleInsert}>
            <Plus size={16} />
            Insert
          </Button>
          <Button size="sm" variant="outline" onClick={handleDelete}>
            <Minus size={16} />
            Delete
          </Button>
        </InputGroup>

        <InputGroup>
          <Input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            placeholder="Search key"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button size="sm" variant="outline" onClick={handleSearch}>
            <Search size={16} />
            Search
          </Button>
        </InputGroup>

        <Button size="sm" variant="outline" onClick={handleClear}>
          <RotateCcw size={16} />
          Clear
        </Button>
      </ControlsSection>

      <HashFunction>
        <Hash size={16} />
        Hash Function: hash(key) = (sum of char codes) % {TABLE_SIZE}
        <span style={{ marginLeft: 'auto' }}>
          Load Factor: {getLoadFactor()} | Entries: {getTotalEntries()}
        </span>
      </HashFunction>

      <HashTableContainer>
        {hashTable.map((bucket, index) => (
          <HashBucket key={index} $highlighted={highlightedBucket === index}>
            <BucketHeader>
              <BucketIndex>{index}</BucketIndex>
              Bucket {index}
            </BucketHeader>
            <EntryList>
              <AnimatePresence>
                {bucket.length > 0 ? (
                  bucket.map((entry) => (
                    <HashEntryElement
                      key={entry.id}
                      $found={foundEntry === entry.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <KeyValue>
                        <Key>{entry.key}</Key>
                        <Value>{entry.value}</Value>
                      </KeyValue>
                    </HashEntryElement>
                  ))
                ) : (
                  <EmptyBucket>Empty</EmptyBucket>
                )}
              </AnimatePresence>
            </EntryList>
          </HashBucket>
        ))}
      </HashTableContainer>

      <InfoPanel>
        <strong>Hash Table:</strong> A data structure that maps keys to values using a hash function.
        Provides average O(1) time complexity for insert, delete, and search operations.
        <br />
        <strong>Collision Handling:</strong> This implementation uses chaining (linked lists) to handle collisions.
        When multiple keys hash to the same index, they are stored in the same bucket.
      </InfoPanel>
    </Container>
  );
};
