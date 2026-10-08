import axios from "axios";

const allocationInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/room-allocations"
      : "/api/v1/room-allocations",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default allocationInstance;