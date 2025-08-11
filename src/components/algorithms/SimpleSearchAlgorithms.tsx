import React, { useState } from 'react';
import SimpleLinearSearch from './SimpleLinearSearch';

const SimpleSearchAlgorithms: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('linear');

  const renderSearchComponent = () => {
    switch (selectedAlgorithm) {
      case 'linear':
        return <SimpleLinearSearch />;
      default:
        return (
          <div style={{ padding: '20px', background: 'white', borderRadius: '10px', margin: '20px', textAlign: 'center' }}>
            <h3>Coming Soon!</h3>
            <p>This search algorithm visualization is under development.</p>
            <div style={{ 
              padding: '40px',
              background: '#f8f9fa',
              borderRadius: '8px',
              margin: '20px 0',
              color: '#6c757d'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🚧</div>
              <p>We're working hard to bring you this visualization.</p>
              <p>Please check back soon!</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div style={{ padding: '20px', background: '#f8f9fa', borderRadius: '10px', margin: '20px' }}>
        <h2>Search Algorithm Visualization</h2>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Algorithm:</label>
          <select 
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '2px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              minWidth: '200px'
            }}
          >
            <option value="linear">Linear Search</option>
            <option value="binary">Binary Search (Coming Soon)</option>
            <option value="jump">Jump Search (Coming Soon)</option>
            <option value="interpolation">Interpolation Search (Coming Soon)</option>
            <option value="exponential">Exponential Search (Coming Soon)</option>
          </select>
        </div>
        
        {selectedAlgorithm !== 'linear' && (
          <div style={{ 
            padding: '10px 15px',
            background: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '5px',
            color: '#856404'
          }}>
            <strong>Note:</strong> Only Linear Search is currently available. Other algorithms are coming soon!
          </div>
        )}
      </div>
      
      {renderSearchComponent()}
    </div>
  );
};

export default SimpleSearchAlgorithms;
