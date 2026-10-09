import axios from "axios";

const travelInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/travels"
      : "/api/v1/travels",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default travelInstance;