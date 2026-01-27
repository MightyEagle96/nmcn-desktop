import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const scoreSlice = createSlice({
  name: "scores",
  initialState,
  reducers: {
    setScores: (state, action) => {
      const existing = state.findIndex((c) => c.id === action.payload.id);

      if (existing === -1) return [...state, action.payload];
      return state.map((obj, i) => {
        if (existing === i) return { ...obj, ...action.payload };
        return obj;
      });
    },
  },
});

export const { setScores } = scoreSlice.actions;

export default scoreSlice.reducer;
