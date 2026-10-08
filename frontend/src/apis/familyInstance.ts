import axios from "axios";

const familyInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/families"
      : "/api/v1/families",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default familyInstance;
