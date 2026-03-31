import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar as CalendarIcon, Users, CheckCircle, Info, ChevronRight, ChevronLeft, CalendarClock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

interface Terrace {
  id: string;
  title: string;
  description: string;
  highlight: string;
  image_url: string;
  max_capacity: number;
}

interface BusinessRules {
  adult_price: number;
  child_price: number;
  opening_time: string;
  closing_time: string;
  working_days: string[];
}

interface TerraceReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

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
    // Fetch rules
    const { data: rulesData } = await supabase.from('business_rules').select('*').eq('id', 1).single();
    if (rulesData) setRules(rulesData);

    // Fetch all terraces
    const { data: terracesData } = await supabase.from('terraces').select('*').order('title', { ascending: true });
    if (terracesData) setTerraces(terracesData);
    
    setIsLoading(false);
  };

  const isWorkingDay = (dateStr: string) => {
    if (!rules) return true;
    const date = new Date(dateStr + 'T12:00:00'); // Force local midday to avoid timezone shifts
    const dayName = DAYS_OF_WEEK[date.getDay()];
    return rules.working_days.includes(dayName);
  };

  const checkAvailability = async () => {
    if (!selectedDate) return toast.error("Selecciona una fecha");
    if (!isWorkingDay(selectedDate)) return toast.error("El local está cerrado en esa fecha según el horario.");
    
    setIsLoading(true);
    // Fetch reservations for that date that are NOT cancelled
    const { data: reservations } = await supabase
      .from('terrace_reservations')
      .select('terrace_id')
      .eq('reservation_date', selectedDate)
      .neq('status', 'cancelled');
    
    const bookedTerraceIds = reservations?.map(r => r.terrace_id) || [];
    
    // Filter terraces:
    // 1. Not booked
    // 2. Capacity >= total people
    const totalPeople = adultsCount + childrenCount;
    const available = terraces.filter(t => 
      !bookedTerraceIds.includes(t.id) && 
      t.max_capacity >= totalPeople
    );

    setAvailableTerraces(available);
    setSelectedTerrace(null);
    setStep(2);
    setIsLoading(false);

    if (available.length === 0) {
      toast("No hay terrazas disponibles", {
        description: "Intenta con otra fecha o reduce la cantidad de personas.",
        icon: <Users className="w-4 h-4" />
      });
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

  const totalAmount = rules ? (adultsCount * rules.adult_price) + (childrenCount * rules.child_price) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return toast.error("Por favor, complete todos los datos requeridos.");
    
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
        className="relative w-full max-w-4xl bg-[#090B10] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh]"
      >
        {/* Left Side / Sidebar Informational */}
        <div className="md:w-1/3 bg-[#11141D] p-8 hidden md:flex flex-col border-r border-white/5 relative">
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
        <div className="w-full md:w-2/3 flex flex-col h-[80vh] md:h-auto">
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
          <div className="flex-1 overflow-y-auto p-6 md:p-8 relative">
            <AnimatePresence mode="wait">
              
              {/* ------------ STEP 1: DATE AND PEOPLE ------------ */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-2xl text-white mb-2">Cuéntanos de tu visita</h3>
                  <p className="text-white/50 mb-8">Elige el día y cuántas personas te acompañarán.</p>
                  
                  <div className="space-y-6">
                    {/* Fecha */}
                    <div>
                      <label className="block text-sm font-medium tracking-wide text-white/80 mb-3">Fecha de Reservación</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <CalendarIcon className="h-5 w-5 text-white/40" />
                        </div>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full bg-[#090B10] border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] transition-colors [color-scheme:dark]"
                        />
                      </div>
                      {selectedDate && !isWorkingDay(selectedDate) && (
                        <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                          <X className="w-4 h-4" /> Cerramos este día. Por favor elige otro.
                        </p>
                      )}
                    </div>

                    {/* Personas */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium tracking-wide text-white/80 mb-2">Adultos</label>
                        <div className="flex bg-[#11141D] border border-white/10 rounded-xl overflow-hidden">
                          <button type="button" onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))} className="w-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 text-xl">-</button>
                          <div className="flex-1 text-center py-3.5 text-white">{adultsCount}</div>
                          <button type="button" onClick={() => setAdultsCount(adultsCount + 1)} className="w-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 text-xl">+</button>
                        </div>
                        {rules && <p className="text-xs text-white/30 text-center mt-2">₡{rules.adult_price.toLocaleString()} c/u</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium tracking-wide text-white/80 mb-2">Niños</label>
                        <div className="flex bg-[#11141D] border border-white/10 rounded-xl overflow-hidden">
                          <button type="button" onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))} className="w-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 text-xl">-</button>
                          <div className="flex-1 text-center py-3.5 text-white">{childrenCount}</div>
                          <button type="button" onClick={() => setChildrenCount(childrenCount + 1)} className="w-12 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 text-xl">+</button>
                        </div>
                        {rules && <p className="text-xs text-white/30 text-center mt-2">₡{rules.child_price.toLocaleString()} c/u</p>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ------------ STEP 2: AVAILABLE TERRACES ------------ */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <h3 className="text-2xl text-white mb-2">Terrazas Disponibles</h3>
                  <p className="text-white/50 mb-6">Encontramos {availableTerraces.length} opcion(es) con capacidad para {adultsCount + childrenCount} personas el {selectedDate}.</p>
                  
                  {availableTerraces.length === 0 ? (
                    <div className="p-8 border border-white/10 rounded-2xl bg-white/5 text-center flex flex-col items-center">
                      <CalendarClock className="w-12 h-12 text-white/20 mb-4" />
                      <p className="text-white font-medium mb-1">Todas ocupadas o capacidad insuficiente</p>
                      <p className="text-white/50 text-sm">Por favor, regresa e intenta con otra fecha o menos personas.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {availableTerraces.map((terrace) => (
                        <div
                          key={terrace.id}
                          className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedTerrace?.id === terrace.id ? 'border-[#C89F6A] shadow-[0_0_15px_rgba(200,159,106,0.3)]' : 'border-white/5 hover:border-white/20'}`}
                          onClick={() => setSelectedTerrace(terrace)}
                        >
                          <div className="h-32 relative">
                            <img src={terrace.image_url} alt={terrace.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            {selectedTerrace?.id === terrace.id && (
                              <div className="absolute top-2 right-2 bg-[#C89F6A] text-black w-6 h-6 rounded-full flex items-center justify-center">
                                <CheckCircle size={14} />
                              </div>
                            )}
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-xs text-white/80">
                              <Users size={12} /> Máx {terrace.max_capacity}
                            </div>
                          </div>
                          <div className="p-4 bg-[#11141D]">
                            <p className="text-[#C89F6A] text-xs font-bold uppercase tracking-wider mb-1 truncate">{terrace.highlight}</p>
                            <h4 className="text-white font-medium truncate">{terrace.title}</h4>
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
                    (step === 1 && (!selectedDate || !isWorkingDay(selectedDate))) || 
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
