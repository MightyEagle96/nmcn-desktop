import { createSlice } from "@reduxjs/toolkit";

const initialState: any[] = [];

export const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    setSubjects: (_, action) => action.payload,
  },
});

export const { setSubjects } = subjectsSlice.actions;

export default subjectsSlice.reducer;
