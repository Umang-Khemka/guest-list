import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ComingSoon from "./components/ui/ComingSoon";
import FamiliesPage from "./pages/FamilyPage";
import RoomsPage from "./pages/RoomPage";
import TravelPage from "./pages/TravelPage";
import VehiclesPage from "./pages/VehiclesPage";
import WhatsAppPage from "./pages/WhatsAppPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ComingSoon title="Dashboard" />} />
        <Route path="families" element={<FamiliesPage />} />
        <Route path="travel" element={<TravelPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="whatsapp" element={<WhatsAppPage />} />
      </Route>
    </Routes>
  );
}