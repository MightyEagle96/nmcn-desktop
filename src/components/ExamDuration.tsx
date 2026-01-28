import { useEffect, useState, useRef } from "react";
import { Alert } from "@mui/material";
import axiosClient from "../api/axiosClient";
import { useDispatch, useSelector } from "react-redux";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { setNetwork } from "../redux/networkSlice";

function ExamCountdown() {
  const [duration, setDuration] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const dispatch = useDispatch();

  const answeredQuestions = useSelector((state) => state.answerSlice);

  const network = useSelector((state) => state.networkSlice);

  console.log(answeredQuestions);

  const getData = async () => {
    const { data } = await axiosClient.get("examduration");

    if (data?.duration) {
      dispatch(setNetwork(true));
      console.log(data.duration);
      setDuration(data.duration);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${h}:${m}:${s}`;
  };

  const severity =
    timeLeft <= 60 * 1000
      ? "error"
      : timeLeft <= 5 * 60 * 1000
        ? "warning"
        : "info";

  return (
    <>
      <Alert severity={severity}>
        Time Remaining: {formatTime(timeLeft / 1000)}
      </Alert>

      <div className="d-none">
        <CountdownCircleTimer
          isPlaying={network}
          duration={duration / 1000}
          onUpdate={(e) => setTimeLeft(e * 1000)}
          colors={["#000"]}
        >
          {({ remainingTime }) => <span>{formatTime(remainingTime)}</span>}
        </CountdownCircleTimer>
      </div>
    </>
  );
}

export default ExamCountdown;
