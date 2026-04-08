import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar as CalendarIcon, Users, CheckCircle, Info, ChevronRight, ChevronLeft } from "lucide-react";
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

interface TerraceReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TerraceReservationModal({ isOpen, onClose }: TerraceReservationModalProps) {
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

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setSelectedTerrace(null);
      setSelectedDate("");
      setName("");
      setPhone("");
      setAdultsCount(1);
      setChildrenCount(0);
      setAvailableTerraces([]);
      setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
      fetchInitialData();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && step === 2) {
      fetchWeekReservations(currentWeekStart);
    }
  }, [currentWeekStart, isOpen, step]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={step === 4 ? onClose : undefined} />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-6xl bg-[#090B10] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[95vh]">
        
        <div className="md:w-80 flex-shrink-0 bg-[#11141D] p-8 hidden md:flex flex-col border-r border-white/5">
          <h2 className="text-2xl font-light text-white mb-8">Reservar <br/><span className="text-[#C89F6A] font-medium">Terraza VIP</span></h2>
          <div className="space-y-6 flex-1">
            <div className={`p-4 rounded-xl border ${step >= 1 ? 'bg-[#C89F6A]/10 border-[#C89F6A]/30 text-white' : 'border-white/5 text-white/40'}`}>
              <p className="text-xs uppercase tracking-widest font-bold mb-1">Paso 1</p>
              <p className="font-medium">Tu Visita</p>
            </div>
            <div className={`p-4 rounded-xl border ${step >= 2 ? 'bg-[#C89F6A]/10 border-[#C89F6A]/30 text-white' : 'border-white/5 text-white/40'}`}>
              <p className="text-xs uppercase tracking-widest font-bold mb-1">Paso 2</p>
              <p className="font-medium">Terrazas y Fechas</p>
            </div>
            <div className={`p-4 rounded-xl border ${step >= 3 ? 'bg-[#C89F6A]/10 border-[#C89F6A]/30 text-white' : 'border-white/5 text-white/40'}`}>
              <p className="text-xs uppercase tracking-widest font-bold mb-1">Paso 3</p>
              <p className="font-medium">Tus Datos</p>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col h-[80vh] md:h-auto overflow-hidden">
          <div className="flex justify-between md:justify-end items-center px-6 py-5 md:px-8 md:py-6 border-b border-white/5">
            <h3 className="text-xl text-white font-medium md:hidden tracking-wide">Reservación</h3>
            <button onClick={onClose} className="text-white/40 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto">
                  <h3 className="text-3xl text-white mb-8 text-center">¿Cuántas personas asistirán?</h3>
                  <div className="bg-[#11141D] border border-white/10 rounded-3xl p-8 space-y-8">
                    <div>
                      <div className="flex justify-between mb-4">
                        <span className="text-white">Adultos</span>
                        {rules && <span className="text-[#C89F6A] font-medium tracking-wide">₡{rules.adult_price.toLocaleString()} c/u</span>}
                      </div>
                      <div className="flex items-center bg-[#090B10] rounded-2xl p-2 border border-white/10 shadow-inner">
                        <button onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))} className="w-12 h-12 text-2xl text-white/50 hover:text-white transition-colors">-</button>
                        <div className="flex-1 text-center text-xl text-white font-medium">{adultsCount}</div>
                        <button onClick={() => setAdultsCount(adultsCount + 1)} className="w-12 h-12 text-2xl text-white/50 hover:text-white transition-colors">+</button>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-4">
                        <span className="text-white">Niños</span>
                        {rules && <span className="text-[#C89F6A] font-medium tracking-wide">₡{rules.child_price.toLocaleString()} c/u</span>}
                      </div>
                      <div className="flex items-center bg-[#090B10] rounded-2xl p-2 border border-white/10 shadow-inner">
                        <button onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className="w-12 h-12 text-2xl text-white/50 hover:text-white transition-colors">-</button>
                        <div className="flex-1 text-center text-xl text-white font-medium">{childrenCount}</div>
                        <button onClick={() => setChildrenCount(childrenCount + 1)} className="w-12 h-12 text-2xl text-white/50 hover:text-white transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ------------ STEP 2: AVAILABLE TERRACES ------------- */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 pb-6 border-b border-white/10 gap-6">
                    <div>
                      <h3 className="text-3xl lg:text-4xl font-light text-white mb-2">Terrazas Disponibles</h3>
                      <p className="text-white/50 text-lg">Encontramos {availableTerraces.length} opción(es) para su aforo.</p>
                    </div>

                    <div className="inline-flex items-center bg-[#090B10] border border-white/10 rounded-full p-1.5 shadow-inner">
                      <button 
                        onClick={() => setCurrentWeekStart(w => addWeeks(w, -1))}
                        disabled={currentWeekStart <= startOfWeek(new Date(), {weekStartsOn: 1})}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-white/70 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      
                      <div className="px-5 border-x border-white/5 flex items-center gap-2 h-8">
                        <CalendarIcon size={16} className="text-[#C89F6A]" />
                        <span className="text-white text-sm font-medium tracking-wide capitalize">
                          {format(currentWeekStart, "d MMM", {locale: es})} — {format(addDays(currentWeekStart, 6), "d MMM yyyy", {locale: es})}
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
                    <div className="p-10 border border-white/10 rounded-3xl bg-white/5 text-center flex flex-col items-center max-w-2xl mx-auto">
                      <Users className="w-16 h-16 text-[#C89F6A]/50 mb-6" />
                      <p className="text-white text-xl font-medium mb-2">Ninguna terraza cumple con el aforo</p>
                      <p className="text-white/50">Por favor, regresa y divide a tu grupo o contáctanos para eventos especiales.</p>
                      <button onClick={handlePrevStep} className="mt-8 px-6 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition">Volver atrás</button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {availableTerraces.map((terrace) => (
                        <div
                          key={terrace.id}
                          className={`relative flex flex-col bg-[#11141D] p-5 lg:p-6 rounded-3xl border-2 transition-all ${selectedTerrace?.id === terrace.id ? 'border-[#C89F6A] shadow-[0_4px_25px_rgba(200,159,106,0.15)] bg-[#C89F6A]/5' : 'border-white/5'}`}
                        >
                          {/* Top Info */}
                          <div className="flex justify-between items-center mb-6 gap-2">
                            <div className="text-xl md:text-2xl text-white font-serif truncate">
                              {terrace.title}
                            </div>
                            <div className="flex-shrink-0 border border-white/10 bg-[#090B10] px-3 py-1.5 rounded-full text-white/80 text-xs md:text-sm font-medium flex items-center gap-1.5 whitespace-nowrap">
                              <Users size={14} className="text-[#C89F6A]" /> {terrace.highlight ? terrace.highlight : `Capacidad ${terrace.max_capacity}`}
                            </div>
                          </div>

                          {/* Image */}
                          <div className="h-48 md:h-56 relative rounded-2xl border border-white/10 overflow-hidden mb-8">
                            <img src={terrace.image_url} alt={terrace.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
                          </div>

                          {/* Calendar Week Matrix */}
                          <div className="mt-auto">
                            <div className="flex justify-between mb-3 px-1">
                              <span className="text-sm font-medium text-white/60">Selecciona el día:</span>
                              {selectedTerrace?.id === terrace.id && selectedDate && (
                                <span className="text-sm font-semibold text-[#C89F6A] bg-[#C89F6A]/10 px-3 py-0.5 rounded-full border border-[#C89F6A]/30 flex items-center gap-1">
                                  <CheckCircle size={14} /> {format(new Date(selectedDate + "T12:00:00"), "EEEE d MMM", {locale: es})}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-7 gap-1 md:gap-2">
                              {Array.from({length: 7}).map((_, i) => {
                                const dayDate = addDays(currentWeekStart, i);
                                const dayStr = format(dayDate, 'yyyy-MM-dd');
                                const dayNameStr = format(dayDate, 'eeee', {locale: es});
                                const dayLabel = dayNameStr.substring(0, 2).toUpperCase(); // LU, MA...
                                const isPast = dayDate < new Date(new Date().setHours(0,0,0,0));
                                
                                const isWorking = isWorkingDay(dayStr, rules);

                                const isBooked = weekReservations.some(r => r.terrace_id === terrace.id && r.reservation_date === dayStr);
                                const isAvailable = !isPast && isWorking && !isBooked;
                                const isSelected = selectedDate === dayStr && selectedTerrace?.id === terrace.id;

                                let statusClasses = '';
                                if (!isAvailable) {
                                  statusClasses = 'bg-[#1a1515] border-red-500/20 text-red-500/40 cursor-not-allowed';
                                } else if (isSelected) {
                                  statusClasses = 'bg-[#C89F6A] border-[#C89F6A] text-black shadow-lg shadow-[#C89F6A]/25 scale-110 z-10 font-bold';
                                } else {
                                  statusClasses = 'bg-[#15201A] border-green-500/40 text-green-400 hover:bg-[#1A2A20] hover:border-green-500 hover:scale-105 cursor-pointer';
                                }

                                return (
                                  <div 
                                    key={i} 
                                    onClick={() => {
                                      if (isAvailable) {
                                        setSelectedTerrace(terrace);
                                        setSelectedDate(dayStr);
                                      }
                                    }}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all duration-200 aspect-[3/4] ${statusClasses}`}
                                    title={!isWorking ? "Cerrado" : isBooked ? "Ocupado" : isPast ? "Día pasado" : "Haz clic para seleccionar"}
                                  >
                                    <span className={`text-[0.65rem] md:text-xs font-semibold uppercase mb-1 ${!isAvailable ? 'opacity-50' : ''}`}>{dayLabel}</span>
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
                    (step === 2 && (!selectedTerrace || !selectedDate))
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
