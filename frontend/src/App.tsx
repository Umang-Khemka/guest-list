import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ComingSoon from "./components/ui/ComingSoon";
import FamiliesPage from "./pages/FamilyPage";
import TravelPage from "./pages/TravelPage";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<ComingSoon title="Dashboard" />} />
        <Route path="families" element={<FamiliesPage />} />
        <Route path="travel" element={<TravelPage />} />
        <Route path="rooms" element={<ComingSoon title="Rooms" />} />
        <Route path="vehicles" element={<ComingSoon title="Vehicles" />} />
        <Route path="whatsapp" element={<ComingSoon title="WhatsApp" />} />
        <Route path="history" element={<ComingSoon title="Messages / History" />} />
      </Route>
    </Routes>
  );
}