import { Button, Typography } from "@mui/material";
import { instructions } from "./instructions";
import { Login } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function InstructionsPage() {
  const navigate = useNavigate();
  const beginExamination = () => {
    Swal.fire({
      title: "Begin Examination?",
      text: "Are you sure you want to begin your examination now?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, begin!",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/exam");
      }
    });
  };
  return (
    <div>
      <div className="mt-5">
        <div className="text-center mb-5">
          <Typography variant="h5" fontWeight={500}>
            INSTRUCTIONS
          </Typography>
        </div>
        <div className="container">
          <div className="mb-5">
            {instructions.map((instruction, index) => (
              <Typography gutterBottom>
                {index + 1}. {instruction}
              </Typography>
            ))}
          </div>
          <div className="text-center">
            <Button
              color="success"
              onClick={beginExamination}
              variant="contained"
              endIcon={<Login />}
            >
              BEGIN EXAMINATION
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructionsPage;
