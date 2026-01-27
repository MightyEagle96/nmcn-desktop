import axios from "axios";

let serverIp: string | null = null;

export const examCandidate = localStorage.getItem("examCandidate") || null;

export const axiosClient = axios.create({
  baseURL: `http://${serverIp}:4001/api/candidate/`,
  timeout: 10000,
  headers: {
    candidate: examCandidate,
    "Cache-Control": "no-cache",
  },
});

export const setApiBaseIp = (ip: string) => {
  serverIp = ip;
};

export const clearApiBaseIp = () => {
  serverIp = null;
};

/* ------------------ REQUEST INTERCEPTOR ------------------ */
axiosClient.interceptors.request.use(
  (config) => {
    if (serverIp) {
      config.baseURL = `http://${serverIp}:4001/api/candidate/`;
    }

    // console.log("[API]", config.method?.toUpperCase(), config.url);

    return config;
  },
  (error) => Promise.reject(error),
);

/* ------------------ RESPONSE INTERCEPTOR ------------------ */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error("[API ERROR]", error.message);

    if (error.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timeout"));
    }

    if (!error.response) {
      return Promise.reject(new Error("Network error"));
    }

    //console.log(error.response);
    const status = error.response.status;
    const message = error.response.data;

    return Promise.reject({ status, data: message });
  },
);

export default axiosClient;

export interface IErrorResponse {
  status: number;
  data: string;
}
