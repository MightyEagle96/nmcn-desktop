import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import CandidateDashboard from "../components/CandidateDashboard";
import SubjectPlate from "../components/SubjectPlate";
import { useDispatch } from "react-redux";
import { setResponses } from "../redux/answerSlice";
import { setSubjects } from "../redux/subjectsSlice";
import { setActiveSubject } from "../redux/activeSubject";
import { setActiveQuestions } from "../redux/questionControlSlice";
import { setQuestionNavigation } from "../redux/questionNavigationSlice";
import { useEffect } from "react";
import QuestionDisplay from "../components/QuestionDisplay";

function ExamPage() {
  const dispatch = useDispatch();
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
          const subjects = data.map((c: any) => c.subject);

          const questionBanks = data.map((c: any) => {
            return {
              subject: c.subject._id,
              questions: c.questions,
            };
          });

          dispatch(setSubjects(subjects));

          dispatch(setActiveSubject(subjects[0]));

          dispatch(setActiveQuestions(questionBanks));

          dispatch(
            setQuestionNavigation(
              subjects.map((c) => {
                return { subject: c._id, questionIndex: 0 };
              }),
            ),
          );

          console.log(data);
        }
      }
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="row m-0" style={{ height: "100vh" }}>
        <div className="col-lg-10 p-4">
          <SubjectPlate />
          <QuestionDisplay />
        </div>
        <div className="col-lg-2 bg-light">
          <CandidateDashboard />
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
