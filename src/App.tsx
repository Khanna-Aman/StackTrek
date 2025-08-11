import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';

import { DataStructuresPage } from '@/pages/DataStructuresPage';
import { TutorialsPage } from '@/pages/TutorialsPage';
import { AlgorithmsPage } from '@/pages/AlgorithmsPage';
import { CodeExamplesPage } from '@/pages/CodeExamplesPage';
import { AchievementsPage } from '@/pages/AchievementsPage';
import { ChallengesPage } from '@/pages/ChallengesPage';
import { ChallengePage } from '@/pages/ChallengePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { AboutPage } from '@/pages/AboutPage';
import { TermsPage } from '@/pages/TermsPage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { FirebaseSetup } from '@/components/setup/FirebaseSetup';
import { TutorialArrayVisualization } from '@/components/dataStructures/TutorialArrayVisualization';
import { TutorialLinkedListVisualization } from '@/components/dataStructures/TutorialLinkedListVisualization';
import { TutorialStackVisualization } from '@/components/dataStructures/TutorialStackVisualization';
import { GamesPage } from '@/pages/GamesPage';
import { TowerOfHanoiGame } from '@/pages/games/TowerOfHanoiGame';
import { HiddenArrayGame } from '@/pages/games/HiddenArrayGame';
import { SortingRaceGame } from '@/pages/games/SortingRaceGame';
import { TreeBuilderGame } from '@/pages/games/TreeBuilderGame';
import { useAppSelector } from '@/hooks/redux';

function App() {
  const { isLoading } = useAppSelector(state => state.app);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/data-structures" element={<DataStructuresPage />} />
          <Route path="/data-structures/:type" element={<DataStructuresPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/tutorials/array" element={<TutorialArrayVisualization />} />
          <Route path="/tutorials/linked-list" element={<TutorialLinkedListVisualization />} />
          <Route path="/tutorials/stack" element={<TutorialStackVisualization />} />
          <Route path="/algorithms" element={<AlgorithmsPage />} />
          <Route path="/code-examples" element={<CodeExamplesPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/challenges/:challengeId" element={<ChallengePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/tower-of-hanoi" element={<TowerOfHanoiGame />} />
          <Route path="/games/hidden-array" element={<HiddenArrayGame />} />
          <Route path="/games/sorting-race" element={<SortingRaceGame />} />
          <Route path="/games/tree-builder" element={<TreeBuilderGame />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/setup/firebase" element={<FirebaseSetup />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
}

export default App;
