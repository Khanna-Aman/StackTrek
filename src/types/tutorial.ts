export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  language?: string;
  explanation: string;
  tips?: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface Tutorial {
  title: string;
  description: string;
  steps: TutorialStep[];
}

export interface TutorialProgress {
  tutorialId: string;
  currentStep: number;
  completed: boolean;
  completedAt?: string;
}
