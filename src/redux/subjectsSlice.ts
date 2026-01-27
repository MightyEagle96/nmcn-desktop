import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    setSubjects: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setSubjects } = subjectsSlice.actions;

export default subjectsSlice.reducer;
