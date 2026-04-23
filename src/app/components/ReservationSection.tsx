import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  Loader2,
  Lock
} from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/useAuth";
import { BusinessRules, Terrace, calculateTotalAmount } from "../../utils/reservation-logic";
import { WhatsAppVerificationModal } from "./WhatsAppVerificationModal";

export function ReservationSection() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rules, setRules] = useState<BusinessRules | null>(null);
  const [terraces, setTerraces] = useState<Terrace[]>([]);
  const [weekReservations, setWeekReservations] = useState<any[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Filters
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // Modals
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState<{ terrace: Terrace; date: string } | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchWeekReservations();
  }, [currentWeekStart]);

  const fetchInitialData = async () => {
    try {
      const [{ data: rulesData }, { data: terracesData }] = await Promise.all([
        supabase.from('business_rules').select('*').eq('id', 1).single(),
        supabase.from('terraces').select('*').order('title', { ascending: true })
      ]);
      
      if (rulesData) setRules(rulesData);
      if (terracesData) setTerraces(terracesData);
    } catch (err) {
      console.error("Error fetching initial data", err);
    }
  };

  const fetchWeekReservations = async () => {
    setLoading(true);
    const end = addDays(currentWeekStart, 6);
    try {
      const { data } = await supabase
        .from('terrace_reservations')
        .select('terrace_id, reservation_date')
        .gte('reservation_date', format(currentWeekStart, 'yyyy-MM-dd'))
        .lte('reservation_date', format(end, 'yyyy-MM-dd'))
        .not('status', 'in', "('cancelled','rechazada','reembolsada')");
      
      setWeekReservations(data || []);
    } catch (err) {
      console.error("Error fetching reservations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = (terrace: Terrace, date: string) => {
    if (!user) {
      // Trigger login - dispatch custom event or use auth hook
      window.dispatchEvent(new CustomEvent('open-auth-panel'));
      return;
    }

    if (!profile?.is_verified) {
      setBookingData({ terrace, date });
      setIsVerifyModalOpen(true);
      return;
    }

    // Proceed to final confirmation step (already verified)
    // For now, redirect or open a final confirmation modal
    window.location.href = `/checkout?terrace=${terrace.id}&date=${date}&adults=${adults}&children=${children}`;
  };

  const totalAmount = calculateTotalAmount(adults, children, rules);
  const days = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  return (
    <section id="reservar" className="relative py-24 bg-[#090B10] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C89F6A]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7A553A]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[#C89F6A] text-xs tracking-[0.4em] uppercase font-bold block mb-4"
          >
            Disponibilidad en Tiempo Real
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-white mb-6"
          >
            Reserva tu <span className="italic text-[#C89F6A]">Terraza VIP</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 max-w-2xl mx-auto"
          >
            Selecciona la cantidad de acompañantes y elige tu terraza favorita. 
            Visualiza la disponibilidad semanal y asegura tu lugar en el mirador más exclusivo.
          </motion.p>
        </div>

        {/* Filters and Pricing */}
        <div className="bg-[#12151C]/80 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 md:p-12 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Guest Selector */}
            <div className="lg:col-span-5 flex flex-wrap gap-6">
              <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-3 block ml-1">
                  Adultos
                </label>
                <div className="flex items-center bg-white/5 rounded-2xl p-2 border border-white/10">
                  <button 
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >-</button>
                  <span className="flex-1 text-center text-white font-bold">{adults}</span>
                  <button 
                    onClick={() => setAdults(adults + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#C89F6A]/20 text-[#C89F6A] hover:bg-[#C89F6A]/30 transition-colors"
                  >+</button>
                </div>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-3 block ml-1">
                  Niños
                </label>
                <div className="flex items-center bg-white/5 rounded-2xl p-2 border border-white/10">
                  <button 
                    onClick={() => setChildren(Math.max(0, children - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >-</button>
                  <span className="flex-1 text-center text-white font-bold">{children}</span>
                  <button 
                    onClick={() => setChildren(children + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#C89F6A]/20 text-[#C89F6A] hover:bg-[#C89F6A]/30 transition-colors"
                  >+</button>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
               <div className="flex items-center gap-3 mb-2 px-4 py-1.5 bg-[#C89F6A]/10 rounded-full border border-[#C89F6A]/20">
                  <Info size={14} className="text-[#C89F6A]" />
                  <span className="text-[#C89F6A] text-[10px] uppercase tracking-wider font-bold">Resumen de Inversión</span>
               </div>
               <div className="flex items-baseline gap-2">
                 <span className="text-4xl font-serif text-white">₡{totalAmount.toLocaleString('es-CR')}</span>
                 <span className="text-white/30 text-xs uppercase tracking-widest">Total</span>
               </div>
            </div>

            {/* Week Navigator */}
            <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-4">
              <button 
                onClick={() => setCurrentWeekStart(d => addDays(d, -7))}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-center px-4">
                <span className="text-white font-medium block whitespace-nowrap">
                  {format(currentWeekStart, 'd MMM', { locale: es })} - {format(addDays(currentWeekStart, 6), 'd MMM', { locale: es })}
                </span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest">{currentWeekStart.getFullYear()}</span>
              </div>
              <button 
                onClick={() => setCurrentWeekStart(d => addDays(d, 7))}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/10"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Availability Grid: Horizontal scroll on mobile, Grid on desktop */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-x-auto md:overflow-x-visible pb-12 md:pb-0 snap-x snap-mandatory hide-scrollbar">
          {terraces.map((terrace) => {
            const isFull = terrace.max_capacity < (adults + children);
            
            return (
              <motion.div 
                layout
                key={terrace.id}
                className={`min-w-[90vw] md:min-w-0 snap-center bg-[#11141D] border border-white/5 rounded-[2.5rem] overflow-hidden transition-all hover:bg-[#151924] flex flex-col h-full group ${isFull ? 'opacity-40 grayscale pointer-events-none' : ''}`}
              >
                {/* Header: Name & Capacity */}
                <div className="p-8 pb-5 flex justify-between items-center">
                  <h3 className="text-xl font-serif text-white tracking-tight group-hover:text-[#C89F6A] transition-colors">{terrace.title}</h3>
                  <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-white/60 font-bold uppercase tracking-wider">
                    <Users size={12} /> {terrace.max_capacity}
                  </div>
                </div>

                {/* Image Section */}
                <div className="px-6 h-52 relative">
                  <div className="w-full h-full rounded-3xl overflow-hidden border border-white/10 relative">
                    <img 
                      src={terrace.image_url} 
                      alt={terrace.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {isFull && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full">Capacidad Excedida</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Availability Matrix (7 Days) */}
                <div className="p-8 pt-6 flex flex-col gap-3">
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mb-1 px-1">Disponibilidad de la semana</p>
                  
                  {/* Row 1: Mon - Thu */}
                  <div className="grid grid-cols-4 gap-2">
                    {days.slice(0, 4).map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const isBooked = weekReservations.some(r => r.terrace_id === terrace.id && r.reservation_date === dateStr);
                      const isPast = day < new Date(new Date().setHours(0,0,0,0));
                      const isAvailable = !isBooked && !isPast;

                      return (
                        <button
                          key={dateStr}
                          disabled={!isAvailable}
                          onClick={() => handleBookingClick(terrace, dateStr)}
                          className={`
                            flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-300
                            ${!isAvailable 
                              ? 'bg-red-500/10 border-red-500/20 text-red-400 opacity-50 cursor-not-allowed' 
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:scale-105 shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/20'
                            }
                          `}
                        >
                          <span className="text-[8px] uppercase font-bold tracking-widest">{format(day, 'eee', { locale: es })}</span>
                          <span className="text-sm font-bold">{format(day, 'd')}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Row 2: Fri - Sun */}
                  <div className="grid grid-cols-3 gap-2">
                    {days.slice(4, 7).map((day) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const isBooked = weekReservations.some(r => r.terrace_id === terrace.id && r.reservation_date === dateStr);
                      const isPast = day < new Date(new Date().setHours(0,0,0,0));
                      const isAvailable = !isBooked && !isPast;

                      return (
                        <button
                          key={dateStr}
                          disabled={!isAvailable}
                          onClick={() => handleBookingClick(terrace, dateStr)}
                          className={`
                            flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all duration-300
                            ${!isAvailable 
                              ? 'bg-red-500/10 border-red-500/20 text-red-400 opacity-50 cursor-not-allowed' 
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:scale-105 shadow-lg shadow-emerald-500/0 hover:shadow-emerald-500/20'
                            }
                          `}
                        >
                          <span className="text-[8px] uppercase font-bold tracking-widest">{format(day, 'eee', { locale: es })}</span>
                          <span className="text-sm font-bold">{format(day, 'd')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-white/30">
           <div className="flex items-center gap-3">
             <div className="w-4 h-4 rounded-md bg-emerald-500/20 border border-emerald-500/30" />
             Disponible
           </div>
           <div className="flex items-center gap-3">
             <div className="w-4 h-4 rounded-md bg-red-500/20 border border-red-500/30" />
             Reservado / No Disponible
           </div>
           <div className="flex items-center gap-3">
             <Users size={14} className="text-[#C89F6A]" />
             Basado en {adults + children} personas
           </div>
        </div>
      </div>

      {/* Verification Modal */}
      <WhatsAppVerificationModal 
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onSuccess={() => {
          if (bookingData) {
            handleBookingClick(bookingData.terrace, bookingData.date);
          }
        }}
      />
    </section>
  );
}
