import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useServer } from "../context/ServerContext";
import { TextField, Button, Typography } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Clear,
  KeyboardArrowRight,
  LaptopWindows,
  Storage,
} from "@mui/icons-material";
import { toast } from "react-toastify";

export const TIMEOUT_MS = 10_000;

const ServerConnectPage: React.FC = () => {
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { setServerIp } = useServer();
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!ip.trim()) {
    //   setError("Please enter server IP");
    //   return;
    // }

    // setError("");
    setLoading(true);

    try {
      const url = `http://${ip}:4001/servercheck`;

      await axios.get(url, {
        timeout: TIMEOUT_MS,
      });

      setServerIp(ip);
      // ✅ success
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Cannot reach server. Check IP and network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-lg-4 rounded shadow-sm p-4 bg-light">
        <div className="">
          <div className="mb-4 text-center">
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Connect to Server
            </Typography>
          </div>

          <div className="d-flex justify-content-between mb-4 align-items-center">
            <div>
              <LaptopWindows sx={{ height: 50, width: 50 }} />
            </div>
            <div>
              <Clear sx={{ height: 30, width: 30 }} />
            </div>
            <div>
              <Storage sx={{ height: 50, width: 50 }} />
            </div>
          </div>
          <form onSubmit={handleConnect}>
            <div className="mb-4">
              <TextField
                fullWidth
                label="Server IP"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                sx={{ my: 2 }}
              />
            </div>
            <div>
              <Button
                endIcon={<KeyboardArrowRight />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
                fullWidth
                type="submit"
                //onClick={handleConnect}
              >
                Connect
              </Button>
            </div>
          </form>
        </div>
      </div>
      {/* <Card sx={{ width: 420, p: 3 }}>
        <CardContent className="text-center">
          <Typography variant="h5" gutterBottom>
            Server Connection
          </Typography>

          <TextField
            fullWidth
            label="Server IP"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            sx={{ my: 2 }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? "Connecting…" : "Connect"}
          </Button>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
};

export default ServerConnectPage;
