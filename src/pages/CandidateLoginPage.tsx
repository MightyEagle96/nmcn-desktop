import { Button, TextField, Typography, Alert, Avatar } from "@mui/material";
import logo from "../assets/logo.png";
import { useState } from "react";
import { Close, Login } from "@mui/icons-material";
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";
import { base64ToBlobUrl } from "./imageToBlob";
import { Modal } from "react-bootstrap";
import { green } from "@mui/material/colors";
import { browserName, browserVersion } from "react-device-detect";
import Swal from "sweetalert2";

function CandidateLoginPage() {
  const [indexNumber, setIndexNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const [show, setShow] = useState(false);

  const [imageUrl, setImageUrl] = useState("");

  /*************  ✨ Windsurf Command ⭐  *************/
  /**

/*******  39085921-7f49-4759-b8d7-ed52a1566ca9  *******/
  const candidateLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axiosClient.post("precandidatelogin", {
        indexNumber,
      });

      console.log(data);

      setCandidate(data);

      const { avatar } = data;

      if (avatar) {
        const blobUrl = base64ToBlobUrl(avatar, "image/jpeg");
        if (blobUrl) setImageUrl(blobUrl);
      }
      setShow(true);
    } catch (error) {
      toast.error(error.data);
    } finally {
      setLoading(false);
    }
  };

  const beginExamination = async (e: React.FormEvent) => {
    e.preventDefault();

    Swal.fire({
      title: "Begin Examination?",
      text: "Are you sure you want to begin your examination now?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, begin!",
    });
  };
  return (
    <div>
      <div className="row vh-100 m-0">
        <div className="col-lg-8 d-flex align-items-center bg-dark">
          <div className="container">
            <div className="mb-4 text-center">
              <div className="mb-4">
                <img src={logo} alt="logo" height={150} />
              </div>
              <div className="mb-3">
                <Typography variant="h4" fontWeight={700} color="white ">
                  NMCN TEST ENGINE 2.0
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4 d-flex align-items-center p-4">
          <div className="w-100">
            <form onSubmit={candidateLogin}>
              <div className="mb-4">
                <Typography
                  fontSize={24}
                  gutterBottom
                  sx={{ color: "GrayText", fontWeight: 700 }}
                >
                  Candidate Login
                </Typography>
              </div>
              <TextField
                fullWidth
                label="Examination Number"
                className="mb-4"
                onChange={(e) => setIndexNumber(e.target.value)}
              />
              <Button
                loading={loading}
                endIcon={<Login />}
                fullWidth
                variant="contained"
                color="success"
                type="submit"
                loadingPosition="end"
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>

      {candidate && (
        <Modal size="lg" centered onHide={() => setShow(false)} show={show}>
          <Modal.Header closeButton style={{ border: 0 }}></Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <Alert
                severity="warning"
                sx={{ textTransform: "uppercase", fontWeight: 700 }}
              >
                please Confirm that this is you before proceeding
              </Alert>
            </div>
            <div className="d-flex justify-content-center mb-4">
              <Avatar src={imageUrl} sx={{ height: 150, width: 150 }}></Avatar>
            </div>
            <div className="text-center">
              <div className="mb-3">
                <Typography color={"gray"} gutterBottom variant="overline">
                  Name
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  textTransform={"uppercase"}
                  color={green[700]}
                >
                  {candidate?.firstName} {candidate.lastName}
                </Typography>
              </div>
              <div className="mb-3">
                <Typography color={"gray"} gutterBottom variant="overline">
                  Examination Number
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  textTransform={"uppercase"}
                  color={green[700]}
                >
                  {candidate.indexNumber}
                </Typography>
              </div>
              <div className="mb-3">
                <Typography color={"gray"} gutterBottom variant="overline">
                  Subject Combinations
                </Typography>
                {candidate.subjects.map((c, i) => (
                  <Typography gutterBottom textTransform={"uppercase"} key={i}>
                    {c.name} <small>({c.code})</small>{" "}
                  </Typography>
                ))}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-light" style={{ border: 0 }}>
            <Button
              endIcon={<Login />}
              color="success"
              className="me-3"
              onClick={beginExamination}
              loading={loading}
            >
              Yes this is me
            </Button>
            <Button
              onClick={() => {
                setShow(false);
                setCandidate(null);
              }}
              color="error"
              endIcon={<Close />}
              variant="contained"
            >
              No this is not me
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default CandidateLoginPage;
