import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Calendar, Heart, Briefcase } from "lucide-react";

interface EventHallSectionProps {
  image: string;
}

export function EventHallSection({ image }: EventHallSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 bg-[#FBF8F3]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] rounded-3xl overflow-hidden group"
          >
            <img
              src={image}
              alt="Salón de eventos"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-6xl text-[#2A2419] mb-6">
              Tu espacio privado
            </h2>
            <p className="text-lg text-[#6B5D4F] mb-8">
              Un salón versátil y elegante para tus momentos especiales. 
              Desde celebraciones íntimas hasta reuniones corporativas.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <Heart className="text-[#C89F6A] flex-shrink-0" size={28} />
                <div>
                  <h4 className="text-xl text-[#2A2419] mb-2">Celebraciones</h4>
                  <p className="text-[#6B5D4F]">
                    Cumpleaños, aniversarios, bodas pequeñas. Tu momento especial merece un lugar especial.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Briefcase className="text-[#C89F6A] flex-shrink-0" size={28} />
                <div>
                  <h4 className="text-xl text-[#2A2419] mb-2">Eventos corporativos</h4>
                  <p className="text-[#6B5D4F]">
                    Retiros de equipo, reuniones estratégicas, talleres. Un espacio que inspira creatividad.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Calendar className="text-[#C89F6A] flex-shrink-0" size={28} />
                <div>
                  <h4 className="text-xl text-[#2A2419] mb-2">Totalmente adaptable</h4>
                  <p className="text-[#6B5D4F]">
                    Configura el espacio según tus necesidades. Privacidad, comodidad y ambiente único.
                  </p>
                </div>
              </div>
            </div>

            <button className="px-8 py-4 bg-[#8B6F47] text-white rounded-full hover:bg-[#6B5337] transition-all hover:shadow-xl">
              Solicitar disponibilidad
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
