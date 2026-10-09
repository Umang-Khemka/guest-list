import axios from "axios";

const vehicleAssignmentInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1/vehicle-assignments"
      : "/api/v1/vehicle-assignments",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default vehicleAssignmentInstance;
