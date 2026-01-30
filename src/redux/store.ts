import { configureStore, combineReducers } from "@reduxjs/toolkit";

import durationSlice from "./durationSlice";

import answerSlice from "./answerSlice";
import networkSlice from "./networkSlice";

import timePercentageSlice from "./timePercentageSlice";
import subjectsSlice from "./subjectsSlice";
import questionBanksSlice from "./questionBanksSlice";
import questionNavigationSlice from "./questionNavigationSlice";
import activeSubject from "./activeSubject";
import examinationDurationSlice from "./examinationDurationSlice";
import armedSlice from "./armedSlice";

const appReducer = combineReducers({
  durationSlice,
  activeSubject,
  examinationDurationSlice,
  answerSlice,
  networkSlice,
  questionBanksSlice,
  timePercentageSlice,
  questionNavigationSlice,
  subjectsSlice,
  armedSlice,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "exam/reset") {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

// Types (recommended)
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
