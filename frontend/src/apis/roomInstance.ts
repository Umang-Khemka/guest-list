import axios from "axios";

const roomInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/rooms"
      : "/api/v1/rooms",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default roomInstance;