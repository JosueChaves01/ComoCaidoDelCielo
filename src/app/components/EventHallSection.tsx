import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Heart, Briefcase, Shuffle, ChevronRight } from "lucide-react";

interface EventHallSectionProps {
  images: string[];
}

export function EventHallSection({ images }: EventHallSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="salon" ref={ref} className="py-24 px-6 md:px-12 bg-[#3B2A22]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-block text-sm tracking-[0.2em] uppercase text-[#C89F6A] mb-4">
                Reserva privada
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl text-white leading-tight">
                Tu espacio
                <span className="block italic text-[#C89F6A]">privado</span>
              </h2>
            </div>
            <p className="text-lg text-white/60 max-w-sm md:text-right">
              Un salón versátil y elegante para tus momentos más importantes.
              Desde celebraciones íntimas hasta encuentros que dejan huella.
            </p>
          </div>
        </motion.div>

        {/* Image gallery — 5 images */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-16"
        >
          {/* Row 1: main + side */}
          <div className="grid md:grid-cols-5 gap-4 mb-4">
            {/* Main image — mesass2.jpg (elegante con cortinas doradas) */}
            <div className="md:col-span-3 relative rounded-3xl overflow-hidden group h-[300px] md:h-[420px]">
              <img
                src={images[0]}
                alt="Montaje elegante del salón"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="bg-[#C89F6A] text-[#2A2419] text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full">
                  Espacio privado
                </span>
              </div>
            </div>

            {/* Side column — salon.jpg (panorámica) */}
            <div className="md:col-span-2 relative rounded-3xl overflow-hidden group h-[240px] md:h-[420px]">
              <img
                src={images[1]}
                alt="Vista panorámica del salón"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Row 2: three images */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Mesa.jpg */}
            <div className="relative rounded-2xl overflow-hidden group h-[200px] md:h-[240px]">
              <img
                src={images[2]}
                alt="Detalle de mesa decorada con vista"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Mesas2.jpeg — decoración temática */}
            <div className="relative rounded-2xl overflow-hidden group h-[200px] md:h-[240px]">
              <img
                src={images[3]}
                alt="Decoración temática del salón"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* postres.jpg — celebración de cumpleaños */}
            <div className="relative rounded-2xl overflow-hidden group h-[200px] md:h-[240px] col-span-2 md:col-span-1">
              <img
                src={images[4]}
                alt="Celebración con postres"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="text-white/80 text-xs tracking-widest uppercase">
                  Cada celebración es única
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Uses cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Celebraciones especiales",
                desc: "Cumpleaños, aniversarios, despedidas de soltera. Tu momento más especial merece un escenario que lo esté también.",
              },
              {
                icon: Briefcase,
                title: "Retiros y corporativos",
                desc: "Reuniones de equipo, talleres creativos, presentaciones. Un entorno que inspira desde que llegas.",
              },
              {
                icon: Shuffle,
                title: "Totalmente adaptable",
                desc: "El espacio se transforma según tu visión. Íntimo o amplio, formal o festivo, siempre elegante.",
              },
            ].map((use) => {
              const Icon = use.icon;
              return (
                <div
                  key={use.title}
                  className="bg-[#332D26] p-8 rounded-2xl hover:bg-[#3D362E] transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#C89F6A]/15 flex items-center justify-center mb-4 group-hover:bg-[#C89F6A]/25 transition-colors">
                    <Icon className="text-[#C89F6A]" size={22} />
                  </div>
                  <h3 className="text-lg text-white mb-2">{use.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {use.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-white/10"
        >
          <p className="text-white/50 text-sm md:text-base max-w-md text-center sm:text-left">
            Cupos limitados para garantizar una experiencia exclusiva.
            Reserva con anticipación y define todos los detalles a tu gusto.
          </p>
          <button
            onClick={() => {
              const event = new CustomEvent("open-chat", {
                detail: { message: "Hola buen día, quiero consultar la disponibilidad" }
              });
              window.dispatchEvent(event);
            }}
            className="group flex items-center gap-3 px-8 py-4 bg-[#C89F6A] text-[#2A2419] rounded-full font-semibold hover:bg-[#D4A574] transition-all hover:shadow-2xl hover:shadow-[#C89F6A]/30 transform hover:scale-105 whitespace-nowrap"
          >
            Solicitar disponibilidad
            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
