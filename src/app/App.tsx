import React from "react";
import { Hero } from "./components/Hero";
import { TerraceSection } from "./components/TerraceSection";
import { EventsSection } from "./components/EventsSection";
import { EventHallSection } from "./components/EventHallSection";
import { FoodTruckSection } from "./components/FoodTruckSection";
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
import ReservationPage from "./pages/ReservationPage";
import { useAdminGuard } from "../lib/useAdminGuard";

// Wrapper de ruta protegida: doble barrera junto al useAdminGuard interno del Dashboard.
// Si la sesión no existe o no es admin, el hook redirige antes de renderizar nada.
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdminGuard();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090B10] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C89F6A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // El hook ya redirigió si no es admin; si llegamos aquí con isAdmin=true, renderizar
  if (!isAdmin) return null;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/reservar" element={<ReservationPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}