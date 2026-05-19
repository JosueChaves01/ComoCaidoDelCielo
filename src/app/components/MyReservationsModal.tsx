import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Users, MapPin, Loader2, Receipt, Upload, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/useAuth";

interface Reservation {
  id: string;
  terrace_id: string;
  reservation_date: string;
  adults_count: number;
  children_count: number;
  total_amount: number;
  status: string;
  created_at: string;
  customer_email?: string;
  customer_name?: string;
  terraces: {
    title: string;
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
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState<Record<string, string>>({});
  const [verifyError, setVerifyError] = useState<Record<string, string>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<Record<string, string>>({});

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
          terraces(title)
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

  const handleVerifyCode = async (reservation: Reservation) => {
    const code = codeInput[reservation.id]?.trim() ?? "";
    if (!code || code.length !== 6) {
      setVerifyError((prev) => ({ ...prev, [reservation.id]: "Ingresa el código de 6 dígitos" }));
      return;
    }

    setVerifyingId(reservation.id);
    setVerifyError((prev) => ({ ...prev, [reservation.id]: "" }));
    setActionSuccess((prev) => ({ ...prev, [reservation.id]: "" }));

    try {
      const { data, error } = await supabase.functions.invoke("verify-confirmation", {
        body: { reservation_id: reservation.id, confirmation_code: code },
      });

      if (error || !data) {
        const msg = data?.error ?? "Error al verificar código";
        setVerifyError((prev) => ({ ...prev, [reservation.id]: msg }));
      } else if (!data.success) {
        setVerifyError((prev) => ({ ...prev, [reservation.id]: data.error }));
      } else {
        setActionSuccess((prev) => ({ ...prev, [reservation.id]: "Reserva confirmada. Ahora puedes proceder con el pago." }));
        setCodeInput((prev) => {
          const next = { ...prev };
          delete next[reservation.id];
          return next;
        });
        await fetchReservations();
      }
    } catch {
      setVerifyError((prev) => ({ ...prev, [reservation.id]: "Error de conexión" }));
    } finally {
      setVerifyingId(null);
    }
  };

  const handleUploadProof = async (reservation: Reservation, file: File) => {
    setUploadingId(reservation.id);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `comprobantes/${reservation.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setActionSuccess((prev) => ({ ...prev, [reservation.id]: `Error: ${uploadError.message}` }));
        return;
      }

      const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(path);

      // Update reservation status to pendiente_revision
      const { error: updateError } = await supabase
        .from("terrace_reservations")
        .update({ status: "pendiente_revision", payment_proof_url: urlData.publicUrl })
        .eq("id", reservation.id);

      if (updateError) {
        setActionSuccess((prev) => ({ ...prev, [reservation.id]: "Error al guardar comprobante" }));
      } else {
        setActionSuccess((prev) => ({ ...prev, [reservation.id]: "Comprobante subido. En revisión." }));
        await fetchReservations();
      }
    } catch {
      setActionSuccess((prev) => ({ ...prev, [reservation.id]: "Error de conexión" }));
    } finally {
      setUploadingId(null);
    }
  };

  const handleCancel = async (reservation: Reservation) => {
    if (!confirm("¿Cancelar esta reserva?")) return;
    setCancelingId(reservation.id);
    try {
      const { error } = await supabase
        .from("terrace_reservations")
        .update({ status: "cancelled" })
        .eq("id", reservation.id);

      if (error) {
        setActionSuccess((prev) => ({ ...prev, [reservation.id]: "Error al cancelar" }));
      } else {
        setActionSuccess((prev) => ({ ...prev, [reservation.id]: "Reserva cancelada" }));
        await fetchReservations();
      }
    } catch {
      setActionSuccess((prev) => ({ ...prev, [reservation.id]: "Error de conexión" }));
    } finally {
      setCancelingId(null);
    }
  };

  const STATUS_MAP: Record<string, { label: string; classes: string }> = {
    sin_confirmar:         { label: "Sin Confirmar",         classes: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    pendiente_revision:    { label: "Revisando Comprobante", classes: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    pendiente_pago:        { label: "Pendiente de Pago",     classes: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
    pendiente_cancelacion: { label: "Cancelación Pendiente", classes: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
    pendiente_reembolso:   { label: "Reembolso Pendiente",   classes: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    aprobada:              { label: "Pago Aprobado",          classes: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    confirmed:             { label: "Confirmada",            classes: "bg-lime-500/20 text-lime-400 border-lime-500/30" },
    rechazada:             { label: "Rechazada",             classes: "bg-red-500/20 text-red-400 border-red-500/30" },
    cancelled:             { label: "Cancelada",             classes: "bg-red-500/20 text-red-400 border-red-500/30" },
    reembolsada:           { label: "Reembolsada",           classes: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
  };

  const getStatusBadge = (status: string) => {
    const cfg = STATUS_MAP[status] ?? { label: status, classes: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
    return (
      <span className={`px-3 py-1 border rounded-full text-[10px] uppercase tracking-wider font-semibold ${cfg.classes}`}>
        {cfg.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return new Intl.DateTimeFormat("es-CR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const PAYMENT_INFO = {
    sinpe: "SINPE Móvil: 8888-8888",
    cuenta: "Banco de Costa Rica: 1234-5678-9012",
    tipo: "Tipo: Cuenta cliente"
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
            className="absolute inset-0 bg-black/70 backdrop-blur-xl backdrop-saturate-150"
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
                              {reservation.terraces?.title ?? "Terraza"}
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

                      {/* ── ACCIONES POR ESTADO ── */}

                      {/* Sin confirmar: pedir código */}
                      {reservation.status === "sin_confirmar" && (
                        <div className="mt-6 pt-4 border-t border-white/5">
                          <div className="bg-gray-900/50 rounded-xl p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <AlertCircle size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-gray-300 font-medium">Código de confirmación</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Revisa tu correo ({reservation.customer_email}) para obtener el código de 6 dígitos.
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="—— —— ——"
                                value={codeInput[reservation.id] ?? ""}
                                onChange={(e) =>
                                  setCodeInput((prev) => ({
                                    ...prev,
                                    [reservation.id]: e.target.value.replace(/\D/g, "").slice(0, 6),
                                  }))
                                }
                                className="flex-1 bg-black/40 border border-[#C89F6A]/30 rounded-lg px-4 py-2.5 text-white text-center text-lg tracking-[0.3em] placeholder:text-gray-600 focus:outline-none focus:border-[#C89F6A]"
                              />
                              <button
                                onClick={() => handleVerifyCode(reservation)}
                                disabled={verifyingId === reservation.id}
                                className="px-5 py-2.5 bg-[#B1630A] hover:bg-[#C89F6A] disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                              >
                                {verifyingId === reservation.id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <CheckCircle size={16} />
                                )}
                                Verificar
                              </button>
                            </div>
                            {verifyError[reservation.id] && (
                              <p className="text-xs text-red-400 mt-2">{verifyError[reservation.id]}</p>
                            )}
                            {actionSuccess[reservation.id] && (
                              <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                                <CheckCircle size={12} /> {actionSuccess[reservation.id]}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Pendiente pago: mostrar datos y subir comprobante */}
                      {reservation.status === "pendiente_pago" && (
                        <div className="mt-6 pt-4 border-t border-white/5">
                          <div className="bg-orange-900/20 rounded-xl p-4">
                            <div className="flex items-start gap-3 mb-4">
                              <Clock size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-orange-300 font-medium">Datos para tu pago</p>
                                <p className="text-xs text-orange-400/70 mt-0.5">
                                  Realiza tu pago y sube el comprobante para confirmar tu reserva.
                                </p>
                              </div>
                            </div>

                            <div className="bg-black/30 rounded-lg p-3 mb-4 space-y-1.5">
                              <p className="text-xs text-gray-500 uppercase tracking-wider">Transferencia o SINPE</p>
                              <p className="text-sm text-white font-mono">{PAYMENT_INFO.sinpe}</p>
                              <p className="text-sm text-white font-mono">{PAYMENT_INFO.cuenta}</p>
                              <p className="text-sm text-white font-mono">{PAYMENT_INFO.tipo}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                              <label className="flex-1 cursor-pointer">
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) await handleUploadProof(reservation, file);
                                    e.target.value = "";
                                  }}
                                />
                                <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#B1630A] hover:bg-[#C89F6A] text-white text-sm font-semibold rounded-lg transition-colors">
                                  {uploadingId === reservation.id ? (
                                    <Loader2 size={16} className="animate-spin" />
                                  ) : (
                                    <Upload size={16} />
                                  )}
                                  Subir Comprobante
                                </div>
                              </label>
                              <button
                                onClick={() => handleCancel(reservation)}
                                disabled={cancelingId === reservation.id}
                                className="px-4 py-2.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 text-sm rounded-lg transition-colors flex items-center gap-2"
                              >
                                {cancelingId === reservation.id ? <Loader2 size={14} className="animate-spin" /> : null}
                                Cancelar
                              </button>
                            </div>
                            {actionSuccess[reservation.id] && (
                              <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1">
                                <CheckCircle size={12} /> {actionSuccess[reservation.id]}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Pendiente revisión: aviso */}
                      {reservation.status === "pendiente_revision" && (
                        <div className="mt-6 pt-4 border-t border-white/5">
                          <div className="bg-blue-900/20 rounded-xl p-4 flex items-center gap-3">
                            <Clock size={18} className="text-blue-400 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-blue-300 font-medium">Comprobante en revisión</p>
                              <p className="text-xs text-blue-400/70 mt-0.5">
                                Tu comprobante fue recibido. Te notificaremos cuando sea aprobado.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Aprobada/Confirmada: confirmada + cancelar */}
                      {(reservation.status === "aprobada" || reservation.status === "confirmed") && (
                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-400">
                            <CheckCircle size={18} />
                            <span className="text-sm font-medium">¡Reserva confirmada!</span>
                          </div>
                          <button
                            onClick={() => handleCancel(reservation)}
                            disabled={cancelingId === reservation.id}
                            className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 disabled:opacity-50 text-sm rounded-lg transition-colors flex items-center gap-2"
                          >
                            {cancelingId === reservation.id ? <Loader2 size={14} className="animate-spin" /> : null}
                            Cancelar
                          </button>
                        </div>
                      )}

                      {/* Rechazada: mensaje */}
                      {reservation.status === "rechazada" && (
                        <div className="mt-6 pt-4 border-t border-white/5">
                          <div className="bg-red-900/20 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-red-300 font-medium">Reserva rechazada</p>
                              <p className="text-xs text-red-400/70 mt-0.5">
                                Contáctanos si crees que es un error.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Cancelada: no acciones */}
                      {(reservation.status === "cancelled" || reservation.status === "rechazada" || reservation.status === "reembolsada") && null}
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
