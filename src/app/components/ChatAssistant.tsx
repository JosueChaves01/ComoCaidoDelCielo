import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: "¡Hola! Soy tu asistente de Como Caído del Cielo. ¿En qué puedo ayudarte hoy?", isUser: false }
  ]);
  const [input, setInput] = useState("");

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
            <div className="bg-[#8B6F47] text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold">Como Caído del Cielo</h3>
                <p className="text-xs opacity-90">Estamos aquí para ayudarte</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.isUser
                        ? "bg-[#8B6F47] text-white"
                        : "bg-[#F5EFE6] text-[#2A2419]"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#E8DED0]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 bg-[#F5EFE6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#8B6F47]"
                />
                <button
                  onClick={handleSend}
                  className="bg-[#8B6F47] text-white p-2 rounded-full hover:bg-[#6B5337] transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[#8B6F47] text-white p-4 rounded-full shadow-2xl hover:bg-[#6B5337] transition z-50"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </motion.button>
    </>
  );
}
