import { useEffect, useState, useRef } from "react";
import { Alert, Button } from "@mui/material";
import axiosClient from "../api/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { setNetwork } from "../redux/networkSlice";
import { totalQuestionsCount } from "../redux/questionBanksSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Send } from "@mui/icons-material";
import ShowCalculator from "./Calculator";

function ExamCountdown() {
  const [duration, setDuration] = useState(0); // ms
  const [timeLeft, setTimeLeft] = useState(0); // ms
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const answeredQuestions = useSelector((state: any) => state.answerSlice);
  const totalQuestions = useSelector(totalQuestionsCount);

  const totalScore = answeredQuestions.reduce(
    (acc: number, val: any) => acc + val.score,
    0,
  );

  const network = useSelector((state: any) => state.networkSlice);

  const lastSentRef = useRef<number | null>(null);

  const enableSubmitButton = answeredQuestions.length / totalQuestions >= 0.8;
  const body = {
    totalQuestions,
    totalScore,
    timeLeft,
    totalAttempts: answeredQuestions.length,
    responses: answeredQuestions,
  };

  // ---------------------------
  // FETCH EXAM DURATION
  // ---------------------------
  const getData = async () => {
    try {
      const { data } = await axiosClient.get("examduration");

      if (data?.duration) {
        dispatch(setNetwork(true));
        setDuration(data.duration);
        setTimeLeft(data.duration);
      }
    } catch (error: any) {
      dispatch(setNetwork(false));

      if (error.status === 401) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // ---------------------------
  // FORMAT hh:mm:ss
  // ---------------------------
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);

    const h = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");

    const m = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");

    const s = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  // ---------------------------
  // ALERT SEVERITY
  // ---------------------------
  const severity =
    timeLeft <= 60_000 ? "error" : timeLeft <= 5 * 60_000 ? "warning" : "info";

  // ---------------------------
  // SEND PROGRESS TO SERVER
  // every 30 seconds
  // ---------------------------
  const sendResponses = async (remainingMs: number) => {
    try {
      await axiosClient.post("saveresponses", {
        ...body,
        timeLeft: remainingMs,
      });
    } catch (error: any) {
      dispatch(setNetwork(false));

      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const submitExamination = () => {
    Swal.fire({
      title: "Submit Examination?",
      text: "Are you sure you want to submit your examination now?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit!",
    }).then((result) => {
      if (result.isConfirmed) {
        submitExamFunc();
      }
    });
  };

  const submitExamFunc = async () => {
    setSubmitting(true);
    try {
      await axiosClient.post("submitexam", body);
      navigate("/concluded");
    } catch (error: any) {
      if (error.status === 401) {
        navigate("/login");
      }
    }

    setSubmitting(false);
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <>
      <div className="row align-items-center justify-content-end g-3">
        <div className="col-auto">
          <ShowCalculator />
        </div>
        {/* TIMER */}
        <div className="col-auto d-flex justify-content-end">
          <Alert severity={severity} sx={{ mb: 0 }}>
            Time Remaining: <strong>{formatTime(timeLeft)}</strong>
          </Alert>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="col-auto">
          <Button
            disabled={!enableSubmitButton}
            variant="contained"
            color="error"
            size="large"
            onClick={submitExamination}
            loading={submitting}
            endIcon={<Send />}
          >
            SUBMIT EXAMINATION
          </Button>
        </div>
      </div>

      <div className="d-none">
        {duration > 0 && (
          <CountdownCircleTimer
            key={duration}
            isPlaying={network}
            duration={duration / 1000} // seconds
            initialRemainingTime={duration / 1000}
            colors={"#fff"}
            onUpdate={(remainingSeconds) => {
              const remainingMs = remainingSeconds * 1000;

              setTimeLeft(remainingMs);

              // fire every 30s
              if (
                lastSentRef.current === null ||
                lastSentRef.current - remainingSeconds >= 30
              ) {
                lastSentRef.current = remainingSeconds;
                sendResponses(remainingMs);
              }
            }}
          >
            {({ remainingTime }) => (
              <span>{formatTime(remainingTime * 1000)}</span>
            )}
          </CountdownCircleTimer>
        )}
      </div>
    </>
  );
}

export default ExamCountdown;
