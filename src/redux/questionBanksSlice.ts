import { createSlice } from "@reduxjs/toolkit";

const initialState: any[] = [];

export const questionBanksSlice = createSlice({
  name: "questionBanks",
  initialState,
  reducers: {
    setQuestionBanks: (_, action) => action.payload,
  },
});

export const { setQuestionBanks } = questionBanksSlice.actions;

export default questionBanksSlice.reducer;

export const totalQuestionsCount = (state: any) =>
  state.questionBanksSlice.reduce(
    (acc: number, val: any) => acc + val.questions.length,
    0,
  );

export const totalQuestionsCountBySubject =
  (subjectId: string) => (state: any) =>
    state.questionBanksSlice.find((c: any) => c.subject === subjectId)
      ?.questions.length;
