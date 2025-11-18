export type { ChallengeState };

interface ChallengeState {
  name: string;
  startDate: string; 
  daysPerWeekTarget: number;
  durationDays: number;
  weekdays: string[];
  type: 'Easy' | 'Medium' | 'Hard';
};

