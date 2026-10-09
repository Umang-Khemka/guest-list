import axios from "axios";

const dashboardInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/dashboard"
      : "/api/v1/dashboard",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default dashboardInstance;