import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

export const timePercentageSlice = createSlice({
  name: "timePercentage",
  initialState,
  reducers: {
    setTimePercentage: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setTimePercentage } = timePercentageSlice.actions;

export default timePercentageSlice.reducer;
