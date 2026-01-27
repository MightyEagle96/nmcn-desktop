import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

export const armedSlice = createSlice({
  name: "armed",
  initialState,
  reducers: {
    setArmed: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setArmed } = armedSlice.actions;
export default armedSlice.reducer;
