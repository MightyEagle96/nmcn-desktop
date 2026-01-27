import { configureStore } from "@reduxjs/toolkit";

import durationSlice from "./durationSlice";

import answerSlice from "./answerSlice";
import networkSlice from "./networkSlice";

import timePercentageSlice from "./timePercentageSlice";
import subjectsSlice from "./subjectsSlice";
import questionControlSlice from "./questionControlSlice";
import questionBanksSlice from "./questionBanksSlice";
import questionNavigationSlice from "./questionNavigationSlice";
import activeSubject from "./activeSubject";
import examinationDurationSlice from "./examinationDurationSlice";
import armedSlice from "./armedSlice";

export const store = configureStore({
  reducer: {
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
  },
});
