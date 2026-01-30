import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setQuestionNumber } from "../redux/questionNavigationSlice";

function ButtonsDisplay() {
  const activeSubject = useSelector((state: any) => state.activeSubject);
  const questionBanks = useSelector((state: any) => state.questionBanksSlice);
  const questions =
    questionBanks.find((c: any) => c.subject === activeSubject._id)
      ?.questions || [];

  const dispatch = useDispatch();

  const changeQuestion = (index: number) => {
    const subject = activeSubject._id;
    dispatch(setQuestionNumber({ index, subject }));
  };
  const navigations = useSelector(
    (state: any) => state.questionNavigationSlice,
  );

  const answeredQuestions = useSelector((state: any) => state.answerSlice);

  const currentNavigation = navigations.find(
    (c: any) => c.subject === activeSubject._id,
  );

  const answeredOptions = (questionId: string) => {
    const index = answeredQuestions.findIndex(
      (c: any) =>
        c.questionId === questionId && c.subject === activeSubject._id,
    );

    if (index >= 0) return true;
    return false;
  };
  const isCurrent = (questionIndex: number) => {
    return currentNavigation.questionIndex === questionIndex;
  };
  return (
    <div className="mt-4">
      {questions.map((c: any, i: number) => (
        <Button
          className="me-1 mb-1"
          variant={
            answeredOptions(c._id) || isCurrent(i) ? "contained" : "outlined"
          }
          sx={{
            minWidth: 20,
            height: 20,
            fontSize: 14,
            backgroundColor: isCurrent(i)
              ? "#FF8282"
              : answeredOptions(c._id)
                ? "#84AE92"
                : "transparent",

            color:
              answeredOptions(c._id) || isCurrent(i) ? "#fefefe" : "#84AE92",
            borderColor: "#84AE92",
            "&:hover": {
              backgroundColor: isCurrent(i)
                ? "#e46b6b"
                : answeredOptions(c._id)
                  ? "#6f997e"
                  : "#f3f3f3",
            },
          }}
          onClick={() => changeQuestion(i)}
          key={i}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
}

export default ButtonsDisplay;
