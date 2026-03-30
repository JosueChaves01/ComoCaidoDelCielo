import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { MapPin, Clock, Calendar as CalendarIcon, Info } from "lucide-react";

export function InfoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 bg-[#7A553A] text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl mb-6">
            Información práctica
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            Todo lo que necesitas saber para planificar tu visita
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* Location */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
            <MapPin className="text-[#D6BFA6] mb-4" size={40} />
            <h3 className="text-2xl mb-3">Ubicación</h3>
            <p className="text-white/70">
              A solo 45 minutos de la ciudad. Camino panorámico, fácil acceso y estacionamiento disponible.
            </p>
          </div>

          {/* Hours */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
            <Clock className="text-[#D6BFA6] mb-4" size={40} />
            <h3 className="text-2xl mb-3">Horarios</h3>
            <p className="text-white/70">
              Viernes a domingo de 2:00 PM a 10:00 PM. Eventos especiales con horarios extendidos.
            </p>
          </div>

          {/* Season */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
            <CalendarIcon className="text-[#D6BFA6] mb-4" size={40} />
            <h3 className="text-2xl mb-3">Temporada</h3>
            <p className="text-white/70">
              Abierto todo el año. Cada estación ofrece una experiencia única y diferente.
            </p>
          </div>

          {/* Important Info */}
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
            <Info className="text-[#D6BFA6] mb-4" size={40} />
            <h3 className="text-2xl mb-3">Importante</h3>
            <p className="text-white/70">
              Reserva con anticipación. Cupo limitado para preservar la experiencia.
            </p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 bg-[#7A553A] text-white p-8 rounded-3xl text-center"
        >
          <h3 className="text-2xl mb-4">¿Necesitas más información?</h3>
          <p className="mb-6 text-lg text-[#D6BFA6]">
            Nuestro asistente está disponible para resolver todas tus dudas y ayudarte con tu reservación.
          </p>
          <button className="px-8 py-4 bg-[#3B2A22] text-white rounded-full hover:bg-[#D6BFA6] hover:text-[#3B2A22] transition-all">
            Hablar con el asistente
          </button>
        </motion.div>
      </div>
    </section>
  );
}
