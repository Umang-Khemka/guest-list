import axios from "axios";

const vehicleInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/vehicles"
      : "/api/v1/vehicles",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default vehicleInstance;
