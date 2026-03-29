import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Moon, Trees, Home } from "lucide-react";
import { AirbnbModal } from "./AirbnbModal";

interface AirbnbSectionProps {
  images: string[];
}

export function AirbnbSection({ images }: AirbnbSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [isModalOpen, setIsModalOpen] = useState(false);


  return (
    <section id="hospedaje" ref={ref} className="py-24 px-6 md:px-12 bg-[#090b10] text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-white mb-6">
            Extiende tu experiencia
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
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
          <div className="relative h-[400px] rounded-3xl overflow-hidden group">
            <img
              src={images[0]}
              alt="Habitación acogedora"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="relative h-[400px] rounded-3xl overflow-hidden group">
            <img
              src={images[1]}
              alt="Interior del hospedaje"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
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
            <Moon className="text-[#C19A6B] mx-auto mb-4" size={40} />
            <h3 className="text-2xl text-white mb-3">Descanso profundo</h3>
            <p className="text-gray-300">
              Desconecta del ruido y reconecta contigo. El silencio de la naturaleza como banda sonora.
            </p>
          </div>

          <div className="text-center">
            <Trees className="text-[#C19A6B] mx-auto mb-4" size={40} />
            <h3 className="text-2xl text-white mb-3">Entorno natural</h3>
            <p className="text-gray-300">
              Despierta rodeado de verde. Vive el amanecer desde otra perspectiva.
            </p>
          </div>

          <div className="text-center">
            <Home className="text-[#C19A6B] mx-auto mb-4" size={40} />
            <h3 className="text-2xl text-white mb-3">Como en casa</h3>
            <p className="text-gray-300">
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
            className="px-8 py-4 bg-[#8B6F47] text-white rounded-full hover:bg-[#6B5337] transition-all hover:shadow-xl"
          >
            Ver hospedaje en Airbnb
          </button>
        </motion.div>
      </div>

      <AirbnbModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        images={images} 
      />
    </section>
  );
}