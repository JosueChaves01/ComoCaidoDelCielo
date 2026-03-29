import { Hero } from "./components/Hero";
import { TerraceSection } from "./components/TerraceSection";
import { FoodTruckSection } from "./components/FoodTruckSection";
import { EventsSection } from "./components/EventsSection";
import { EventHallSection } from "./components/EventHallSection";
import { AirbnbSection } from "./components/AirbnbSection";
import { MomentsGallery } from "./components/MomentsGallery";
import { InfoSection } from "./components/InfoSection";
import { Footer } from "./components/Footer";
import { ChatAssistant } from "./components/ChatAssistant";
import { Navbar } from "./components/Navbar";

import { Routes, Route } from "react-router";
import { Landing } from "./pages/Landing";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}