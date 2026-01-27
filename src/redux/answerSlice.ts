import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const answerSlice = createSlice({
  name: "answeredQuestions",
  initialState,
  reducers: {
    answerQuestion: (state, action) => {
      const exist = state.findIndex(
        (c) =>
          c.questionId === action.payload.questionId &&
          c.subject === action.payload.subject
      );

      if (exist < 0) return [...state, action.payload];

      return state.map((obj, i) => {
        if (exist === i) {
          return { ...obj, ...action.payload };
        }
        return obj;
      });
    },
    setResponses: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { answerQuestion, setResponses } = answerSlice.actions;

export default answerSlice.reducer;

export const selectAnsweredCount = (state) => state.answerSlice.length;

export const selectAnsweredCountBySubject = (subjectId) => (state) =>
  state.answerSlice.filter((q) => q.subject === subjectId).length;
