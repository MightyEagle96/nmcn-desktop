import { createSlice } from "@reduxjs/toolkit";

const initialState: any[] = [];

export const questionNavigationSlice = createSlice({
  name: "questionNavigation",
  initialState,
  reducers: {
    setQuestionNavigation: (_, action) => action.payload,
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
