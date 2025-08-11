import React, { useState, useEffect, useRef } from 'react';

const SimpleLinearSearch: React.FC = () => {
  const [target, setTarget] = useState<string>('');
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [found, setFound] = useState(false);
  const [message, setMessage] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const values = [5, 8, 12, 15, 23, 27, 33, 39, 41, 50, 62, 70, 75, 80, 85, 90, 95];

  const startSearch = () => {
    if (target === '') return;

    // Reset state
    setIndex(0);
    setFound(false);
    setStarted(true);
    setMessage('');

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start the search animation
    let currentIndex = 0;
    let searchFound = false;

    intervalRef.current = setInterval(() => {
      if (searchFound || currentIndex >= values.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        return;
      }

      setIndex(currentIndex);

      if (values[currentIndex] === parseInt(target)) {
        searchFound = true;
        setFound(true);
        setMessage(`Found at index ${currentIndex}`);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        currentIndex++;
        if (currentIndex >= values.length) {
          setMessage('Not found');
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }
    }, 800); // 800ms delay between steps
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setStarted(false);
    setIndex(0);
    setFound(false);
    setMessage('');
    setTarget('');
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getElementColor = (i: number) => {
    if (started && i === index && !found) {
      return '#ffcc00'; // Yellow: currently checking
    } else if (found && i === index) {
      return '#00ff00'; // Green: found
    } else if (started && i < index) {
      return '#ffcccc'; // Light red: already checked
    } else {
      return '#f0f0f0'; // Default gray
    }
  };

  const getMessageColor = () => {
    if (message.includes('Found')) return 'green';
    if (message.includes('Not found')) return 'red';
    return 'black';
  };

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '10px', margin: '20px' }}>
      <h2>Linear Search Visualization</h2>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          placeholder="Enter target value"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          disabled={started}
          style={{
            padding: '8px 12px',
            marginRight: '10px',
            border: '2px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px'
          }}
        />

        <button
          onClick={startSearch}
          disabled={started || target === ''}
          style={{
            padding: '8px 16px',
            marginRight: '10px',
            background: started ? '#ccc' : '#3d5af1',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: started ? 'not-allowed' : 'pointer'
          }}
        >
          {started ? 'Searching...' : 'Start Search'}
        </button>

        <button
          onClick={reset}
          style={{
            padding: '8px 16px',
            background: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '5px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {values.map((value, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '50px',
                height: '50px',
                background: getElementColor(i),
                border: '2px solid #333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                transform: started && i === index ? 'scale(1.1)' : 'scale(1)'
              }}
            >
              {value}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {i}
            </div>
          </div>
        ))}
      </div>

      {message && (
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: getMessageColor(),
          marginBottom: '10px'
        }}>
          {message.includes('Found') ? '' : ''}{message}
        </div>
      )}

      <div style={{ fontSize: '14px', color: '#666' }}>
        <p>Current Index: {started ? index : 'Not started'}</p>
        <p>Target: {target || 'None'}</p>
        <div style={{ marginTop: '10px' }}>
          <span style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: '3px' }}>■</span> Not checked &nbsp;
          <span style={{ background: '#ffcc00', padding: '2px 8px', borderRadius: '3px' }}>■</span> Currently checking &nbsp;
          <span style={{ background: '#ffcccc', padding: '2px 8px', borderRadius: '3px' }}>■</span> Already checked &nbsp;
          <span style={{ background: '#00ff00', padding: '2px 8px', borderRadius: '3px' }}>■</span> Found
        </div>
      </div>
    </div>
  );
};

export default SimpleLinearSearch;
