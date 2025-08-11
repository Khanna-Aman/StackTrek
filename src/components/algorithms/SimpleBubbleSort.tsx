import React, { useState } from 'react';

const SimpleBubbleSort: React.FC = () => {
  const [array, setArray] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [colorKey, setColorKey] = useState(new Array(7).fill(0));
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');

  // Pre-calculate all steps like the working example
  const generateSteps = () => {
    const steps: number[][] = [];
    const colors: number[][] = [];
    const arr = [...array];
    let colorKey = new Array(arr.length).fill(0);

    steps.push([...arr]);
    colors.push([...colorKey]);

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        // Mark elements being compared
        colorKey[j] = 1;
        colorKey[j + 1] = 1;
        steps.push([...arr]);
        colors.push([...colorKey]);

        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push([...arr]);
          colors.push([...colorKey]);
        }

        // Reset comparison colors
        colorKey[j] = 0;
        colorKey[j + 1] = 0;
      }
      // Mark sorted element
      colorKey[arr.length - 1 - i] = 2;
      steps.push([...arr]);
      colors.push([...colorKey]);
    }

    // Mark all as sorted
    colorKey.fill(2);
    colors[colors.length - 1] = [...colorKey];

    return { steps, colors };
  };

  const startSort = () => {
    setIsRunning(true);
    const { steps, colors } = generateSteps();

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setArray([...steps[stepIndex]]);
        setColorKey([...colors[stepIndex]]);
        setCurrentStep(stepIndex);
        stepIndex++;
      } else {
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 500);
  };

  const reset = () => {
    setArray([64, 34, 25, 12, 22, 11, 90]);
    setColorKey(new Array(7).fill(0));
    setCurrentStep(0);
    setIsRunning(false);
  };

  const getBarColor = (colorKey: number) => {
    if (colorKey === 1) return '#ff304f'; // comparing
    if (colorKey === 2) return '#83e85a'; // sorted
    return '#3d5af1'; // normal
  };

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '10px', margin: '20px' }}>
      <h2>Sorting Algorithm Visualization</h2>

      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedAlgorithm}
          onChange={(e) => setSelectedAlgorithm(e.target.value)}
          disabled={isRunning}
          style={{
            padding: '8px 12px',
            marginRight: '15px',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        >
          <option value="bubble">Bubble Sort</option>
          <option value="quick">Quick Sort (Coming Soon)</option>
          <option value="merge">Merge Sort (Coming Soon)</option>
          <option value="heap">Heap Sort (Coming Soon)</option>
          <option value="insertion">Insertion Sort (Coming Soon)</option>
        </select>

        <button
          onClick={startSort}
          disabled={isRunning || selectedAlgorithm !== 'bubble'}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            background: (isRunning || selectedAlgorithm !== 'bubble') ? '#ccc' : '#3d5af1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: (isRunning || selectedAlgorithm !== 'bubble') ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? 'Sorting...' : selectedAlgorithm !== 'bubble' ? 'Coming Soon' : 'Start Sort'}
        </button>

        <button
          onClick={reset}
          disabled={isRunning}
          style={{
            padding: '10px 20px',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '5px',
        alignItems: 'flex-end',
        height: '200px',
        marginBottom: '20px'
      }}>
        {array.map((value, index) => (
          <div
            key={index}
            style={{
              width: '40px',
              height: `${value * 2}px`,
              background: getBarColor(colorKey[index]),
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px 4px 0 0',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            {value}
          </div>
        ))}
      </div>

      <div style={{ fontSize: '14px', color: '#666' }}>
        <p>Step: {currentStep}</p>
        <p>Status: {isRunning ? 'Sorting...' : 'Ready'}</p>
        <div style={{ marginTop: '10px' }}>
          <span style={{ color: '#3d5af1' }}>■</span> Normal &nbsp;
          <span style={{ color: '#ff304f' }}>■</span> Comparing &nbsp;
          <span style={{ color: '#83e85a' }}>■</span> Sorted
        </div>
      </div>
    </div>
  );
};

export default SimpleBubbleSort;
