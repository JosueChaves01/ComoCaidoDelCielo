"use client";

import { motion, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useVideoBackground } from "./VideoBackgroundSection";

interface HeroContentProps {
  onOpenReservation?: () => void;
}

export function HeroContent({ onOpenReservation }: HeroContentProps) {
  const { scrollYProgress } = useVideoBackground();

  const textOpacity = useTransform(scrollYProgress, [0, 0.06, 0.22], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.22], [0, -40]);
  const ctaOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18], [1, 1, 0]);

  return (
    <section className="relative h-screen w-full">
      {/* Hero content centered */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-5xl md:text-7xl font-semibold text-white mb-6 leading-tight max-w-4xl"
          >
            Donde el paisaje se convierte en experiencias
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-white/95 mb-12 max-w-2xl mx-auto"
          >
            Un lugar para desconectarte, compartir y quedarte un poco más
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          style={{ opacity: ctaOpacity }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() =>
              document.getElementById("terrazas")?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-8 py-4 bg-[#8B6F47] text-white rounded-full hover:bg-[#6B5337] transition-all hover:shadow-2xl hover:scale-105 cursor-pointer"
          >
            Explorar la experiencia
          </button>
          <button
            onClick={onOpenReservation}
            className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full border-2 border-white/40 hover:bg-white/20 transition-all cursor-pointer"
          >
            Consultar disponibilidad
          </button>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-12 left-0 right-0 px-8">
        <div className="max-w-md mx-auto h-[2px] bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#E11D48] rounded-full"
            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="text-white/70" size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
