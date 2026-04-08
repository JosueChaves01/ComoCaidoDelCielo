import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Users, CheckCircle, ChevronRight, ChevronLeft, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import {
  validatePhone,
  calculateTotalAmount,
  isWorkingDay,
  filterAvailableTerraces,
  BusinessRules,
  Terrace
} from "../../utils/reservation-logic";
import { es } from "date-fns/locale";
import { startOfWeek, addWeeks, format, addDays } from "date-fns";
import { useNavigate } from "react-router";

export default function ReservationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [rules, setRules] = useState<BusinessRules | null>(null);

  // Step 1: Personas
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);

  // Step 2: Terrazas & Fechas
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [weekReservations, setWeekReservations] = useState<{terrace_id: string, reservation_date: string}[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [terraces, setTerraces] = useState<Terrace[]>([]);
  const [availableTerraces, setAvailableTerraces] = useState<Terrace[]>([]);
  const [selectedTerrace, setSelectedTerrace] = useState<Terrace | null>(null);

  // Step 3: Datos
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (step === 2) {
      fetchWeekReservations(currentWeekStart);
    }
  }, [currentWeekStart, step]);

  const fetchWeekReservations = async (startDate: Date) => {
    const endDate = addDays(startDate, 6);
    const startStr = format(startDate, 'yyyy-MM-dd');
    const endStr = format(endDate, 'yyyy-MM-dd');

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('terrace_reservations')
        .select('terrace_id, reservation_date')
        .gte('reservation_date', startStr)
        .lte('reservation_date', endStr)
        .neq('status', 'cancelled');

      if (error) throw error;
      setWeekReservations(data || []);
    } catch (err: any) {
      console.error("Error fetching week reservations:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const { data: rulesData, error: rulesError } = await supabase.from('business_rules').select('*').eq('id', 1).single();
      if (rulesError) throw rulesError;
      if (rulesData) setRules(rulesData);

      const { data: terracesData, error: terracesError } = await supabase.from('terraces').select('*').order('title', { ascending: true });
      if (terracesError) throw terracesError;
      if (terracesData) setTerraces(terracesData);
    } catch (err: any) {
      console.error("Error fetching initial data:", err.message);
      toast.error("Error al cargar datos iniciales.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailability = async () => {
    const totalPeople = adultsCount + childrenCount;
    const available = filterAvailableTerraces(terraces, [], totalPeople);
    setAvailableTerraces(available);
    setStep(2);
  };

  const handleNextStep = () => {
    if (step === 1) {
      checkAvailability();
    } else if (step === 2) {
      if (!selectedTerrace || !selectedDate) return toast.error("Seleccione una terraza y fecha.");
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const totalAmount = calculateTotalAmount(adultsCount, childrenCount, rules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return toast.error("Complete todos los datos.");
    if (!validatePhone(phone)) return toast.error("Teléfono inválido.");

    setIsLoading(true);
    try {
      const { error } = await supabase.from('terrace_reservations').insert([
        {
          terrace_id: selectedTerrace!.id,
          customer_name: name,
          customer_phone: phone,
          adults_count: adultsCount,
          children_count: childrenCount,
          reservation_date: selectedDate,
          total_amount: totalAmount,
          status: 'pending'
        }
      ]);
      if (error) throw error;
      setStep(4);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const STEPS = [
    { num: 1, label: "Tu Visita" },
    { num: 2, label: "Terrazas y Fechas" },
    { num: 3, label: "Tus Datos" },
  ];

  return (
    <div className="min-h-screen bg-[#090B10] flex flex-col">
      {/* ---- BACKGROUND DECORATIONS ---- */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#C89F6A]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#7A553A]/10 rounded-full blur-[100px]" />
      </div>

      {/* ---- TOP NAV BAR ---- */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6 border-b border-white/5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2.5 text-white/50 hover:text-white transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium hidden sm:inline">Volver</span>
        </button>

        <div className="text-center">
          <p className="text-[#C89F6A] text-xs tracking-[0.3em] uppercase font-medium">Como Caído del Cielo</p>
          <h1 className="text-white font-serif text-xl mt-0.5">Reservar Terraza VIP</h1>
        </div>

        {/* Step counter */}
        <div className="text-white/30 text-sm font-medium hidden sm:block">
          {step < 4 ? `Paso ${step} de 3` : "¡Listo!"}
        </div>
        {/* Invisible spacer for mobile */}
        <div className="w-16 sm:hidden" />
      </header>

      {/* ---- MAIN CONTENT ---- */}
      <div className="relative z-10 flex flex-1 flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12 gap-8 lg:gap-12">

        {/* ---- LEFT SIDEBAR: Progress ---- */}
        {step < 4 && (
          <aside className="lg:w-72 flex-shrink-0">
            {/* Progress steps */}
            <div className="hidden lg:block sticky top-10">
              <h2 className="text-2xl font-light text-white mb-2">Tu <span className="text-[#C89F6A] font-medium">Reservación</span></h2>
              <p className="text-white/40 text-sm mb-10">Completa los pasos para asegurar tu lugar.</p>
              <div className="space-y-4">
                {STEPS.map((s) => (
                  <div
                    key={s.num}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                      step === s.num
                        ? 'bg-[#C89F6A]/10 border-[#C89F6A]/40 shadow-[0_4px_20px_rgba(200,159,106,0.1)]'
                        : step > s.num
                        ? 'bg-white/3 border-white/10'
                        : 'border-white/5 opacity-40'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all ${
                      step > s.num
                        ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                        : step === s.num
                        ? 'bg-[#C89F6A] text-black'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      {step > s.num ? <CheckCircle size={16} /> : s.num}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold text-white/40 mb-0.5">Paso {s.num}</p>
                      <p className={`font-medium ${step >= s.num ? 'text-white' : 'text-white/40'}`}>{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary card (visible after step 1) */}
              {(adultsCount > 1 || childrenCount > 0) && step > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-5 rounded-2xl bg-[#11141D] border border-white/10"
                >
                  <p className="text-xs uppercase tracking-widest text-white/40 mb-3 font-medium">Tu visita</p>
                  <div className="flex gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-white/70"><Users size={14} className="text-[#C89F6A]" /> {adultsCount} adulto{adultsCount !== 1 ? 's' : ''}</span>
                    {childrenCount > 0 && <span className="flex items-center gap-1.5 text-white/70"><Users size={14} /> {childrenCount} niño{childrenCount !== 1 ? 's' : ''}</span>}
                  </div>
                  {rules && (
                    <p className="text-[#C89F6A] font-semibold mt-3 text-lg">₡{totalAmount.toLocaleString()}</p>
                  )}
                </motion.div>
              )}
            </div>

            {/* Mobile: horizontal stepper */}
            <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.num}>
                  <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step > s.num ? 'bg-green-500' : step === s.num ? 'bg-[#C89F6A]' : 'bg-white/10'}`} />
                  {i < STEPS.length - 1 && <div className="w-1" />}
                </React.Fragment>
              ))}
            </div>
          </aside>
        )}

        {/* ---- RIGHT CONTENT AREA ---- */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">

            {/* ===== STEP 1: PERSONAS ===== */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h2 className="text-3xl lg:text-4xl font-light text-white mb-3">¿Cuántas personas <span className="text-[#C89F6A]">asistirán?</span></h2>
                <p className="text-white/40 mb-10">Selecciona el aforo para encontrar la terraza perfecta para tu grupo.</p>

                <div className="max-w-lg space-y-6">
                  {/* Adults */}
                  <div className="bg-[#11141D] border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <p className="text-white font-medium text-lg">Adultos</p>
                        <p className="text-white/40 text-sm">Mayores de 12 años</p>
                      </div>
                      {rules && <span className="text-[#C89F6A] font-medium text-sm bg-[#C89F6A]/10 px-3 py-1 rounded-full border border-[#C89F6A]/20">₡{rules.adult_price.toLocaleString()} c/u</span>}
                    </div>
                    <div className="flex items-center bg-[#090B10] rounded-xl p-1.5 border border-white/10">
                      <button onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))} className="w-12 h-12 text-2xl text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5">−</button>
                      <div className="flex-1 text-center text-2xl text-white font-medium">{adultsCount}</div>
                      <button onClick={() => setAdultsCount(adultsCount + 1)} className="w-12 h-12 text-2xl text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5">+</button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="bg-[#11141D] border border-white/10 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <p className="text-white font-medium text-lg">Niños</p>
                        <p className="text-white/40 text-sm">Menores de 12 años</p>
                      </div>
                      {rules && <span className="text-[#C89F6A] font-medium text-sm bg-[#C89F6A]/10 px-3 py-1 rounded-full border border-[#C89F6A]/20">₡{rules.child_price.toLocaleString()} c/u</span>}
                    </div>
                    <div className="flex items-center bg-[#090B10] rounded-xl p-1.5 border border-white/10">
                      <button onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className="w-12 h-12 text-2xl text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5">−</button>
                      <div className="flex-1 text-center text-2xl text-white font-medium">{childrenCount}</div>
                      <button onClick={() => setChildrenCount(childrenCount + 1)} className="w-12 h-12 text-2xl text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5">+</button>
                    </div>
                  </div>

                  {/* Total preview */}
                  {rules && (
                    <div className="flex justify-between items-center px-2 text-lg">
                      <span className="text-white/60">Total estimado</span>
                      <span className="text-[#C89F6A] font-bold">₡{totalAmount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ===== STEP 2: TERRAZAS & FECHAS ===== */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-6">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-light text-white mb-2">Terrazas <span className="text-[#C89F6A]">Disponibles</span></h2>
                    <p className="text-white/40">Encontramos {availableTerraces.length} opción(es) para su aforo.</p>
                  </div>

                  {/* Week navigator */}
                  <div className="inline-flex items-center bg-[#11141D] border border-white/10 rounded-full p-1.5">
                    <button
                      onClick={() => setCurrentWeekStart(w => addWeeks(w, -1))}
                      disabled={currentWeekStart <= startOfWeek(new Date(), { weekStartsOn: 1 })}
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="px-5 border-x border-white/10 flex items-center gap-2 h-8">
                      <CalendarIcon size={15} className="text-[#C89F6A]" />
                      <span className="text-white text-sm font-medium tracking-wide capitalize">
                        {format(currentWeekStart, "d MMM", { locale: es })} — {format(addDays(currentWeekStart, 6), "d MMM yyyy", { locale: es })}
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentWeekStart(w => addWeeks(w, 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {availableTerraces.length === 0 ? (
                  <div className="p-10 border border-white/10 rounded-3xl bg-white/5 text-center flex flex-col items-center max-w-xl mx-auto">
                    <Users className="w-16 h-16 text-[#C89F6A]/50 mb-6" />
                    <p className="text-white text-xl font-medium mb-2">Ninguna terraza cumple con el aforo</p>
                    <p className="text-white/50 mb-8">Por favor, regresa y divide a tu grupo o contáctanos para eventos especiales.</p>
                    <button onClick={handlePrevStep} className="px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition">Volver atrás</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {availableTerraces.map((terrace) => (
                      <div
                        key={terrace.id}
                        className={`relative flex flex-col bg-[#11141D] p-5 lg:p-6 rounded-3xl border-2 transition-all duration-300 ${
                          selectedTerrace?.id === terrace.id
                            ? 'border-[#C89F6A] shadow-[0_4px_40px_rgba(200,159,106,0.15)] bg-[#C89F6A]/5'
                            : 'border-white/5 hover:border-white/15'
                        }`}
                      >
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 gap-2">
                          <h3 className="text-xl md:text-2xl text-white font-serif truncate">{terrace.title}</h3>
                          <div className="flex-shrink-0 border border-white/10 bg-[#090B10] px-3 py-1.5 rounded-full text-white/80 text-xs md:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap">
                            <Users size={14} className="text-[#C89F6A]" />
                            {terrace.highlight ?? `Capacidad ${terrace.max_capacity}`}
                          </div>
                        </div>

                        {/* Image */}
                        <div className="h-48 md:h-52 relative rounded-2xl border border-white/10 overflow-hidden mb-6">
                          <img src={terrace.image_url} alt={terrace.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>

                        {/* Calendar Week Matrix */}
                        <div className="mt-auto">
                          <div className="flex justify-between mb-3 px-1">
                            <span className="text-sm font-medium text-white/50">Selecciona el día:</span>
                            {selectedTerrace?.id === terrace.id && selectedDate && (
                              <span className="text-sm font-semibold text-[#C89F6A] bg-[#C89F6A]/10 px-3 py-0.5 rounded-full border border-[#C89F6A]/30 flex items-center gap-1">
                                <CheckCircle size={13} /> {format(new Date(selectedDate + "T12:00:00"), "EEEE d MMM", { locale: es })}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-7 gap-1 md:gap-1.5">
                            {Array.from({ length: 7 }).map((_, i) => {
                              const dayDate = addDays(currentWeekStart, i);
                              const dayStr = format(dayDate, 'yyyy-MM-dd');
                              const dayNameStr = format(dayDate, 'eeee', { locale: es });
                              const dayLabel = dayNameStr.substring(0, 2).toUpperCase();
                              const isPast = dayDate < new Date(new Date().setHours(0, 0, 0, 0));
                              const isWorking = isWorkingDay(dayStr, rules);
                              const isBooked = weekReservations.some(r => r.terrace_id === terrace.id && r.reservation_date === dayStr);
                              const isAvailable = !isPast && isWorking && !isBooked;
                              const isSelected = selectedDate === dayStr && selectedTerrace?.id === terrace.id;

                              let cls = '';
                              if (!isAvailable) cls = 'bg-[#1a1515] border-red-500/20 text-red-500/40 cursor-not-allowed';
                              else if (isSelected) cls = 'bg-[#C89F6A] border-[#C89F6A] text-black shadow-lg shadow-[#C89F6A]/25 scale-110 z-10 font-bold';
                              else cls = 'bg-[#15201A] border-green-500/40 text-green-400 hover:bg-[#1A2A20] hover:border-green-500 hover:scale-105 cursor-pointer';

                              return (
                                <div
                                  key={i}
                                  onClick={() => { if (isAvailable) { setSelectedTerrace(terrace); setSelectedDate(dayStr); } }}
                                  title={!isWorking ? "Cerrado" : isBooked ? "Ocupado" : isPast ? "Día pasado" : "Haz clic para seleccionar"}
                                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 aspect-[3/4] ${cls}`}
                                >
                                  <span className={`text-[0.6rem] md:text-[0.65rem] font-semibold uppercase mb-1 ${!isAvailable ? 'opacity-50' : ''}`}>{dayLabel}</span>
                                  <span className="text-xl md:text-2xl">{format(dayDate, 'd')}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ===== STEP 3: DATOS ===== */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-3xl lg:text-4xl font-light text-white mb-3">Completa tu <span className="text-[#C89F6A]">Reservación</span></h2>
                <p className="text-white/40 mb-10">Casi listo. Déjanos tus datos para confirmar.</p>

                <div className="max-w-xl">
                  {/* Summary card */}
                  <div className="p-5 bg-[#11141D] border border-white/10 rounded-2xl mb-8 space-y-2">
                    <p className="text-white/50 text-xs uppercase tracking-widest font-medium mb-3">Resumen</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Terraza</span>
                      <span className="text-[#C89F6A] font-semibold">{selectedTerrace?.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Fecha</span>
                      <span className="text-white capitalize">{selectedDate && format(new Date(selectedDate + "T12:00:00"), "EEEE d MMMM yyyy", { locale: es })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Personas</span>
                      <span className="text-white">{adultsCount} Adultos{childrenCount > 0 ? `, ${childrenCount} Niños` : ''}</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 mt-3 flex justify-between text-lg">
                      <span className="text-white">Total a Pagar</span>
                      <span className="text-[#C89F6A] font-bold">₡{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <form id="reservation-form" onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium tracking-wide text-white/70 mb-2">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-[#11141D] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#C89F6A] transition-colors placeholder-white/20"
                        placeholder="Ej. Juan Pérez"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium tracking-wide text-white/70 mb-2">Teléfono de Contacto</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-[#11141D] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#C89F6A] transition-colors placeholder-white/20"
                        placeholder="Ej. 8888-8888"
                      />
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ===== STEP 4: SUCCESS ===== */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-20 min-h-[60vh]"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-8 border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.15)]"
                >
                  <CheckCircle size={48} />
                </motion.div>
                <h2 className="text-4xl text-white mb-4 font-light">¡Reservación <span className="text-[#C89F6A] font-medium">Recibida!</span></h2>
                <p className="text-white/50 max-w-md mx-auto mb-10 leading-relaxed text-lg">
                  Tu solicitud para la <strong className="text-white">{selectedTerrace?.title}</strong> el día <strong className="text-white capitalize">{selectedDate && format(new Date(selectedDate + "T12:00:00"), "EEEE d 'de' MMMM", { locale: es })}</strong> ha sido enviada con éxito.
                  <br /><br />
                  Nuestro equipo se pondrá en contacto al <strong className="text-[#C89F6A]">{phone}</strong> para confirmar.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-10 py-4 bg-[#C89F6A] text-black font-semibold rounded-xl hover:bg-[#D5B285] transition-colors shadow-[0_4px_20px_rgba(200,159,106,0.3)]"
                >
                  Volver al inicio
                </button>
              </motion.div>
            )}

          </AnimatePresence>

          {/* ---- BOTTOM ACTION BAR ---- */}
          {step < 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 mt-10 pt-8 border-t border-white/5"
            >
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isLoading}
                  className="px-6 py-4 flex items-center gap-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50"
                >
                  <ChevronLeft size={18} /> Atrás
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading || (step === 2 && (!selectedTerrace || !selectedDate))}
                  className="flex-1 px-8 py-4 bg-[#C89F6A] text-black font-semibold rounded-xl hover:bg-[#D5B285] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(200,159,106,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>Continuar <ChevronRight size={18} /></>
                  )}
                </button>
              ) : (
                <button
                  type="submit"
                  form="reservation-form"
                  disabled={isLoading}
                  className="flex-1 px-8 py-4 bg-[#C89F6A] text-black font-semibold rounded-xl hover:bg-[#D5B285] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(200,159,106,0.3)] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    `Confirmar por ₡${totalAmount.toLocaleString()}`
                  )}
                </button>
              )}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
