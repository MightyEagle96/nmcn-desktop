import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const examinationDurationSlice = createSlice({
  name: "examinationDuration",
  initialState,
  reducers: {
    setExaminationDuration: (_, action) => action.payload,
  },
});

export const { setExaminationDuration } = examinationDurationSlice.actions;

export default examinationDurationSlice.reducer;
