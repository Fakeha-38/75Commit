import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChallengeState } from './types';
// import ChallengeState from './types';

const initialState: ChallengeState = {
  name: '',
  startDate: '',
  daysPerWeekTarget: 7,
  durationDays: 75,
  weekdays: ['mon', 'tue', 'wed', 'thur', 'fri', 'sat', 'sun'],
  type: 'Hard',
}

const deriveType = (days: number): 'Easy' | 'Medium' | 'Hard' => {
  if (days >= 6) return 'Hard';
  if (days >= 4) return 'Medium';
  return 'Easy';
};

const ChallengeSlice = createSlice({
  name: 'challenge',
  initialState,

  reducers: {
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setStartDate(state, action: PayloadAction<string>) {
      state.startDate = action.payload;
    },
    setDaysPerWeekTarget(state, action: PayloadAction<number>) {
      state.daysPerWeekTarget = action.payload;
      state.type = deriveType(action.payload);
    },
    setDurationDays(state, action: PayloadAction<number>) {
      state.durationDays = action.payload;
    },
    setWeekdays(state, action: PayloadAction<string[]>) {
      state.weekdays = action.payload;
    },
    resetChallenge(state) {
      Object.assign(state, initialState);
    }
  },
});

export const {
  setName,
  setStartDate,
  setDaysPerWeekTarget,
  setDurationDays,
  setWeekdays,
  resetChallenge,
} = ChallengeSlice.actions;

export default ChallengeSlice.reducer;