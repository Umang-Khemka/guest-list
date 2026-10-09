import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authStore } from "../store/userStore";

export default function ProtectedRoute() {
  const { user, checking } = authStore();
  const location = useLocation();

  // Wait for checkAuth to finish, otherwise a logged-in user flashes to /login on refresh
  if (checking) return <p className="muted" style={{ padding: 24 }}>Loading...</p>;

  // Not signed in: go to login and remember where they were headed
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}