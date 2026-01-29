import { KeyboardArrowRight } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function ExamConcluded() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("examCandidate");

    const timeOut = setTimeout(() => {
      navigate("/login");
    }, 10_000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);
  return (
    <div className="overflow-hidden">
      <div
        style={{ height: "50vh" }}
        className=" bg-success  d-flex align-items-end justify-content-center text-white"
      >
        <Typography sx={{ fontSize: 50, fontWeight: 700 }}>
          EXAMINATION
        </Typography>
      </div>
      <div className="text-center text-success">
        <Typography gutterBottom sx={{ fontSize: 50, fontWeight: 700 }}>
          CONCLUDED
        </Typography>
        <Button component={Link} to="/login">
          Back to Home <KeyboardArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default ExamConcluded;
