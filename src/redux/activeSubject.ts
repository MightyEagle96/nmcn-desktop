import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const activeSubject = createSlice({
  name: "activeSubject",
  initialState,
  reducers: {
    setActiveSubject: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setActiveSubject } = activeSubject.actions;

export default activeSubject.reducer;
