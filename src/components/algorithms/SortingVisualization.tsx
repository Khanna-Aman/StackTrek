import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/common/Button';
import { Play, Pause, RotateCcw, Shuffle, Settings } from 'lucide-react';

interface SortingItem {
  value: number;
  id: string;
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
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
  padding: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const AlgorithmSelector = styled.select`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: rgba(255, 255, 255, 0.9);
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 600;
  min-width: 160px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }

  &:hover {
    border-color: #10b981;
  }
`;

const SpeedControl = styled.input`
  width: 120px;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, #e2e8f0, #10b981);
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
    transition: all 0.3s ease;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
`;

const VisualizationArea = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  min-height: 400px;
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 2px solid rgba(255, 255, 255, 0.8);
  overflow-x: auto;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #10b981, #059669);
    border-radius: 0 0 ${({ theme }) => theme.borderRadius.xl} ${({ theme }) => theme.borderRadius.xl};
  }
`;

const SortingBar = styled(motion.div) <{
  $height: number;
  $isComparing?: boolean;
  $isSwapping?: boolean;
  $isSorted?: boolean;
}>`
  width: 32px;
  height: ${({ $height }) => Math.max($height * 2, 20)}px;
  background: ${({ $isComparing, $isSwapping, $isSorted }) => {
    if ($isSorted) return 'linear-gradient(135deg, #10b981, #059669)';
    if ($isSwapping) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    if ($isComparing) return 'linear-gradient(135deg, #ef4444, #dc2626)';
    return 'linear-gradient(135deg, #0891b2, #0e7490)';
  }};
  border-radius: 4px 4px 0 0;
  margin: 0 1px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding-bottom: 4px;
  box-shadow: ${({ $isComparing, $isSwapping }) => {
    if ($isSwapping) return '0 4px 12px rgba(245, 158, 11, 0.4)';
    if ($isComparing) return '0 4px 12px rgba(239, 68, 68, 0.4)';
    return '0 2px 8px rgba(0, 0, 0, 0.1)';
  }};
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;

  &::after {
    content: '${({ $height }) => Math.floor($height / 10)}';
    position: absolute;
    bottom: 2px;
    font-size: 10px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const StatsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const StatItem = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgba(255, 255, 255, 0.05);
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AlgorithmInfo = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick';

const algorithmInfo = {
  bubble: {
    name: 'Bubble Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.'
  },
  selection: {
    name: 'Selection Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Finds the minimum element and places it at the beginning, then repeats for the remaining elements.'
  },
  insertion: {
    name: 'Insertion Sort',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(1)',
    description: 'Builds the final sorted array one item at a time by inserting each element into its correct position.'
  },
  merge: {
    name: 'Merge Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    description: 'Divides the array into halves, sorts them separately, then merges the sorted halves.'
  },
  quick: {
    name: 'Quick Sort',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(log n)',
    description: 'Picks a pivot element and partitions the array around it, then recursively sorts the partitions.'
  }
};

export const SortingVisualization: React.FC = () => {
  const [array, setArray] = useState<SortingItem[]>([]);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(30);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const animationRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const generateRandomArray = useCallback((size: number = 20) => {
    const newArray: SortingItem[] = [];
    for (let i = 0; i < size; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 250) + 10,
        id: `item-${i}-${Date.now()}`,
      });
    }
    setArray(newArray);
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setIsComplete(false);
  }, []);

  const resetArray = () => {
    setArray(prev => prev.map(item => ({
      ...item,
      isComparing: false,
      isSwapping: false,
      isSorted: false
    })));
    setComparisons(0);
    setSwaps(0);
    setCurrentStep(0);
    setIsComplete(false);
    setIsPlaying(false);
  };

  const bubbleSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    let compCount = 0;
    let swapCount = 0;

    // Reset all states
    arr.forEach(item => {
      item.isComparing = false;
      item.isSwapping = false;
      item.isSorted = false;
    });
    setArray([...arr]);

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Check if we should stop
        if (!isPlaying) {
          return;
        }

        // Clear previous highlighting
        arr.forEach(item => {
          item.isComparing = false;
          item.isSwapping = false;
        });

        // Highlight comparing elements
        arr[j].isComparing = true;
        arr[j + 1].isComparing = true;
        setArray([...arr]);
        compCount++;
        setComparisons(compCount);

        // Wait to show comparison
        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, Math.max(200, 2000 - speed * 15));
        });

        // Check again after delay
        if (!isPlaying) {
          return;
        }

        if (arr[j].value > arr[j + 1].value) {
          // Clear comparison highlighting
          arr[j].isComparing = false;
          arr[j + 1].isComparing = false;

          // Highlight swapping elements
          arr[j].isSwapping = true;
          arr[j + 1].isSwapping = true;
          setArray([...arr]);
          swapCount++;
          setSwaps(swapCount);

          // Wait to show swap highlighting
          await new Promise(resolve => {
            timeoutRef.current = setTimeout(resolve, Math.max(200, 2000 - speed * 15));
          });

          // Perform swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);

          // Wait to show the swap result
          await new Promise(resolve => {
            timeoutRef.current = setTimeout(resolve, Math.max(200, 2000 - speed * 15));
          });
        }

        // Reset highlighting
        arr[j].isComparing = false;
        arr[j + 1].isComparing = false;
        arr[j].isSwapping = false;
        arr[j + 1].isSwapping = false;
        setArray([...arr]);
      }

      // Mark the last element of this pass as sorted
      arr[n - 1 - i].isSorted = true;
      setArray([...arr]);

      // Wait before next pass
      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, Math.max(300, 2000 - speed * 15));
      });
    }

    // Mark the first element as sorted (it's the only one left)
    arr[0].isSorted = true;
    setArray([...arr]);
    setIsComplete(true);
    setIsPlaying(false);
  }, [array, speed, isPlaying]);

  const selectionSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    let compCount = comparisons;
    let swapCount = swaps;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      arr[i].isComparing = true;

      for (let j = i + 1; j < n; j++) {
        if (!isPlaying) return;

        arr[j].isComparing = true;
        setArray([...arr]);
        compCount++;
        setComparisons(compCount);

        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, 101 - speed);
        });

        if (!isPlaying) return;

        if (arr[j].value < arr[minIdx].value) {
          if (minIdx !== i) arr[minIdx].isComparing = false;
          minIdx = j;
        } else {
          arr[j].isComparing = false;
        }
        setArray([...arr]);
      }

      if (minIdx !== i) {
        arr[i].isSwapping = true;
        arr[minIdx].isSwapping = true;
        setArray([...arr]);
        swapCount++;
        setSwaps(swapCount);

        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, 101 - speed);
        });

        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      }

      // Reset highlighting and mark as sorted
      arr[i].isComparing = false;
      arr[i].isSwapping = false;
      if (minIdx < n) {
        arr[minIdx].isComparing = false;
        arr[minIdx].isSwapping = false;
      }
      arr[i].isSorted = true;
      setArray([...arr]);
    }
    arr[n - 1].isSorted = true;
    setArray([...arr]);
    setIsComplete(true);
    setIsPlaying(false);
  }, [array, speed, isPlaying, comparisons, swaps]);

  const insertionSort = useCallback(async () => {
    const arr = [...array];
    const n = arr.length;
    let compCount = comparisons;
    let swapCount = swaps;

    arr[0].isSorted = true;
    setArray([...arr]);

    for (let i = 1; i < n; i++) {
      if (!isPlaying) return;

      let key = arr[i];
      let j = i - 1;

      key.isComparing = true;
      setArray([...arr]);

      while (j >= 0 && arr[j].value > key.value) {
        if (!isPlaying) return;

        arr[j].isComparing = true;
        setArray([...arr]);
        compCount++;
        setComparisons(compCount);

        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, 101 - speed);
        });

        if (!isPlaying) return;

        arr[j + 1] = arr[j];
        arr[j].isComparing = false;
        swapCount++;
        setSwaps(swapCount);
        j--;
        setArray([...arr]);
      }

      arr[j + 1] = key;
      key.isComparing = false;
      key.isSorted = true;
      setArray([...arr]);

      await new Promise(resolve => {
        timeoutRef.current = setTimeout(resolve, 101 - speed);
      });
    }

    setIsComplete(true);
    setIsPlaying(false);
  }, [array, speed, isPlaying, comparisons, swaps]);

  const quickSort = useCallback(async () => {
    const arr = [...array];
    let compCount = comparisons;
    let swapCount = swaps;

    const partition = async (low: number, high: number): Promise<number> => {
      if (!isPlaying) return -1;

      const pivot = arr[high];
      pivot.isComparing = true;
      let i = low - 1;

      for (let j = low; j < high; j++) {
        if (!isPlaying) return -1;

        arr[j].isComparing = true;
        setArray([...arr]);
        compCount++;
        setComparisons(compCount);

        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, 101 - speed);
        });

        if (!isPlaying) return -1;

        if (arr[j].value < pivot.value) {
          i++;
          if (i !== j) {
            arr[i].isSwapping = true;
            arr[j].isSwapping = true;
            setArray([...arr]);
            swapCount++;
            setSwaps(swapCount);

            await new Promise(resolve => {
              timeoutRef.current = setTimeout(resolve, 101 - speed);
            });

            [arr[i], arr[j]] = [arr[j], arr[i]];
            arr[i].isSwapping = false;
            arr[j].isSwapping = false;
          }
        }
        arr[j].isComparing = false;
        setArray([...arr]);
      }

      if (i + 1 !== high) {
        arr[i + 1].isSwapping = true;
        arr[high].isSwapping = true;
        setArray([...arr]);
        swapCount++;
        setSwaps(swapCount);

        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, 101 - speed);
        });

        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        arr[i + 1].isSwapping = false;
        arr[high].isSwapping = false;
      }

      pivot.isComparing = false;
      arr[i + 1].isSorted = true;
      setArray([...arr]);
      return i + 1;
    };

    const quickSortHelper = async (low: number, high: number) => {
      if (!isPlaying) return;

      if (low < high) {
        const pi = await partition(low, high);
        if (pi === -1) return; // Stopped

        await quickSortHelper(low, pi - 1);
        if (!isPlaying) return;
        await quickSortHelper(pi + 1, high);
      } else if (low === high) {
        arr[low].isSorted = true;
        setArray([...arr]);
      }
    };

    await quickSortHelper(0, arr.length - 1);

    if (isPlaying) {
      // Mark all as sorted
      arr.forEach(item => item.isSorted = true);
      setArray([...arr]);
      setIsComplete(true);
    }
    setIsPlaying(false);
  }, [array, speed, isPlaying, comparisons, swaps]);

  const mergeSort = useCallback(async () => {
    const arr = [...array];
    let compCount = comparisons;
    let swapCount = swaps;

    const merge = async (left: number, mid: number, right: number) => {
      if (!isPlaying) return;

      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        if (!isPlaying) return;

        // Highlight comparing elements
        arr[left + i].isComparing = true;
        arr[mid + 1 + j].isComparing = true;
        setArray([...arr]);
        compCount++;
        setComparisons(compCount);

        await new Promise(resolve => {
          timeoutRef.current = setTimeout(resolve, 101 - speed);
        });

        if (!isPlaying) return;

        if (leftArr[i].value <= rightArr[j].value) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
          swapCount++;
          setSwaps(swapCount);
        }

        arr[k].isComparing = false;
        k++;
        setArray([...arr]);
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        j++;
        k++;
      }

      // Mark merged section as sorted if it's the final merge
      if (left === 0 && right === arr.length - 1) {
        for (let idx = left; idx <= right; idx++) {
          arr[idx].isSorted = true;
        }
      }

      setArray([...arr]);
    };

    const mergeSortHelper = async (left: number, right: number) => {
      if (!isPlaying) return;

      if (left < right) {
        const mid = Math.floor((left + right) / 2);

        await mergeSortHelper(left, mid);
        if (!isPlaying) return;
        await mergeSortHelper(mid + 1, right);
        if (!isPlaying) return;
        await merge(left, mid, right);
      }
    };

    await mergeSortHelper(0, arr.length - 1);

    if (isPlaying) {
      // Ensure all elements are marked as sorted
      arr.forEach(item => item.isSorted = true);
      setArray([...arr]);
      setIsComplete(true);
    }
    setIsPlaying(false);
  }, [array, speed, isPlaying, comparisons, swaps]);

  const startSorting = async () => {
    if (isComplete) return;

    setIsPlaying(true);

    switch (algorithm) {
      case 'bubble':
        await bubbleSort();
        break;
      case 'selection':
      case 'insertion':
      case 'merge':
      case 'quick':
        alert('This algorithm is coming in the next version!');
        setIsPlaying(false);
        break;
      default:
        await bubbleSort();
    }
  };

  const pauseSorting = () => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  React.useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const currentAlgorithmInfo = algorithmInfo[algorithm];

  return (
    <Container>
      <ControlsSection>
        <AlgorithmSelector
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as SortingAlgorithm)}
          disabled={isPlaying}
        >
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort - Coming Soon</option>
          <option value="insertion">Insertion Sort - Coming Soon</option>
          <option value="merge">Merge Sort - Coming Soon</option>
          <option value="quick">Quick Sort - Coming Soon</option>
        </AlgorithmSelector>

        <div>
          <label>Speed: </label>
          <SpeedControl
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            disabled={isPlaying}
          />
        </div>

        <Button
          onClick={isPlaying ? pauseSorting : startSorting}
          disabled={isComplete}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause' : 'Start'}
        </Button>

        <Button variant="outline" onClick={resetArray} disabled={isPlaying}>
          <RotateCcw size={16} />
          Reset
        </Button>

        <Button variant="outline" onClick={() => generateRandomArray()} disabled={isPlaying}>
          <Shuffle size={16} />
          New Array
        </Button>
      </ControlsSection>

      <VisualizationArea>
        <AnimatePresence>
          {array.map((item) => (
            <SortingBar
              key={item.id}
              $height={item.value}
              $isComparing={item.isComparing}
              $isSwapping={item.isSwapping}
              $isSorted={item.isSorted}
              layout
              transition={{ duration: 0.3 }}
            />
          ))}
        </AnimatePresence>
      </VisualizationArea>

      <StatsPanel>
        <StatItem>
          <StatValue>{comparisons}</StatValue>
          <StatLabel>Comparisons</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{swaps}</StatValue>
          <StatLabel>Swaps</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{array.length}</StatValue>
          <StatLabel>Array Size</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue style={{ color: isComplete ? '#10b981' : isPlaying ? '#f59e0b' : '#64748b' }}>
            {isComplete ? 'Complete' : isPlaying ? 'Running' : 'Ready'}
          </StatValue>
          <StatLabel>Status</StatLabel>
        </StatItem>
      </StatsPanel>

      <AlgorithmInfo>
        <h3 style={{ marginBottom: '12px', color: 'var(--text-color)' }}>
          {currentAlgorithmInfo.name}
        </h3>
        <p style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>
          {currentAlgorithmInfo.description}
        </p>
        <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
          <span><strong>Time:</strong> {currentAlgorithmInfo.timeComplexity}</span>
          <span><strong>Space:</strong> {currentAlgorithmInfo.spaceComplexity}</span>
        </div>
      </AlgorithmInfo>
    </Container>
  );
};
