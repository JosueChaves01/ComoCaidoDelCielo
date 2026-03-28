import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Flame, Users, Sunset } from "lucide-react";

interface TerraceSectionProps {
  images: string[];
}

export function TerraceSection({ images }: TerraceSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="terrazas" ref={ref} className="py-24 px-6 md:px-12 bg-[#FBF8F3]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-[#2A2419] mb-6">
            Nuestras Terrazas
          </h2>
          <p className="text-lg md:text-xl text-[#6B5D4F] max-w-3xl mx-auto">
            El corazón de la experiencia. Un espacio donde el atardecer se vive, 
            no solo se observa. Donde cada momento se convierte en recuerdo.
          </p>
        </motion.div>

        {/* Main Image Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group"
          >
            <img
              src={images[0]}
              alt="Terraza principal"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group"
          >
            <img
              src={images[1]}
              alt="Vista panorámica"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-16"
        >
          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <Sunset className="text-[#C89F6A] mb-4" size={40} />
            <h3 className="text-2xl text-[#2A2419] mb-3">Atardeceres únicos</h3>
            <p className="text-[#6B5D4F]">
              Vive el momento dorado en primera fila. Un espectáculo natural que transforma cada visita.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <Flame className="text-[#C89F6A] mb-4" size={40} />
            <h3 className="text-2xl text-[#2A2419] mb-3">Fogatas y convivencia</h3>
            <p className="text-[#6B5D4F]">
              Enciende la magia de la noche. Comparte historias alrededor del fuego bajo las estrellas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
            <Users className="text-[#C89F6A] mb-4" size={40} />
            <h3 className="text-2xl text-[#2A2419] mb-3">Momentos compartidos</h3>
            <p className="text-[#6B5D4F]">
              Trae tu comida y bebida. Crea recuerdos con las personas que más importan.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}