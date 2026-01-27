import { createSlice } from "@reduxjs/toolkit";

const initialState = { subject: {}, questions: [], subjectIndex: 0 };

export const questionControlSlice = createSlice({
  name: "questionControl",
  initialState,
  reducers: {
    setQuestionControl: (state, action) => {
      return { ...state, subject: action.payload };
    },
    setActiveQuestions: (state, action) => {
      return { ...state, questions: action.payload };
    },
    setSubjectIndex: (state, action) => {
      return { ...state, subjectIndex: action.payload };
    },
  },
});

export const { setQuestionControl, setActiveQuestions, setSubjectIndex } =
  questionControlSlice.actions;

export default questionControlSlice.reducer;
