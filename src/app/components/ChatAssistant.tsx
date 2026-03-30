import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "¡Hola! Soy tu asistente de Como Caído del Cielo. ¿En qué puedo ayudarte hoy?", isUser: false }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleOpenChat = (event: CustomEvent<{ message: string }>) => {
      setIsOpen(true);
      if (event.detail?.message) {
        setMessages(prev => [...prev, { text: event.detail.message, isUser: true }]);
        setTimeout(() => {
          setMessages(prev => [...prev, {
            text: "Perfecto. Nuestro equipo te enviará toda la información en breve. ¿Para qué fecha y qué tipo de evento estás buscando?",
            isUser: false
          }]);
        }, 1000);
      }
    };

    window.addEventListener("open-chat", handleOpenChat as EventListener);
    return () => window.removeEventListener("open-chat", handleOpenChat as EventListener);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, isUser: true }]);
    setInput("");

    // Respuesta automática simple
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Gracias por tu mensaje. Un miembro de nuestro equipo te responderá pronto. ¿Te gustaría saber más sobre nuestras terrazas, hospedaje o próximos eventos?",
        isUser: false
      }]);
    }, 800);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-[#E8DED0]"
          >
            {/* Header */}
            <div className="bg-[#3B2A22] text-white p-5 rounded-t-2xl flex justify-between items-center border-b border-white/10 shadow-lg">
              <div>
                <h3 className="font-serif text-xl tracking-tight">Como Caído <span className="text-[#C89F6A]">del Cielo</span></h3>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">Asistente Virtual</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-2 rounded-full transition-all active:scale-90"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/50 backdrop-blur-sm">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm ${
                      message.isUser
                        ? "bg-[#3B2A22] text-white rounded-tr-none"
                        : "bg-white text-[#2A2419] border border-[#E8DED0] rounded-tl-none"
                    }`}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-[#F5EFE6]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-5 py-3 bg-[#F5EFE6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#3B2A22]/20 text-sm"
                />
                <button
                  onClick={handleSend}
                  className="bg-[#3B2A22] text-white p-3 rounded-full hover:bg-[#2A1F19] transition-all shadow-md active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
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
