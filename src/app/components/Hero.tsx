import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  imageUrl: string;
  onOpenReservation?: () => void;
}

export function Hero({ imageUrl, onOpenReservation }: HeroProps) {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt="Como Caído del Cielo - Atardecer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="max-w-4xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-5xl md:text-7xl font-semibold text-white mb-6 leading-tight"
          >
            Donde el paisaje se convierte en experiencias
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-xl md:text-2xl text-white/95 mb-12 max-w-2xl mx-auto"
          >
            Un lugar para desconectarte, compartir y quedarte un poco más
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => document.getElementById('terrazas')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-[#8B6F47] text-white rounded-full hover:bg-[#6B5337] transition-all hover:shadow-2xl transform hover:scale-105"
            >
              Explorar la experiencia
            </button>
            <button
              onClick={onOpenReservation}
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full border-2 border-white/40 hover:bg-white/20 transition-all"
            >
              Consultar disponibilidad
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="text-white" size={32} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
