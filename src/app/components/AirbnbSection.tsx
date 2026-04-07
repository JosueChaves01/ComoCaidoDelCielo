import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, Suspense, lazy } from "react";
import { Moon, Trees, Home } from "lucide-react";

// Lazy loading the heavy modal
const AirbnbModal = lazy(() => import("./AirbnbModal").then(m => ({ default: m.AirbnbModal })));

interface AirbnbSectionProps {
  images: string[];
}

export function AirbnbSection({ images }: AirbnbSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="hospedaje" ref={ref} className="py-24 px-6 md:px-12 bg-[#D6BFA6] text-[#3B2A22]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-[#3B2A22] mb-6">
            Extiende Tu Experiencia
          </h2>
          <p className="text-lg md:text-xl text-[#3B2A22]/70 max-w-3xl mx-auto">
            ¿Por qué solo unas horas? Quédate a descansar y vive el lugar en su totalidad.
            Hospedaje acogedor en conexión con la naturaleza.
          </p>
        </motion.div>

        {/* Images Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* First Image with Special Event Effect */}
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl group border border-white/5 cursor-pointer">
            <img
              src={images[0]}
              alt="Habitación acogedora"
              className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="text-2xl text-white font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                Descanso Profundo
              </h3>
              <p className="text-white/80 text-sm mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                Desconecta del ruido y reconecta contigo
              </p>
            </div>
          </div>

          {/* Second Image with Special Event Effect */}
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl group border border-white/5 cursor-pointer">
            <img
              src={images[1]}
              alt="Interior del hospedaje"
              className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="text-2xl text-white font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                Entorno Natural
              </h3>
              <p className="text-white/80 text-sm mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                Despierta rodeado de verde
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-8 mb-12"
        >
          <div className="text-center">
            <Moon className="text-[#7A553A] mx-auto mb-4" size={40} />
            <h3 className="text-2xl text-[#3B2A22] mb-3">Descanso Profundo</h3>
            <p className="text-[#3B2A22]/70">
              Desconecta del ruido y reconecta contigo. El silencio de la naturaleza como banda sonora.
            </p>
          </div>

          <div className="text-center">
            <Trees className="text-[#7A553A] mx-auto mb-4" size={40} />
            <h3 className="text-2xl text-[#3B2A22] mb-3">Entorno Natural</h3>
            <p className="text-[#3B2A22]/70">
              Despierta rodeado de verde. Vive el amanecer desde otra perspectiva.
            </p>
          </div>

          <div className="text-center">
            <Home className="text-[#7A553A] mx-auto mb-4" size={40} />
            <h3 className="text-2xl text-[#3B2A22] mb-3">Como En Casa</h3>
            <p className="text-[#3B2A22]/70">
              Comodidad, privacidad y todas las amenidades para una estadía inolvidable.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-[#3B2A22] text-white rounded-full hover:bg-[#7A553A] transition-all hover:shadow-xl"
          >
            Detalles del hospedaje
          </button>
        </motion.div>
      </div>

      <Suspense fallback={null}>
        <AirbnbModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          images={images}
        />
      </Suspense>
    </section>
  );
}