import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, ImagePlus, Loader2, Ban, Paperclip, Lock } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/useAuth";

const VITE_N8N_WEBHOOK = (import.meta.env.VITE_N8N_WEBHOOK as string);

interface Message {
  text: string;
  isUser: boolean;
  isImage?: boolean;
  imageUrl?: string;
}

export function ChatAssistant() {
  const { user, loading } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "¡Hola! Soy el asistente de reservas de Como Caído del Cielo. ¿En qué puedo ayudarte?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [pendingReservationId, setPendingReservationId] = useState<string | null>(null);
  const [userContext, setUserContext] = useState<{ name: string; phone: string } | null>(null);

  const isProcessingRef = useRef(false);
  const anonymousSessionId = useRef(`session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sessionId = user?.id ?? anonymousSessionId.current;

  // Fetch last reservation data when user logs in, to pre-fill context for the agent
  useEffect(() => {
    if (!user?.email) {
      setUserContext(null);
      return;
    }
    supabase
      .from("terrace_reservations")
      .select("customer_name, customer_phone")
      .eq("customer_email", user.email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.customer_name) {
          setUserContext({ name: data.customer_name, phone: data.customer_phone ?? "" });
        }
      });
  }, [user?.email]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  const sendToN8N = useCallback(async (message: string): Promise<string> => {
    const res = await fetch(VITE_N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatInput: message,
        sessionId,
        userId: user?.id ?? null,
        userContext: user
          ? { email: user.email, name: userContext?.name ?? null, phone: userContext?.phone ?? null }
          : null,
      }),
    });
    if (!res.ok) throw new Error(`Error ${res.status}`);
    const data = await res.json();
    return (data.output as string) ?? "";
  }, [sessionId, user, userContext]);

  const handleBotResponse = useCallback((raw: string) => {
    const awaitMatch = raw.match(/\[AWAIT_PROOF(?::([a-f0-9-]{36}))?\]/);
    if (awaitMatch) {
      setShowImageUpload(true);
      if (awaitMatch[1]) setPendingReservationId(awaitMatch[1]);
    }
    if (raw.includes("[PROOF_DONE]")) {
      setShowImageUpload(false);
      setPendingReservationId(null);
    }
    return raw
      .replace(/\[AWAIT_PROOF(?::[a-f0-9-]{36})?\]/g, "")
      .replace(/\[PROOF_DONE\]/g, "")
      .trim();
  }, []);

  const handleUserInput = useCallback(async (text: string) => {
    if (!user || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);
    setMessages((prev) => [...prev, { text, isUser: true }]);

    await new Promise((r) => setTimeout(r, 600));

    try {
      const raw = await sendToN8N(text);
      const clean = handleBotResponse(raw);
      setMessages((prev) => [...prev, { text: clean, isUser: false }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Lo siento, hubo un problema de conexión. Intenta de nuevo en un momento.", isUser: false },
      ]);
    }

    isProcessingRef.current = false;
    setIsProcessing(false);
  }, [user, sendToN8N, handleBotResponse]);

  // External event from landing page buttons
  useEffect(() => {
    const handler = (e: CustomEvent<{ message?: string }>) => {
      setIsOpen(true);
      if (e.detail?.message) handleUserInput(e.detail.message);
    };
    window.addEventListener("open-chat", handler as EventListener);
    return () => window.removeEventListener("open-chat", handler as EventListener);
  }, [handleUserInput]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isProcessingRef.current) return;
    setInput("");
    handleUserInput(text);
  };

  const handleCancelReservation = useCallback(async () => {
    if (!pendingReservationId || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from("terrace_reservations")
        .update({ status: "cancelled" })
        .eq("id", pendingReservationId)
        .eq("status", "pendiente_pago");

      if (error) throw error;

      setShowImageUpload(false);
      setPendingReservationId(null);
      setMessages((prev) => [
        ...prev,
        { text: "Tu reservación ha sido cancelada. No se realizó ningún cargo.", isUser: false },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "No se pudo cancelar. Escribe 'cancelar reserva' para intentarlo por el chat.", isUser: false },
      ]);
    }

    isProcessingRef.current = false;
    setIsProcessing(false);
  }, [pendingReservationId]);

  const handleFileSelect = async (file: File) => {
    if (!user || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setIsProcessing(true);

    const previewUrl = URL.createObjectURL(file);
    setMessages((prev) => [...prev, { text: "", isUser: true, isImage: true, imageUrl: previewUrl }]);
    await new Promise((r) => setTimeout(r, 500));

    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `comprobantes/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("payment-proofs")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setMessages((prev) => [
        ...prev,
        { text: `Error al subir imagen: ${uploadError.message}. Intenta de nuevo.`, isUser: false },
      ]);
      isProcessingRef.current = false;
      setIsProcessing(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("payment-proofs").getPublicUrl(path);

    try {
      const raw = await sendToN8N(`Mi comprobante de pago: ${urlData.publicUrl}`);
      const clean = handleBotResponse(raw);
      setMessages((prev) => [...prev, { text: clean, isUser: false }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Comprobante subido, pero hubo un error al notificar. Escribe 'comprobante enviado' para reintentar.", isUser: false },
      ]);
    }

    isProcessingRef.current = false;
    setIsProcessing(false);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-[#E8DED0]"
          >
            {/* Header */}
            <div className="bg-[#3B2A22] text-white p-5 rounded-t-2xl flex justify-between items-center border-b border-white/10 shadow-lg flex-shrink-0">
              <div>
                <h3 className="font-serif text-xl tracking-tight">
                  Como Caído <span className="text-[#C89F6A]">del Cielo</span>
                </h3>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">Asistente de Reservas</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages or locked state */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center bg-white/50">
                <Loader2 size={20} className="animate-spin text-[#C89F6A]" />
              </div>
            ) : !user ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white/50">
                <div className="w-14 h-14 rounded-full bg-[#F5EFE6] flex items-center justify-center mb-4">
                  <Lock size={22} className="text-[#9B8677]" />
                </div>
                <p className="text-[#3B2A22] font-medium text-sm">Inicia sesión para chatear</p>
                <p className="text-[#9B8677] text-xs mt-1.5 leading-relaxed">
                  Usa el botón <span className="font-medium">Iniciar sesión</span> en el menú superior para continuar.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white/50 backdrop-blur-sm">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                    {msg.isImage ? (
                      <div className="max-w-[75%] rounded-2xl rounded-tr-none overflow-hidden shadow-sm border border-[#E8DED0]">
                        <img src={msg.imageUrl} alt="Comprobante" className="w-full object-cover" />
                      </div>
                    ) : (
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl shadow-sm text-sm ${msg.isUser
                          ? "bg-[#3B2A22] text-white rounded-tr-none"
                          : "bg-white text-[#2A2419] border border-[#E8DED0] rounded-tl-none"
                          }`}
                      >
                        <p
                          className="leading-relaxed whitespace-pre-line"
                          dangerouslySetInnerHTML={{
                            __html: msg.text
                              .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                              .replace(/\*(.+?)\*/g, "<em>$1</em>")
                              .replace(/`(.+?)`/g, "<code>$1</code>"),
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#E8DED0] rounded-2xl rounded-tl-none p-3.5 shadow-sm">
                      <div className="flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 bg-[#C89F6A] rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-[#C89F6A] rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-[#C89F6A] rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input */}
            <div className={`p-4 bg-white border-t border-[#F5EFE6] flex-shrink-0 rounded-b-2xl ${!user || loading ? "opacity-40 pointer-events-none" : ""}`}>
              {/* File input siempre en el DOM para que fileInputRef funcione en ambas ramas */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              {showImageUpload ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#F5EFE6] rounded-full text-sm text-[#3B2A22] hover:bg-[#E8DED0] transition-colors disabled:opacity-50 font-medium"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                    Subir comprobante
                  </button>
                  {pendingReservationId && (
                    <button
                      onClick={handleCancelReservation}
                      disabled={isProcessing}
                      title="Cancelar reserva"
                      className="flex items-center justify-center p-3 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 rounded-full transition-colors disabled:opacity-50 border border-red-200"
                    >
                      <Ban size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={user ? "Escribe tu mensaje..." : "Inicia sesión para chatear..."}
                    disabled={isProcessing || !user}
                    className="flex-1 px-5 py-3 bg-[#F5EFE6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#3B2A22]/20 text-sm disabled:opacity-50"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing || !user}
                    title="Adjuntar comprobante de pago"
                    className="text-[#9B8677] p-3 rounded-full hover:bg-[#F5EFE6] transition-all active:scale-95 disabled:opacity-40"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isProcessing || !input.trim() || !user}
                    className="bg-[#3B2A22] text-white p-3 rounded-full hover:bg-[#2A1F19] transition-all shadow-md active:scale-95 disabled:opacity-40"
                  >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[#3B2A22] text-white p-5 rounded-full shadow-[0_10px_30px_rgba(59,42,34,0.3)] hover:bg-[#2A1F19] transition-all z-50 border border-white/10"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
}
