import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import parser from "html-react-parser";
import { Button, CardActionArea, Stack, Typography } from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import { setQuestionNumber } from "../redux/questionNavigationSlice";
import { answerQuestion } from "../redux/answerSlice";

function QuestionDisplay() {
  const dispatch = useDispatch();

  //console.log(state);
  const activeSubject = useSelector((state) => state.activeSubject);
  const questionBanks = useSelector((state) => state.questionBanksSlice);
  const navigations = useSelector((state) => state.questionNavigationSlice);
  const answeredQuestions = useSelector((state) => state.answerSlice);
  const network = useSelector((state) => state.networkSlice);

  const questions =
    questionBanks.find((c) => c.subject === activeSubject._id)?.questions || [];

  //console.log(questions);

  const currentNavigation = navigations.find(
    (c) => c.subject === activeSubject._id,
  );

  const alphabetArray = Array.from({ length: 26 }, (_, i) => ({
    letter: String.fromCharCode(65 + i),
    position: i + 1,
  }));

  const previousButton = () => {
    if (!network) return;
    if (currentNavigation && questions[currentNavigation.questionIndex - 1]) {
      dispatch(
        setQuestionNumber({
          index: currentNavigation.questionIndex - 1,
          subject: activeSubject._id,
        }),
      );
    }
  };

  const nextButton = () => {
    if (!network) return;
    if (currentNavigation && questions[currentNavigation.questionIndex + 1]) {
      dispatch(
        setQuestionNumber({
          index: currentNavigation.questionIndex + 1,
          subject: activeSubject._id,
        }),
      );
    }
  };

  const answerFunc = (answer, correctAnswer, questionId) => {
    if (!network) return;
    dispatch(
      answerQuestion({
        answer,
        correctAnswer,
        questionId,
        subject: activeSubject._id,
        score: answer === correctAnswer ? 1 : 0,
      }),
    );
  };

  const answeredOptions = (answer, questionId) => {
    const index = answeredQuestions.findIndex(
      (c) =>
        c.questionId === questionId &&
        c.subject === activeSubject._id &&
        answer === c.answer,
    );
    return index >= 0;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();

      // Navigation keys
      if (key === "N" || event.key === "ArrowRight") {
        nextButton();
      } else if (key === "P" || event.key === "ArrowLeft") {
        previousButton();
      }
      // Option selection: A–J only
      else if (/^[A-J]$/.test(key)) {
        const index = key.charCodeAt(0) - 65; // A = 0, B = 1, ..., J = 9
        const currentQuestion = questions[currentNavigation.questionIndex];
        if (
          currentQuestion &&
          currentQuestion.options &&
          currentQuestion.options[index]
        ) {
          const selectedOption = currentQuestion.options[index];
          answerFunc(
            selectedOption,
            currentQuestion.correctAnswer,
            currentQuestion._id,
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentNavigation, questions, network]);

  return (
    <div className="mt-4">
      {questions.length > 0 && (
        <div>
          <div style={{ minHeight: "50vh" }}>
            <div className="mb-4">
              <Typography fontWeight={700}>
                Question{" "}
                {currentNavigation && currentNavigation.questionIndex + 1}.
              </Typography>
            </div>
            <div style={{ fontSize: "18px" }} className="mb-4">
              {parser(questions[currentNavigation.questionIndex]?.question)}
            </div>
            <div className="col-lg-6">
              {questions[currentNavigation.questionIndex].options.map(
                (c, i) => (
                  <CardActionArea
                    sx={
                      answeredOptions(
                        c,
                        questions[currentNavigation.questionIndex]?._id,
                      )
                        ? { backgroundColor: "#FF8282", color: "#fefefe" }
                        : {}
                    }
                    onClick={() => {
                      answerFunc(
                        c,
                        questions[currentNavigation.questionIndex]
                          ?.correctAnswer,
                        questions[currentNavigation.questionIndex]?._id,
                      );
                    }}
                    key={i}
                    className="border rounded p-2 mb-4"
                  >
                    <Stack direction={"row"} spacing={2}>
                      <div>
                        <Typography fontWeight={700}>
                          {
                            alphabetArray.find((x) => x.position === i + 1)
                              ?.letter
                          }
                          .
                        </Typography>
                      </div>
                      <div style={{ fontSize: "16px" }}>{parser(c)}</div>
                    </Stack>
                  </CardActionArea>
                ),
              )}
            </div>
          </div>

          <div className="text-center">
            <Button
              disabled={currentNavigation.questionIndex === 0}
              variant="contained"
              className="m-1"
              color="warning"
              size="small"
              onClick={previousButton}
              startIcon={<KeyboardArrowLeft />}
            >
              Prev
            </Button>
            <Button
              disabled={
                currentNavigation.questionIndex === questions.length - 1
              }
              onClick={nextButton}
              className="m-1"
              variant="contained"
              color="warning"
              size="small"
              endIcon={<KeyboardArrowRight />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionDisplay;
