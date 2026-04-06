import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, Users, MapPin, Loader2, Receipt } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/useAuth";

interface Reservation {
  id: string;
  terrace_id: string;
  reservation_date: string; // YYYY-MM-DD
  adults_count: number;
  children_count: number;
  total_amount: number;
  status: string;
  created_at: string;
  terraces: {
    name: string;
  } | null;
}

interface MyReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyReservationsModal({ isOpen, onClose }: MyReservationsModalProps) {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user?.email) {
      fetchReservations();
    }
  }, [isOpen, user]);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("terrace_reservations")
        .select(`
          *,
          terraces(name)
        `)
        .eq("customer_email", user?.email)
        .order("reservation_date", { ascending: false });

      if (error) throw error;
      setReservations(data as unknown as Reservation[]);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "confirmada":
        return (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-[10px] uppercase tracking-wider font-semibold">
            Confirmada
          </span>
        );
      case "pending":
      case "pendiente":
        return (
          <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-[10px] uppercase tracking-wider font-semibold">
            Pendiente
          </span>
        );
      case "cancelled":
      case "cancelada":
        return (
          <span className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-[10px] uppercase tracking-wider font-semibold">
            Cancelada
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-500/20 text-gray-400 border border-gray-500/30 rounded-full text-[10px] uppercase tracking-wider font-semibold">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    // Asegurarse de que parseamos la fecha localmente
    const date = new Date(dateStr + "T00:00:00"); 
    return new Intl.DateTimeFormat("es-CR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#2A1F1A] border border-[#C89F6A]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 flex items-start justify-between border-b border-[#C89F6A]/20 bg-[#32251F]">
              <div>
                <h2 className="font-serif text-3xl text-white tracking-tight mb-2">
                  Mis <span className="text-[#C89F6A]">Reservas</span>
                </h2>
                <p className="text-[#9B8677] text-sm">
                  Historial de tus visitas a Como Caído del Cielo
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content List */}
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-[#C89F6A]">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="text-sm text-[#9B8677] uppercase tracking-widest">Cargando...</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-20 h-20 mx-auto bg-[#32251F] rounded-full flex items-center justify-center mb-6 border border-[#C89F6A]/20">
                    <Receipt className="w-8 h-8 text-[#C89F6A]" />
                  </div>
                  <h3 className="text-xl font-serif text-white mb-3">No tienes reservas aún</h3>
                  <p className="text-[#9B8677] max-w-sm mx-auto">
                    Cuando realices una reserva para nuestras terrazas, aparecerá aquí todo su historial y estado.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="bg-[#32251F] border border-[#C89F6A]/20 rounded-2xl p-5 md:p-6 transition-colors hover:border-[#C89F6A]/40"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin size={16} className="text-[#C89F6A]" />
                            <h4 className="text-lg font-serif text-white">
                              {reservation.terraces?.name ?? "Terraza"}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#9B8677] capitalize">
                            <Calendar size={14} />
                            {formatDate(reservation.reservation_date)}
                          </div>
                        </div>
                        <div className="self-start md:self-auto">
                          {getStatusBadge(reservation.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/5">
                        <div>
                          <p className="text-[10px] text-[#9B8677] uppercase tracking-wider mb-1">Total a Pagar</p>
                          <p className="text-white font-medium">
                            ₡{Number(reservation.total_amount).toLocaleString("es-CR")}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#9B8677] uppercase tracking-wider mb-1">Acompañantes</p>
                          <div className="flex items-center gap-1.5 text-white font-medium">
                            <Users size={14} className="text-[#C89F6A]" />
                            {reservation.adults_count + reservation.children_count}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] text-[#9B8677] uppercase tracking-wider mb-1">Detalle</p>
                          <p className="text-sm text-gray-400">
                            {reservation.adults_count} Adultos, {reservation.children_count} Niños
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
