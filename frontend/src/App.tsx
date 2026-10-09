import { Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import FamiliesPage from "./pages/FamilyPage";
import RoomsPage from "./pages/RoomPage";
import TravelPage from "./pages/TravelPage";
import VehiclesPage from "./pages/VehiclesPage";
import WhatsAppPage from "./pages/WhatsAppPage";
import DashboardPage from "./pages/DashboardPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { authStore } from "./store/userStore";
import { useEffect } from "react";

export default function App() {
  const checkAuth = authStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/families" element={<FamiliesPage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/whatsapp" element={<WhatsAppPage />} />
        </Route>
      </Route>
    </Routes>
  );
}