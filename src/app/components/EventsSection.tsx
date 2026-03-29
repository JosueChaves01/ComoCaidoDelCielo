import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Music, PartyPopper } from "lucide-react";

interface EventsSectionProps {
  images: string[];
}

export function EventsSection({ images }: EventsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="eventos" ref={ref} className="py-24 px-6 md:px-12 bg-[#FBF8F3]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-[#2A2419] mb-6">
            Cuando la noche cobra vida
          </h2>
          <p className="text-lg md:text-xl text-[#6B5D4F] max-w-3xl mx-auto">
            No solo somos paisaje y calma. También somos energía, música y celebración. 
            Descubre nuestros eventos que transforman el espacio.
          </p>
        </motion.div>

        {/* Image Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="relative h-[350px] rounded-3xl overflow-hidden group">
            <img
              src={images[0]}
              alt="Eventos con DJ"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <Music className="mb-2" size={32} />
                <h3 className="text-xl">DJs en vivo</h3>
              </div>
            </div>
          </div>

          <div className="relative h-[350px] rounded-3xl overflow-hidden group">
            <img
              src={images[1]}
              alt="Ambiente de fiesta"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <PartyPopper className="mb-2" size={32} />
                <h3 className="text-xl">Tardeos especiales</h3>
              </div>
            </div>
          </div>

          <div className="relative h-[350px] rounded-3xl overflow-hidden group">
            <img
              src={images[2]}
              alt="Celebraciones"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-xl">Noches memorables</h3>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-lg mb-6 text-[#6B5D4F]">
            Cada evento es una experiencia diferente. No te pierdas nuestras próximas noches.
          </p>
          <button className="px-8 py-4 bg-[#C89F6A] text-[#2A2419] rounded-full hover:bg-[#D4A574] transition-all hover:shadow-2xl">
            Ver calendario de eventos
          </button>
        </motion.div>
      </div>
    </section>
  );
}