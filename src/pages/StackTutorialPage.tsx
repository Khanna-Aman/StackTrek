import React, { useState } from 'react';
import { TutorialSystem } from '@/components/tutorial/TutorialSystem';
import { EnhancedStackVisualization } from '@/components/dataStructures/EnhancedStackVisualization';
import { stackTutorial } from '@/data/stackTutorial';
import { useNavigate } from 'react-router-dom';

export const StackTutorialPage: React.FC = () => {
  const navigate = useNavigate();
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  const handleTutorialComplete = () => {
    setTutorialCompleted(true);
    // Could add XP points, achievements, etc. here in Phase 3
    setTimeout(() => {
      navigate('/data-structures');
    }, 2000);
  };

  return (
    <TutorialSystem
      title={stackTutorial.title}
      description={stackTutorial.description}
      steps={stackTutorial.steps}
      onComplete={handleTutorialComplete}
    >
      <EnhancedStackVisualization />
    </TutorialSystem>
  );
};
