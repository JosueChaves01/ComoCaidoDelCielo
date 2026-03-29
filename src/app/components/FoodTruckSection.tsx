import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Coffee, Cake, Cookie } from "lucide-react";
import { FoodTruckModal } from "./FoodTruckModal";

interface FoodTruckSectionProps {
  images: string[];
}

interface NarrativeStep {
  title: string;
  description: string;
  highlight: string;
}

export function FoodTruckSection({ images }: FoodTruckSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuNarrative: NarrativeStep[] = [
    {
      title: "Menú cuidado",
      description:
        "Platos preparados con dedicación, bebidas refrescantes y opciones para todos los gustos. Cada elemento es seleccionado con esmero para garantizar una experiencia memorable.",
      highlight: "Sabores que inspiran",
    },
    {
      title: "Experiencias especiales",
      description:
        "Noches temáticas, cenas bajo las estrellas y eventos gastronómicos únicos. Creamos momentos especiales que transforman una simple comida en un recuerdo inolvidable.",
      highlight: "Momentos inolvidables",
    },
    {
      title: "Ingredientes frescos",
      description:
        "Productos locales de la más alta calidad, seleccionados diariamente. Trabajamos con proveedores de confianza para asegurar frescura y sabor en cada bocado.",
      highlight: "Sabor garantizado",
    },
  ];

  return (
    <section id="foodtruck" ref={ref} className="py-24 px-6 md:px-12 bg-[#F0E8E0]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm uppercase tracking-wider text-[#8B6F47] mb-2 block">
            Sabores Auténticos
          </span>
          <h2 className="text-4xl md:text-6xl text-[#2A2419] mb-4">
            Gastronomía con
            <span className="block text-[#8B6F47]">alma</span>
          </h2>
          <p className="text-lg text-[#6B5D4F] max-w-3xl mx-auto leading-relaxed">
            Nuestro food truck no es solo comida, es parte de la experiencia.
            Sabores auténticos que complementan cada momento del día.
          </p>
        </motion.div>

        {/* Main Experience */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-32"
        >
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            {/* Left Column - Narrative Steps */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-6"
              >
                <span className="text-sm uppercase tracking-wider text-[#8B6F47] mb-2 block">
                  Experiencia Gastronómica
                </span>
                <h3 className="text-4xl md:text-5xl text-[#2A2419] mb-4">
                  Sabores Que
                  <span className="block text-[#8B6F47]">Conectan</span>
                </h3>
                <p className="text-lg text-[#6B5D4F] leading-relaxed">
                  Cada plato cuenta una historia, cada sabor despierta un recuerdo.
                  Descubre la magia de nuestra cocina artesanal.
                </p>
              </motion.div>

              {/* Narrative Steps */}
              <div className="space-y-6">
                {menuNarrative.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#C19A6B] to-[#8B7355] flex items-center justify-center text-white text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg text-[#2A2419] mb-2">
                            {step.title}
                          </h4>
                          <p className="text-[#6B5D4F] mb-3">
                            {step.description}
                          </p>
                          <p className="text-sm text-[#C19A6B] italic">
                            {step.highlight}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column - Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 md:order-2 relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden group shadow-2xl sticky top-8"
            >
              <img
                src={images[0]}
                alt="Food truck con gastronomía artesanal"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-sm uppercase tracking-wider mb-2 opacity-90">
                  FOOD TRUCK
                </p>
                <p className="text-2xl">Todo el día</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors border border-white/30"
                >
                  Ver menú completo
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <FoodTruckModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
      />
    </section>
  );
}