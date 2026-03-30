import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Coffee, Cake, Cookie } from "lucide-react";
import { FoodTruckModal } from "./FoodTruckModal";
import { SpecialEventsSection, SpecialEvent } from "./SpecialEventsSection";

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
      title: "Antojitos Para El Momento",
      description: "Opciones sencillas y ricas para acompañar la experiencia. Chocolates calientes, café, dulces y algo para picar mientras disfrutás del ambiente.",
      highlight: "Hecho para compartir",
    },
    {
      title: "Momentos Que Se Viven",
      description: "Fogatas, atardeceres, noches especiales y espacios para relajarse. Más que venir a comer, es venir a pasarla bien.",
      highlight: "Cada visita es diferente",
    },
  ];

  const specialEvents: SpecialEvent[] = [
    {
      id: "1",
      name: "Homenaje a la Música",
      image: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.82787-15/649222232_18059093615690161_7500198547217970010_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_ohc=IC0RjAE9n2wQ7kNvwEkQoYz&_nc_oc=AdopRmWAl7K1d7Mje7xvgqNisLdeON_bj1GNTzjFGmL4CzgUUrQrvw7RITFMjY8tqDspXyRaB4Dk16oLc-c5SVBG&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=hbjPiypO-0ivZzxp9mNaJg&_nc_ss=7a389&oh=00_Afwn5cgK0XkMbAIXZIx6R01feTud3PEhn3MRrNvSlKubqg&oe=69CFD92B",
      date: "Sábado 15 de Marzo",
      description: "Una noche mágica donde la música toma el protagonismo. Disfruta de en vivo bandas locales mientras saboreas nuestro menú especial temático.",
      menu: [
        "Cocktail 'Melodía Nocturna' - Gin con hierbas aromáticas",
        "Mini 'Croquetas Jazz' - Pollo con salsa blues",
        "Tostadas 'Ritmo Latino' - Aguacate y tomate cherry",
        "Brownie 'Rock Clásico' - Con nueces y helado",
        "Bebidas 'Acústicas' - Aguas frescas artesanales"
      ]
    },
    {
      id: "2", 
      name: "Noche de Fogata",
      image: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.82787-15/573270359_18045450638690161_7929014585758110399_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=13d280&_nc_ohc=YdPvSKnihBQQ7kNvwEgfr0D&_nc_oc=AdqHZWEZdTI4abaWx0a9o_GPcEEFUB03-ldZRRkzG4BmDaDhyZM1bYnE-XxsA8HhncJKi9gUUqywyVfnhrZEXDNu&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=v2d6UkFf2HY4IaN9J1t_Wg&_nc_ss=7a389&oh=00_Afzc1oMg72Mf4mKD1Q0kOLXGucJ_0fEmadSrqdUYnC_oDw&oe=69CFDD42",
      date: "Viernes 22 de Marzo",
      description: "Reúnete alrededor de la fogata para compartir historias, música y deliciosas comidas al aire libre bajo las estrellas.",
      menu: [
        "Malteadas 'Fogata' - Chocolate con marshmallow",
        "Sándwiches 'Calor' - Tostados con queso derretido",
        "Papas 'Brasa' - Asadas con hierbas",
        "Galletas 'Chispas' - Con chocolate caliente",
        "Café 'Noche Estrellada' - Espresso con canela"
      ]
    }
  ];

  return (
    <section id="foodtruck" ref={ref} className="py-24 px-6 md:px-12 bg-[#7A553A] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-wider text-white mb-2 block">
            Rincón del Atardecer
          </span>
          <h2 className="text-4xl md:text-6xl text-white mb-4">
            Sabores Para Disfrutar El
            <span className="block text-white">atardecer</span>
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
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
                <span className="text-sm tracking-wider text-[#C19A6B] mb-2 block">
                  Momentos Compartidos
                </span>
                <h3 className="text-4xl md:text-5xl text-white mb-4">
                  Atardeceres y Sabores
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Más que comida, es un lugar para desconectar y disfrutar.
                  Vení a compartir con amigos, ver el atardecer y acompañar el momento con algo rico .
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
                    <div className="bg-[#D6BFA6] p-6 rounded-2xl shadow-md border border-white/10">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#3B2A22] flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg text-[#3B2A22] mb-2 font-medium">
                            {step.title}
                          </h4>
                          <p className="text-[#3B2A22]/80 mb-3">
                            {step.description}
                          </p>
                          <p className="text-sm text-[#7A553A] font-semibold italic">
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
              className="order-1 md:order-2 relative h-[500px] md:h-[700px] sticky top-8"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-white/5 cursor-pointer">
                <img
                  src={images[0]}
                  alt="Food truck con gastronomía artesanal"
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-sm tracking-wider mb-2 opacity-90">
                    Food truck
                  </p>
                  <p className="text-2xl">Todo el día</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors border border-white/30"
                  >
                    Ver menú completo
                  </button>
                </div>
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

      {/* Special Events Section */}
      <SpecialEventsSection events={specialEvents} />
    </section>
  );
}