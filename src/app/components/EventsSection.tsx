import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

// Ignoramos images[] para usar nuestras rutas fijas de assets
interface EventsSectionProps {
  images: string[];
}

const mainEvents = [
  {
    id: "sabinazo",
    title: "El Sabinazo",
    description: "Una noche inolvidable rindiendo tributo a la poesía y música de Joaquín Sabina. Canto, recuerdos y un ambiente acústico espectacular.",
    poster: "/assets/Eventos/ElSabinazoPoster.jpg",
    photos: [
      "/assets/Eventos/ElSabinazo1.jpg",
      "/assets/Eventos/ElSabinazo2.jpg",
      "/assets/Eventos/ElSabinazo3.jpg",
      "/assets/Eventos/ElSabinazo4.jpg",
      "/assets/Eventos/ElSabinazo5.jpg",
      "/assets/Eventos/ElSabinazo6.jpg",
    ]
  },
  {
    id: "tardeo",
    title: "Tardeo",
    description: "La transición perfecta del día a la noche con buena música, excelente gastronomía y un ambiente inmejorable al atardecer.",
    poster: "/assets/Eventos/TardeoPoster.jpg",
    photos: [
      "/assets/Eventos/Tardeo.jpg",
      "/assets/Eventos/Tardeo1.jpg",
      "/assets/Eventos/Tardeo2.jpg",
      "/assets/Eventos/Tardeo3.jpg",
      "/assets/Eventos/Tardeo4.jpg",
      "/assets/Eventos/Tardeo5.jpg",
      "/assets/Eventos/Tardeo6.jpg",
      "/assets/Eventos/Tardeo7.jpg",
      "/assets/Eventos/Tardeo8.jpg",
      "/assets/Eventos/Tardeo9.jpg",
    ]
  }
];

const upcomingPosters = [
  { img: "/assets/Eventos/PiscisSunsetPoster.jpg", title: "Piscis Sunset" },
  { img: "/assets/Eventos/BateeriaPoster.jpg", title: "Show de Batería" },
  { img: "/assets/Eventos/SaxofonPoster.jpg", title: "Noches de Saxofón" },
  { img: "/assets/Eventos/ConciertosInstrumentosPoster.jpg", title: "Música en Vivo" },
];

export function EventsSection({ }: EventsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % mainEvents.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + mainEvents.length) % mainEvents.length);

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const generateStars = (count: number, withTwinkle = false, withColor = false) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.5 + 0.3,
      delay: withTwinkle ? `${Math.random() * 5}s` : "0s",
      duration: withTwinkle ? `${Math.random() * 4 + 2}s` : "0s",
      isSparkle: Math.random() > 0.65, // 35% chance
      isGold: withColor && Math.random() > 0.7 // 30% chance for gold hue
    }));
  };

  const stars1 = useMemo(() => generateStars(120, false, false), []);
  const stars2 = useMemo(() => generateStars(60, true, false), []);
  const stars3 = useMemo(() => generateStars(25, true, true), []);

  return (
    <section id="eventos" ref={ref} className="relative py-24 px-6 md:px-12 bg-[#090b10] overflow-hidden">
      
      {/* Starry Background Parallax */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.div style={{ y: y1 }} className="absolute -top-[50%] -bottom-[50%] left-0 right-0">
          {stars1.map(star => (
            <div key={star.id} className="absolute rounded-full bg-white opacity-40" style={{ top: star.top, left: star.left, width: star.size, height: star.size }} />
          ))}
        </motion.div>
        
        <motion.div style={{ y: y2 }} className="absolute -top-[50%] -bottom-[50%] left-0 right-0">
          {stars2.map(star => (
            <div 
              key={star.id} 
              className="absolute rounded-full bg-indigo-100 shadow-[0_0_8px_1px_rgba(255,255,255,0.4)] animate-pulse" 
              style={{ top: star.top, left: star.left, width: `${parseFloat(star.size) * 1.5}px`, height: `${parseFloat(star.size) * 1.5}px`, opacity: star.opacity, animationDelay: star.delay, animationDuration: star.duration }} 
            />
          ))}
        </motion.div>
        
        <motion.div style={{ y: y3 }} className="absolute -top-[50%] -bottom-[50%] left-0 right-0">
          {stars3.map(star => (
            star.isSparkle ? (
              <div 
                key={star.id} 
                className="absolute animate-pulse mix-blend-screen leading-none" 
                style={{ 
                  top: star.top, 
                  left: star.left, 
                  fontSize: `${parseFloat(star.size) * 5 + 4}px`, 
                  opacity: Math.min(star.opacity * 1.8, 1),
                  animationDelay: star.delay, 
                  animationDuration: star.duration,
                  color: star.isGold ? '#fff4e6' : '#ffffff',
                  textShadow: star.isGold ? '0 0 15px rgba(200,159,106,0.9), 0 0 30px rgba(200,159,106,0.4)' : '0 0 15px rgba(255,255,255,0.9), 0 0 30px rgba(100,200,255,0.4)'
                }}
              >
                ✦
              </div>
            ) : (
              <div 
                key={star.id} 
                className="absolute rounded-full bg-blue-50 shadow-[0_0_15px_4px_rgba(255,255,255,0.8)] animate-pulse" 
                style={{ 
                  top: star.top, 
                  left: star.left, 
                  width: `${parseFloat(star.size) * 2}px`, 
                  height: `${parseFloat(star.size) * 2}px`, 
                  opacity: star.opacity,
                  animationDelay: star.delay, 
                  animationDuration: star.duration 
                }} 
              />
            )
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-white mb-6">
            Cuando la noche cobra vida
          </h2>
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto">
            No solo somos paisaje y calma. También somos energía, música y celebración. 
            Revive los mejores momentos de nuestras pasadas noches.
          </p>
        </motion.div>

        {/* Premium Carousel */}
        <div className="relative mb-32 min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start"
            >
              {/* Left: Poster & Info */}
              <div className="w-full lg:w-1/3 flex flex-col gap-6">
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(200,159,106,0.2)]">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-transparent to-transparent z-10"></div>
                  <img 
                    src={mainEvents[activeIndex].poster} 
                    alt={mainEvents[activeIndex].title} 
                    className="w-full h-auto max-h-[500px] object-cover" 
                  />
                  <div className="absolute bottom-6 left-6 z-20">
                    <h3 className="text-3xl lg:text-4xl text-white font-medium mb-3 tracking-wide">{mainEvents[activeIndex].title}</h3>
                    <div className="h-1 w-12 bg-[#C89F6A] rounded-full"></div>
                  </div>
                </div>
                <p className="text-zinc-300 text-lg leading-relaxed">
                  {mainEvents[activeIndex].description}
                </p>
              </div>

              {/* Right: Collage Masonry */}
              <div className="w-full lg:w-2/3 max-h-[600px] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20 transition-all">
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                  {mainEvents[activeIndex].photos.map((photo, j) => (
                    <motion.div 
                      key={j}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 + j * 0.05 }}
                      className="rounded-xl overflow-hidden shadow-lg border border-white/5 bg-white/5 break-inside-avoid mb-4"
                    >
                      <img 
                        src={photo} 
                        alt={`Momento ${j}`} 
                        className="w-full hover:scale-105 hover:brightness-110 transition-all duration-500" 
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex justify-center mt-12 gap-6 items-center">
            <button 
              onClick={prevSlide} 
              className="p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-white/10 hover:border-white/20 shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex gap-2">
              {mainEvents.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-8 bg-[#C89F6A]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
            <button 
              onClick={nextSlide} 
              className="p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors backdrop-blur-md border border-white/10 hover:border-white/20 shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-24"></div>

        {/* Upcoming Posters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl text-white font-medium mb-4 flex items-center justify-center gap-3">
              <Calendar className="text-[#C89F6A]" size={32} />
              Próximos Eventos
            </h3>
            <p className="text-zinc-400">Mantente atento a nuestra cartelera y no te pierdas la próxima gran noche.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingPosters.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl group border border-white/5"
              >
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="w-full aspect-[3/4] object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                  <h4 className="text-2xl text-white font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                    {item.title}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-12"
        >
          <button className="px-10 py-5 bg-[#C89F6A] text-[#2A2419] rounded-full hover:bg-[#D4A574] transition-all hover:shadow-[0_0_30px_rgba(200,159,106,0.4)] font-semibold text-lg hover:-translate-y-1">
            Ver calendario de eventos
          </button>
        </motion.div>
      </div>
    </section>
  );
}