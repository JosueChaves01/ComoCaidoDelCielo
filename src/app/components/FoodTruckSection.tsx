import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect, Suspense, lazy } from "react";
import { Coffee, Cake, Cookie, Utensils } from "lucide-react";
import { SpecialEventsSection, SpecialEvent } from "./SpecialEventsSection";
import { supabase } from "../../lib/supabase";

// Lazy loading the heavy modal
const FoodTruckModal = lazy(() => import("./FoodTruckModal").then(m => ({ default: m.FoodTruckModal })));

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
  const [specialEvents, setSpecialEvents] = useState<SpecialEvent[]>([]);

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

  // Static fallback data
  const fallbackEvents: SpecialEvent[] = [
    {
      id: "1",
      name: "Homenaje a la Música Italiana",
      image: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.82787-15/649222232_18059093615690161_7500198547217970010_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=13d280&_nc_ohc=IC0RjAE9n2wQ7kNvwEkQoYz&_nc_oc=AdopRmWAl7K1d7Mje7xvgqNisLdeON_bj1GNTzjFGmL4CzgUUrQrvw7RITFMjY8tqDspXyRaB4Dk16oLc-c5SVBG&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=hbjPiypO-0ivZzxp9mNaJg&_nc_ss=7a389&oh=00_Afwn5cgK0XkMbAIXZIx6R01feTud3PEhn3MRrNvSlKubqg&oe=69CFD92B",
      date: "Sábado 15 de Marzo",
      description: "Una noche mágica donde la música italiana toma el protagonismo. Disfruta de una cena temática con nuestras pastas y pizzas artesanales mientras escuchas los mejores clásicos.",
      menu: [
        "Penne Bolognesa (Pasta) - ₡4.500",
        "Fusili al Pesto con Pollo (Pasta) - ₡4.500",
        "Pizza Margarita Artesanal - ₡8.000",
        "Pizza Jamón y Queso - ₡8.000",
        "Pizza Jamón y Hongos - ₡8.000",
        "Pizza Pepperoni - ₡8.000"
      ]
    },
    {
      id: "2",
      name: "Cena de Gratitud",
      image: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.82787-15/573270359_18045450638690161_7929014585758110399_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=13d280&_nc_ohc=YdPvSKnihBQQ7kNvwEgfr0D&_nc_oc=AdqHZWEZdTI4abaWx0a9o_GPcEEFUB03-ldZRRkzG4BmDaDhyZM1bYnE-XxsA8HhncJKi9gUUqywyVfnhrZEXDNu&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=v2d6UkFf2HY4IaN9J1t_Wg&_nc_ss=7a389&oh=00_Afzc1oMg72Mf4mKD1Q0kOLXGucJ_0fEmadSrqdUYnC_oDw&oe=69CFDD42",
      date: "Sábado 29 de Noviembre",
      description: "Una experiencia al atardecer para agradecer y compartir. Disfruta de una cena especial diseñada para celebrar los momentos más importantes del año.",
      menu: [
        "Pavo al Horno con hierbas finas y gravy",
        "Puré de Camote rústico con malvaviscos",
        "Ensalada de Frutos Secos y Manzana fresca",
        "Relleno Tradicional de la casa con especias",
        "Pie de Calabaza o Nuez artesanal",
        "Ponche de Frutas Caliente o Vino de la casa"
      ]
    }
  ];

  useEffect(() => {
    const fetchSpecialEvents = async () => {
      const { data } = await supabase.from('special_events').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setSpecialEvents(data.map(e => ({
          id: e.id,
          name: e.name,
          image: e.image_url,
          date: e.date || undefined,
          description: e.description,
          menu: e.menu
        })));
      } else {
        setSpecialEvents(fallbackEvents);
      }
    };
    fetchSpecialEvents();
  }, []);

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
            Sabores Para Disfrutar
            <span className="block text-white">El atardecer</span>
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
                {/* Menu Button CTA */}
                <div className="pt-8">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-5 bg-[#C89F6A] text-black font-bold tracking-widest uppercase rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
                  >
                    <Utensils className="w-5 h-5" />
                    Ver menú de comidas
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Main Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="order-1 md:order-2 relative h-[500px] md:h-[700px] md:sticky md:top-8"
            >
              <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl group border border-white/5">
                <img
                  src={images[0]}
                  alt="Food truck con gastronomía artesanal"
                  className="w-full h-full object-cover group-hover:scale-110 md:group-hover:blur-[2px] transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 md:opacity-0 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <p className="text-sm tracking-wider mb-2 text-[#C89F6A] font-bold uppercase">
                    Rincón del Atardecer
                  </p>
                  <h4 className="text-3xl font-serif text-white mb-2">Nuestro Menú</h4>
                  <p className="text-white/70 text-sm mb-6 max-w-xs md:hidden">Usa el botón de abajo para explorar todas nuestras opciones gastronómicas.</p>
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