import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const questionBanksSlice = createSlice({
  name: "questionBanks",
  initialState,
  reducers: {
    setQuestionBanks: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setQuestionBanks } = questionBanksSlice.actions;

export default questionBanksSlice.reducer;

export const totalQuestionsCount = (state) =>
  state.questionBanksSlice.reduce((acc, val) => acc + val.questions.length, 0);

export const totalQuestionsCountBySubject = (subjectId) => (state) =>
  state.questionBanksSlice.find((c) => c.subject === subjectId)?.questions
    .length;
