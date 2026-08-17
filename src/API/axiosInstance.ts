import axios, { AxiosError } from "axios";

// Create axios instance with base config
const axiosInstance = axios.create({
  baseURL: "https://hp-latex.reluconsultancy.net/api/api/", // API base URL
  headers: {
    "Content-Type": "application/json",
    "Accept"      : "application/json",
  },
});

// Response interceptor - Use the common error handler
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
