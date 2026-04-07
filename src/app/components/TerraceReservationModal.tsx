import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar as CalendarIcon, Users, CheckCircle, Info, ChevronRight, ChevronLeft, CalendarClock } from "lucide-react";
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
import { Calendar as CalendarUI } from "./ui/calendar";
import { es } from "date-fns/locale";

interface TerraceReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TerraceReservationModal({ isOpen, onClose }: TerraceReservationModalProps) {
  const [step, setStep] = useState(1);
  const [rules, setRules] = useState<BusinessRules | null>(null);
  
  // Step 1: Fecha y Personas
  const [selectedDate, setSelectedDate] = useState("");
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);

  // Step 2: Terrazas
  const [terraces, setTerraces] = useState<Terrace[]>([]);
  const [availableTerraces, setAvailableTerraces] = useState<Terrace[]>([]);
  const [selectedTerrace, setSelectedTerrace] = useState<Terrace | null>(null);

  // Step 3: Datos
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedTerrace(null);
      setSelectedDate("");
      setName("");
      setPhone("");
      setAdultsCount(1);
      setChildrenCount(0);
      setAvailableTerraces([]);
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      // Fetch rules
      const { data: rulesData, error: rulesError } = await supabase.from('business_rules').select('*').eq('id', 1).single();
      if (rulesError) throw rulesError;
      if (rulesData) setRules(rulesData);

      // Fetch all terraces
      const { data: terracesData, error: terracesError } = await supabase.from('terraces').select('*').order('title', { ascending: true });
      if (terracesError) throw terracesError;
      if (terracesData) setTerraces(terracesData);
    } catch (err: any) {
      console.error("Error fetching initial data:", err.message);
      toast.error("Error al cargar datos iniciales. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!selectedDate) return toast.error("Selecciona una fecha");
    if (!isWorkingDay(selectedDate, rules)) return toast.error("El local está cerrado en esa fecha según el horario.");
    
    setIsLoading(true);
    try {
      // Fetch reservations for that date that are NOT cancelled
      const { data: reservations, error: resError } = await supabase
        .from('terrace_reservations')
        .select('terrace_id')
        .eq('reservation_date', selectedDate)
        .neq('status', 'cancelled');
      
      if (resError) throw resError;
      
      const bookedTerraceIds = reservations?.map(r => r.terrace_id) || [];
      const totalPeople = adultsCount + childrenCount;
      
      const available = filterAvailableTerraces(terraces, bookedTerraceIds, totalPeople);

      setAvailableTerraces(available);
      setSelectedTerrace(null);
      setStep(2);

      if (available.length === 0) {
        toast("No hay terrazas disponibles", {
          description: "Intenta con otra fecha o reduce la cantidad de personas.",
          icon: <Users className="w-4 h-4" />
        });
      }
    } catch (err: any) {
      console.error("Error checking availability:", err.message);
      toast.error("Error al verificar disponibilidad.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      checkAvailability();
    } else if (step === 2) {
      if (!selectedTerrace) return toast.error("Seleccione una terraza para continuar.");
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) setSelectedTerrace(null);
    setStep(step - 1);
  };

  const totalAmount = calculateTotalAmount(adultsCount, childrenCount, rules);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return toast.error("Por favor, complete todos los datos requeridos.");
    
    if (!validatePhone(phone)) {
      return toast.error("Por favor, ingrese un número de teléfono válido (8 dígitos).");
    }
    
    setIsLoading(true);
    const toastId = toast.loading("Procesando reservación...");

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
          status: 'pending' // pending by default
        }
      ]);

      if (error) {
        if (error.code === '23505') { 
          throw new Error("Lamentablemente, esta terraza ya fue reservada para la fecha seleccionada mientras llenabas el formulario.");
        }
        throw new Error("Error interno al crear reservación.");
      }

      toast.success("¡Reservación enviada!", { id: toastId });
      setStep(4); // Success step
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={step === 4 ? onClose : undefined}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-6xl xl:max-w-7xl bg-[#090B10] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[95vh] lg:h-[85vh]"
      >
        {/* Left Side / Sidebar Informational */}
        <div className="md:w-80 flex-shrink-0 bg-[#11141D] p-8 hidden md:flex flex-col border-r border-white/5 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C89F6A]/5 blur-[60px] rounded-full"></div>
          
          <h2 className="text-2xl font-light text-white mb-6">Reservar <br/><span className="text-[#C89F6A] font-medium">Terraza VIP</span></h2>
          
          <div className="space-y-6 flex-1">
            <div className={`p-4 rounded-xl border transition-all ${step >= 1 ? 'bg-[#C89F6A]/10 border-[#C89F6A]/30 text-white' : 'border-white/5 text-white/40'}`}>
              <p className="text-xs uppercase tracking-widest font-bold mb-1 opacity-70">Paso 1</p>
              <p className="font-medium">Tu Visita</p>
            </div>
            <div className={`p-4 rounded-xl border transition-all ${step >= 2 ? 'bg-[#C89F6A]/10 border-[#C89F6A]/30 text-white' : 'border-white/5 text-white/40'}`}>
              <p className="text-xs uppercase tracking-widest font-bold mb-1 opacity-70">Paso 2</p>
              <p className="font-medium">Terrazas Disponibles</p>
            </div>
            <div className={`p-4 rounded-xl border transition-all ${step >= 3 ? 'bg-[#C89F6A]/10 border-[#C89F6A]/30 text-white' : 'border-white/5 text-white/40'}`}>
              <p className="text-xs uppercase tracking-widest font-bold mb-1 opacity-70">Paso 3</p>
              <p className="font-medium">Tus Datos</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-[#C89F6A]/10 rounded-xl border border-[#C89F6A]/20">
            <div className="flex items-start gap-3 text-sm text-[#C89F6A]">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>El alquiler es por <strong>día completo</strong>{rules ? ` de ${rules.opening_time.slice(0,5)} a ${rules.closing_time.slice(0,5)}` : ''}.</p>
            </div>
          </div>
        </div>

        {/* Right Side / Content */}
        <div className="w-full flex-1 flex flex-col h-[80vh] md:h-auto overflow-hidden">
          {/* Header Mobile & Close */}
          <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-20 bg-[#090B10]">
            <h3 className="text-xl text-white font-medium md:hidden">Reservación de Terraza</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors ml-auto"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:px-10 relative">
            <AnimatePresence mode="wait">
              
              {/* ------------ STEP 1: DATE AND PEOPLE ------------ */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl lg:max-w-5xl mx-auto mt-4 lg:mt-6">
                  <h3 className="text-3xl lg:text-4xl font-light text-white mb-3">Cuéntanos de tu visita</h3>
                  <p className="text-white/50 text-lg mb-10">Elige el día y cuántas personas te acompañarán.</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-stretch">
                    {/* Fecha */}
                    <div className="flex flex-col">
                      <label className="block text-base font-medium tracking-wide text-white/80 mb-4">Fecha de Reservación</label>
                      <div className="bg-[#11141D] flex-1 border border-white/10 rounded-3xl p-6 md:p-8 shadow-inner relative flex flex-col items-center justify-center">
                        <CalendarUI
                          mode="single"
                          locale={es}
                          selected={selectedDate ? new Date(selectedDate + "T12:00:00") : undefined}
                          onSelect={(date) => {
                            if (date) {
                              const d = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                              setSelectedDate(d.toISOString().split("T")[0]);
                            } else {
                              setSelectedDate("");
                            }
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            return date < today;
                          }}
                          className="w-full flex justify-center text-white"
                          classNames={{
                            months: "w-full",
                            month: "w-full space-y-6",
                            caption: "flex justify-center pt-2 relative items-center w-full mb-6",
                            caption_label: "text-xl md:text-2xl font-medium tracking-wide text-white capitalize",
                            nav: "flex items-center gap-2",
                            nav_button: "h-10 w-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-colors text-white/80 hover:text-white border border-white/10",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse",
                            head_row: "w-full grid grid-cols-7 mb-4",
                            head_cell: "text-white/40 font-medium text-[0.8rem] md:text-sm uppercase tracking-wider text-center flex items-center justify-center",
                            row: "w-full grid grid-cols-7 mt-2 md:mt-3",
                            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 w-full flex justify-center items-center",
                            day: "h-11 w-11 md:h-12 md:w-12 lg:h-14 lg:w-14 p-0 md:text-lg font-normal hover:bg-white/10 rounded-full transition-colors flex items-center justify-center mx-auto",
                            day_selected: "bg-[#C89F6A] text-black hover:bg-[#D5B285] hover:text-black font-semibold shadow-[0_2px_15px_rgba(200,159,106,0.35)] scale-110",
                            day_today: "bg-[#C89F6A]/20 text-[#C89F6A]",
                            day_outside: "text-white/20 opacity-30",
                            day_disabled: "text-white/10 cursor-not-allowed",
                          }}
                        />
                      </div>
                      {selectedDate && !isWorkingDay(selectedDate, rules) && (
                        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm md:text-base mt-4 flex items-center gap-2 bg-red-400/10 border border-red-400/20 p-4 rounded-xl">
                          <X className="w-5 h-5 flex-shrink-0" /> Local cerrado en esta fecha.
                        </motion.p>
                      )}
                    </div>

                    {/* Personas */}
                    <div className="flex flex-col">
                      <label className="block text-base font-medium tracking-wide text-white/80 mb-4">Acompañantes</label>
                      <div className="bg-[#11141D] flex-1 border border-white/10 rounded-3xl p-8 lg:p-10 flex flex-col justify-center">
                        
                        <div className="space-y-10 flex-1 flex flex-col justify-center">
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-white font-medium text-lg lg:text-xl">Adultos</span>
                              {rules && <span className="text-sm font-semibold text-[#C89F6A]">₡{rules.adult_price.toLocaleString()} c/u</span>}
                            </div>
                            <div className="flex items-center bg-[#090B10] border border-white/10 rounded-2xl overflow-hidden p-1.5 shadow-inner h-16 md:h-20">
                              <button type="button" onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))} className="h-full w-16 md:w-20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-3xl font-light transition-colors">-</button>
                              <div className="flex-1 text-center font-medium text-2xl md:text-3xl text-white">{adultsCount}</div>
                              <button type="button" onClick={() => setAdultsCount(adultsCount + 1)} className="h-full w-16 md:w-20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-3xl font-light transition-colors">+</button>
                            </div>
                          </div>
                          
                          <div className="pt-8 border-t border-white/5">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-white font-medium text-lg lg:text-xl">Niños</span>
                              {rules && <span className="text-sm font-semibold text-[#C89F6A]">₡{rules.child_price.toLocaleString()} c/u</span>}
                            </div>
                            <div className="flex items-center bg-[#090B10] border border-white/10 rounded-2xl overflow-hidden p-1.5 shadow-inner h-16 md:h-20">
                              <button type="button" onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className="h-full w-16 md:w-20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-3xl font-light transition-colors">-</button>
                              <div className="flex-1 text-center font-medium text-2xl md:text-3xl text-white">{childrenCount}</div>
                              <button type="button" onClick={() => setChildrenCount(childrenCount + 1)} className="h-full w-16 md:w-20 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-xl text-3xl font-light transition-colors">+</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ------------ STEP 2: AVAILABLE TERRACES ------------ */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-2xl text-white mb-2">Terrazas Disponibles</h3>
                  <p className="text-white/50 mb-6">Encontramos {availableTerraces.length} opcion(es) con capacidad apta el {selectedDate}.</p>
                  
                  {availableTerraces.length === 0 ? (
                    <div className="p-8 border border-white/10 rounded-2xl bg-white/5 text-center flex flex-col items-center max-w-2xl mx-auto">
                      <CalendarClock className="w-12 h-12 text-white/20 mb-4" />
                      <p className="text-white font-medium mb-1">Todas ocupadas o capacidad insuficiente</p>
                      <p className="text-white/50 text-sm">Por favor, regresa e intenta con otra fecha o menos personas.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {availableTerraces.map((terrace) => (
                        <div
                          key={terrace.id}
                          className={`relative flex flex-col bg-[#11141D] p-5 rounded-2xl cursor-pointer border-2 transition-all ${selectedTerrace?.id === terrace.id ? 'border-[#C89F6A] shadow-[0_4px_25px_rgba(200,159,106,0.2)] bg-[#C89F6A]/5' : 'border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                          onClick={() => setSelectedTerrace(terrace)}
                        >
                          {/* Top: Nombre and Capacidad boxes */}
                          <div className="flex justify-between items-center mb-4 truncate gap-2">
                            <div className="border border-white/20 bg-[#090B10] px-4 py-2 rounded-lg text-white font-medium text-sm truncate max-w-[65%] shadow-sm">
                              {terrace.title}
                            </div>
                            <div className="flex-shrink-0 border border-white/20 bg-[#090B10] px-3 py-2 rounded-lg text-white/80 text-xs font-medium flex items-center gap-1.5 shadow-sm">
                              <Users size={14} className="text-[#C89F6A]" /> {terrace.highlight ? terrace.highlight : `Capacidad ${terrace.max_capacity}`}
                            </div>
                          </div>

                          {/* Middle: IMG */}
                          <div className="h-40 relative rounded-xl border border-white/10 overflow-hidden mb-5">
                            <img src={terrace.image_url} alt={terrace.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#11141D]/80 via-transparent to-transparent" />
                            {selectedTerrace?.id === terrace.id && (
                              <div className="absolute top-3 right-3 bg-[#C89F6A] text-black w-7 h-7 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircle size={16} />
                              </div>
                            )}
                          </div>

                          {/* Bottom: Week days styled like the mockup */}
                          <div className="flex flex-col gap-2 mt-auto">
                            <div className="flex justify-center gap-2 w-full">
                              {['Lunes', 'Martes', 'Miercoles', 'Jueves'].map(day => {
                                const checkDay = day === 'Miercoles' ? 'Miércoles' : day;
                                const isWorking = rules?.working_days?.includes(checkDay);
                                return (
                                  <span key={day} className={`flex-1 text-center text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold px-0 py-1.5 rounded-md border transition-colors ${isWorking ? 'bg-[#2E7D32]/20 text-green-400 border-green-500/30' : 'bg-[#D32F2F]/20 text-red-400 border-red-500/30'}`}>
                                    {day}
                                  </span>
                                )
                              })}
                            </div>
                            <div className="flex justify-center gap-2 w-full px-6">
                              {['Viernes', 'Sabado', 'Domingo'].map(day => {
                                const checkDay = day === 'Sabado' ? 'Sábado' : day;
                                const isWorking = rules?.working_days?.includes(checkDay);
                                return (
                                  <span key={day} className={`flex-1 text-center text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold px-0 py-1.5 rounded-md border transition-colors ${isWorking ? 'bg-[#2E7D32]/20 text-green-400 border-green-500/30' : 'bg-[#D32F2F]/20 text-red-400 border-red-500/30'}`}>
                                    {day}
                                  </span>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ------------ STEP 3: DETAILS & CONFIRMATION ------------ */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-2xl text-white mb-6">Completa tu Reservación</h3>
                  
                  <form id="reservation-form" onSubmit={handleSubmit} className="space-y-5">
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
                      <p className="text-white/80 text-sm mb-1">Terraza: <span className="text-[#C89F6A] font-semibold">{selectedTerrace?.title}</span></p>
                      <p className="text-white/80 text-sm mb-1">Fecha: <span className="text-white">{selectedDate}</span></p>
                      <p className="text-white/80 text-sm">Personas: <span className="text-white">{adultsCount} Adultos, {childrenCount} Niños</span></p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium tracking-wide text-white/80 mb-2">Nombre Completo</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#11141D] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#C89F6A]" placeholder="Ej. Juan Pérez" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium tracking-wide text-white/80 mb-2">Teléfono de Contacto</label>
                      <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#11141D] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[#C89F6A]" placeholder="Ej. 8888-8888" />
                    </div>
                    
                    {/* Resumen */}
                    <div className="mt-8 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-xl mt-4">
                        <span className="text-white">Total a Pagar</span>
                        <span className="text-[#C89F6A] font-bold">₡{totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* ------------ STEP 4: SUCCESS ------------ */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center py-10">
                  <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-3xl text-white mb-4">¡Reservación Recibida!</h3>
                  <p className="text-white/60 max-w-md mx-auto mb-8">
                    Tu solicitud para la <strong>{selectedTerrace?.title}</strong> el día <strong>{selectedDate}</strong> ha sido enviada con éxito.
                    <br/><br/>
                    Nuestro equipo se pondrá en contacto al <strong>{phone}</strong> para confirmar tu reservación.
                  </p>
                  <button onClick={onClose} className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors">
                    Cerrar y Volver
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Footer Actions (only shown on step 1-3) */}
          {step < 4 && (
            <div className="p-6 border-t border-white/5 bg-[#090B10] flex gap-4">
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
                  disabled={
                    isLoading || 
                    (step === 1 && (!selectedDate || !isWorkingDay(selectedDate, rules))) || 
                    (step === 2 && !selectedTerrace)
                  }
                  className="flex-1 px-8 py-4 bg-[#C89F6A] text-black font-semibold rounded-xl hover:bg-[#D5B285] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(200,159,106,0.3)] disabled:opacity-50"
                >
                  Continuar <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  form="reservation-form"
                  disabled={isLoading}
                  className="flex-1 px-8 py-4 bg-[#C89F6A] text-black font-semibold rounded-xl hover:bg-[#D5B285] transition-colors flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(200,159,106,0.3)] disabled:opacity-50"
                >
                  {isLoading ? 'Procesando...' : `Confirmar por ₡${totalAmount.toLocaleString()}`}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
