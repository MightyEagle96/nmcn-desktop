import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { base64ToBlobUrl } from "../pages/imageToBlob";
import { Avatar, Box, Skeleton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAnsweredCount,
  selectAnsweredCountBySubject,
} from "../redux/answerSlice";
import {
  totalQuestionsCount,
  totalQuestionsCountBySubject,
} from "../redux/questionBanksSlice";
import { setExaminationDuration } from "../redux/examinationDurationSlice";
import { setDuration } from "../redux/durationSlice";

function CandidateDashboard() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const totalAnswered = useSelector(selectAnsweredCount);
  const totalQuestions = useSelector(totalQuestionsCount);

  const activeSubject = useSelector((state: any) => state.activeSubject);

  const subjectAnswered = useSelector((state: any) =>
    selectAnsweredCountBySubject(activeSubject?._id),
  );

  const subjectQuestionsCount = useSelector(
    totalQuestionsCountBySubject(activeSubject?._id),
  );

  const getData = async () => {
    try {
      setLoading(true);

      const [dashboardRes, imageRes] = await Promise.all([
        axiosClient.get("dashboarddata"),
        axiosClient.get("myimage"),
      ]);

      if (dashboardRes?.data) {
        const data = dashboardRes.data;

        dispatch(setExaminationDuration(data.cbtExamination.duration));
        dispatch(setDuration(data.duration));
        setCandidate(data);
      }

      if (imageRes?.data) {
        const blobUrl = base64ToBlobUrl(imageRes.data, "image/jpeg");
        setImageUrl(blobUrl);
      }
    } catch (err) {
      console.error("Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // ----------------------------
  // 🦴 Skeleton UI
  // ----------------------------

  if (loading) {
    return (
      <Box>
        <Box textAlign="center" pt={5} pb={5}>
          <Skeleton variant="rounded" width="100%" height={240} />
        </Box>

        {Array.from({ length: 5 }).map((_, i) => (
          <Box key={i} mb={3}>
            <Skeleton width={120} height={18} />
            <Skeleton width="80%" height={30} />
          </Box>
        ))}
      </Box>
    );
  }

  // ----------------------------
  // 🧾 Actual UI
  // ----------------------------

  return (
    <div>
      <div className="text-center pt-5 pb-5">
        <Avatar
          variant="rounded"
          src={imageUrl || undefined}
          sx={{ width: "100%", height: 240 }}
        />
      </div>

      {candidate && (
        <div>
          <InfoBlock label="Name">
            {candidate.firstName} {candidate.middleName} {candidate.lastName}
          </InfoBlock>

          <InfoBlock label="Examination Number">
            {candidate.indexNumber}
          </InfoBlock>

          <InfoBlock label="School">{candidate.school}</InfoBlock>

          <InfoBlock label="Answered">
            {subjectAnswered}/{subjectQuestionsCount}
          </InfoBlock>

          <InfoBlock label="Total Answered">
            {totalAnswered}/{totalQuestions}
          </InfoBlock>
        </div>
      )}
    </div>
  );
}

export default CandidateDashboard;

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 text-break">
      <Typography variant="overline">{label}</Typography>
      <Typography fontSize={22} textTransform="uppercase" fontWeight={700}>
        {children}
      </Typography>
    </div>
  );
}
