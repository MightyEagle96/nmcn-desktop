import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import CandidateDashboard from "../components/CandidateDashboard";
import SubjectPlate from "../components/SubjectPlate";
import { useDispatch, useSelector } from "react-redux";
import { setResponses } from "../redux/answerSlice";
import { setSubjects } from "../redux/subjectsSlice";
import { setActiveSubject } from "../redux/activeSubject";
import { setQuestionNavigation } from "../redux/questionNavigationSlice";
import { useEffect, useState } from "react";
import QuestionDisplay from "../components/QuestionDisplay";
import ExamCountdown from "../components/ExamDuration";
import { setQuestionBanks } from "../redux/questionBanksSlice";
import ButtonsDisplay from "./ButtonsDisplay";
import { useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Repeat, WifiOff } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import { Button, Typography } from "@mui/material";
import { setNetwork } from "../redux/networkSlice";

function ExamPage() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const network = useSelector((state: any) => state.networkSlice);

  const [loading, setLoading] = useState(false);
  const getData = async () => {
    try {
      const [myresponses, examQuestions] = await Promise.all([
        axiosClient.get("myresponses"),
        axiosClient.get("examquestions"),
      ]);

      if (myresponses) {
        const { data } = myresponses;

        if (data) {
          dispatch(setResponses(data.responses));
        }
      }

      if (examQuestions) {
        const { data } = examQuestions;
        if (data) {
          // console.log(data);
          const subjects = data.map((c: any) => c.subject);

          const questionBanks = data.map((c: any) => {
            return {
              subject: c.subject._id,
              questions: c.questions,
            };
          });

          console.log(questionBanks);

          dispatch(setSubjects(subjects));

          dispatch(setActiveSubject(subjects[0]));

          dispatch(setQuestionBanks(questionBanks));

          dispatch(
            setQuestionNavigation(
              subjects.map((c: any) => {
                return { subject: c._id, questionIndex: 0 };
              }),
            ),
          );
        }
      }
    } catch (error: any) {
      if (error.status === 401) {
        navigate("/login");
      }
      toast.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const retryConnection = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("servercheck");
      if (data) dispatch(setNetwork(true));
    } catch (error) {
      toast.warning("Cannot reach server. Check IP and network.");
      dispatch(setNetwork(false));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="row m-0" style={{ height: "100vh" }}>
        <div className="col-lg-10 p-4">
          <SubjectPlate />

          <div className="">
            <ExamCountdown />
          </div>
          <QuestionDisplay />
          <ButtonsDisplay />
        </div>
        <div className="col-lg-2 bg-light">
          <CandidateDashboard />
        </div>
      </div>
      <Modal
        backdrop="static"
        show={!network}
        centered
        onHide={retryConnection}
      >
        <Modal.Header closeButton className="border-0"></Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <WifiOff sx={{ height: 80, width: 80, color: red[700] }} />

            <div className="mt-2">
              <Typography color="GrayText">Network connection lost</Typography>
            </div>
            <div className="mt-4">
              <Button
                sx={{ textTransform: "inherit" }}
                color="error"
                endIcon={<Repeat />}
                loadingPosition="end"
                loading={loading}
                onClick={retryConnection}
              >
                Retry Connection
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0"></Modal.Footer>
      </Modal>
    </div>
  );
}

export default ExamPage;
