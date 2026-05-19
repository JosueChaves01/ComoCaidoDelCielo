import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Smartphone, ShieldCheck, ArrowRight, Loader2, CheckCircle, AlertCircle, Mail } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/useAuth";
import { CountryCodeSelect } from "./ui/CountryCodeSelect";

interface WhatsAppVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WhatsAppVerificationModal({ isOpen, onClose, onSuccess }: WhatsAppVerificationModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("+506");
  const [whatsapp, setWhatsapp] = useState("");
  const [otp, setOtp] = useState("");

  const handleRequestOTP = async () => {
    if (!fullName || !whatsapp) {
      setError("Por favor completa todos los campos");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const fullNumber = `${countryCode}${whatsapp.replace(/\D/g, "")}`;
      const { data, error: functionError } = await supabase.functions.invoke("send-profile-otp", {
        body: { full_name: fullName, whatsapp_number: fullNumber },
      });

      if (functionError || data.error) {
        throw new Error(data?.error || "Error al enviar el código");
      }

      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Ingresa el código de 6 dígitos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fullNumber = `${countryCode}${whatsapp.replace(/\D/g, "")}`;
      const { data, error: functionError } = await supabase.functions.invoke("verify-profile-otp", {
        body: { 
          code: otp, 
          full_name: fullName, 
          whatsapp_number: fullNumber 
        },
      });

      if (functionError || data.error) {
        throw new Error(data?.error || "Código inválido o expirado");
      }

      // Success!
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl backdrop-saturate-150"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#0D0F14] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
          >
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C89F6A] to-transparent opacity-50" />

            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-[#C89F6A]/10 rounded-2xl flex items-center justify-center">
                  {step === 1 ? (
                    <Smartphone className="text-[#C89F6A]" size={24} />
                  ) : (
                    <ShieldCheck className="text-[#C89F6A]" size={24} />
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {step === 1 ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-serif text-white mb-2">Verifica tu Perfil</h2>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Vincula tu cuenta con WhatsApp para una experiencia más fluida y acceso a reservas prioritarias.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#C89F6A] font-bold ml-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C89F6A] transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-[#C89F6A] font-bold ml-1">
                        Número de WhatsApp
                      </label>
                      <div className="flex gap-2">
                        <div className="w-32">
                          <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                        </div>
                        <input
                          type="tel"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="8888-8888"
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-[#C89F6A] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 text-xs">
                      <AlertCircle size={14} />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleRequestOTP}
                    disabled={loading}
                    className="w-full bg-[#C89F6A] hover:bg-[#D4AF7A] text-[#0D0F14] font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Enviar Código por Correo
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                  
                  <p className="text-center text-[10px] text-white/30 uppercase tracking-wider">
                    Temporalmente enviaremos el código a <strong>{user?.email}</strong>
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-serif text-white mb-2">Ingresa el Código</h2>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Hemos enviado un código de 6 dígitos a tu correo electrónico. Por favor ingrésalo abajo.
                    </p>
                  </div>

                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-center gap-3 py-4">
                       <Mail className="text-[#C89F6A]/50" size={20} />
                       <span className="text-white/80 font-medium">{user?.email}</span>
                    </div>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="· · · · · ·"
                      className="w-full bg-[#16191E] border-2 border-white/5 rounded-2xl px-4 py-5 text-white text-center text-3xl font-mono tracking-[0.5em] placeholder:text-white/5 focus:outline-none focus:border-[#C89F6A] transition-all"
                    />

                    {error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-3 text-red-400 text-xs">
                        <AlertCircle size={14} />
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={handleVerifyOTP}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="animate-spin" size={20} />
                        ) : (
                          <>
                            Verificar
                            <CheckCircle size={18} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
