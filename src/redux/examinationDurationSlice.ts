import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const examinationDurationSlice = createSlice({
  name: "examinationDuration",
  initialState,
  reducers: {
    setExaminationDuration: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setExaminationDuration } = examinationDurationSlice.actions;

export default examinationDurationSlice.reducer;
