import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const questionNavigationSlice = createSlice({
  name: "questionNavigation",
  initialState,
  reducers: {
    setQuestionNavigation: (state, action) => {
      return (state = action.payload);
    },
    setQuestionNumber: (state, action) => {
      return state.map((obj) => {
        if (obj.subject === action.payload.subject) {
          return { ...obj, questionIndex: action.payload.index };
        }
        return obj;
      });
    },
  },
});

export const { setQuestionNavigation, setQuestionNumber } =
  questionNavigationSlice.actions;

export default questionNavigationSlice.reducer;
