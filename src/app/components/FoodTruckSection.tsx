import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { Coffee, Sparkles } from "lucide-react";

interface FoodTruckSectionProps {
  images: string[];
}

export function FoodTruckSection({ images }: FoodTruckSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="foodtruck" ref={ref} className="py-24 px-6 md:px-12 bg-[#E8DED0]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl text-[#2A2419] mb-6">
              Gastronomía con alma
            </h2>
            <p className="text-lg text-[#6B5D4F] mb-8">
              Nuestro food truck no es solo comida, es parte de la experiencia. 
              Sabores auténticos que complementan cada momento del día.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <Coffee className="text-[#8B6F47] flex-shrink-0" size={28} />
                <div>
                  <h4 className="text-xl text-[#2A2419] mb-2">Menú cuidado</h4>
                  <p className="text-[#6B5D4F]">
                    Platos preparados con dedicación, bebidas refrescantes y opciones para todos los gustos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Sparkles className="text-[#8B6F47] flex-shrink-0" size={28} />
                <div>
                  <h4 className="text-xl text-[#2A2419] mb-2">Experiencias especiales</h4>
                  <p className="text-[#6B5D4F]">
                    Noches temáticas, cenas bajo las estrellas y eventos gastronómicos únicos.
                  </p>
                </div>
              </div>
            </div>

            <button className="px-8 py-4 bg-[#8B6F47] text-white rounded-full hover:bg-[#6B5337] transition-all hover:shadow-xl">
              Ver menú completo
            </button>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="col-span-2 relative h-[300px] rounded-3xl overflow-hidden group">
              <img
                src={images[0]}
                alt="Food truck"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="relative h-[200px] rounded-3xl overflow-hidden group">
              <img
                src={images[1]}
                alt="Gastronomía"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="relative h-[200px] rounded-3xl overflow-hidden group">
              <img
                src={images[2]}
                alt="Ambiente"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}