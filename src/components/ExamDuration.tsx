import { useEffect, useState, useRef } from "react";
import { Alert } from "@mui/material";
import axiosClient from "../api/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { setNetwork } from "../redux/networkSlice";
import { totalQuestionsCount } from "../redux/questionBanksSlice";
import { useNavigate } from "react-router-dom";

function ExamCountdown() {
  const [duration, setDuration] = useState(0); // ms
  const [timeLeft, setTimeLeft] = useState(0); // ms

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const answeredQuestions = useSelector((state) => state.answerSlice);
  const totalQuestions = useSelector(totalQuestionsCount);

  const totalScore = answeredQuestions.reduce((acc, val) => acc + val.score, 0);

  const network = useSelector((state) => state.networkSlice);

  const lastSentRef = useRef<number | null>(null);

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

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <>
      <Alert severity={severity}>
        Time Remaining: <strong>{formatTime(timeLeft)}</strong>
      </Alert>

      <div className="d-none">
        {duration > 0 && (
          <CountdownCircleTimer
            key={duration}
            isPlaying={network}
            duration={duration / 1000} // seconds
            initialRemainingTime={duration / 1000}
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
            colors={["#000", "#f50", "#e91e63", "#9c27b0"]}
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
