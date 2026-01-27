import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const procedureSlice = createSlice({
  name: "procedure",
  initialState,
  reducers: {
    setProcedure: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { setProcedure } = procedureSlice.actions;

export default procedureSlice.reducer;
