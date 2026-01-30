import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const procedureSlice = createSlice({
  name: "procedure",
  initialState,
  reducers: {
    setProcedure: (_, action) => action.payload,
  },
});

export const { setProcedure } = procedureSlice.actions;

export default procedureSlice.reducer;
