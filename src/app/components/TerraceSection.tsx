import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import BackgroundEffectLocal from "./BackgroundEffectLocal";
import { supabase } from "../../lib/supabase";
import { TerraceReservationModal } from "./TerraceReservationModal";

interface TerraceSectionProps {
  images: { description: string; url: string }[];
}

import {
  NarrativeStep,
  SUNSET_IMAGE,
  FIRE_PIT_IMAGE,
  PANORAMIC_IMAGE,
  TERRACE_GALLERY,
  SUNSET_NARRATIVE,
  TERRACE_TYPES_NARRATIVE,
  FIRE_PIT_NARRATIVE,
  PANORAMIC_NARRATIVE
} from "../../data/terraceNarratives";

export function TerraceSection({
  images,
}: TerraceSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [dbTerraces, setDbTerraces] = useState<any[]>([]);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerraces = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('terraces')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (dbError) throw dbError;
        
        if (data && data.length > 0) {
          setDbTerraces(data);
        }
      } catch (err: any) {
        console.error("Error fetching terraces:", err.message);
        setError("No se pudieron cargar todas las terrazas personalizadas.");
      }
    };
    fetchTerraces();
  }, []);

  const sunsetImage = SUNSET_IMAGE;
  const firePitImage = FIRE_PIT_IMAGE;
  const panoramicImage = PANORAMIC_IMAGE;
  const terraceGallery = TERRACE_GALLERY;

  const sunsetNarrative = SUNSET_NARRATIVE;
  const terraceTypesNarrative = TERRACE_TYPES_NARRATIVE;
  const firePitNarrative = FIRE_PIT_NARRATIVE;
  const panoramicNarrative = PANORAMIC_NARRATIVE;

  const currentTerraceGallery = dbTerraces.length > 0
    ? dbTerraces.map((t: any) => t.image_url)
    : terraceGallery;

  const currentTerraceTypesNarrative: NarrativeStep[] = dbTerraces.length > 0
    ? dbTerraces.map((t: any) => ({ title: t.title, description: t.description, highlight: t.highlight }))
    : terraceTypesNarrative;

  return (
    <section
      id="terrazas"
      ref={ref}
      className="py-24 px-6 md:px-12 relative overflow-hidden bg-transparent"
    >
      <BackgroundEffectLocal sectionRef={ref as any} />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl text-[#2A2419] mb-6">
            Nuestras Terrazas
          </h2>
          <p className="text-lg md:text-xl text-[#6B5D4F] max-w-3xl mx-auto mb-8">
            Un viaje sensorial donde cada espacio cuenta su
            propia historia. Descubre la magia de estar en el
            lugar perfecto, en el momento perfecto.
          </p>
          <button
            onClick={() => setIsReservationModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-[#B1630A] to-[#C89F6A] text-white font-bold rounded-xl hover:shadow-[0_4px_20px_rgba(200,159,106,0.4)] transition-all hover:-translate-y-1 transform uppercase tracking-widest text-sm"
          >
            Ver Disponibilidad y Reservar
          </button>
        </motion.div>

        {/* EXPERIENCIA 1: Atardeceres Únicos */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-6"
              >
                <span className="text-sm tracking-wider text-[#966F40] mb-2 block">
                  Experiencia sensorial
                </span>
                <h3 className="text-4xl md:text-5xl text-[#2A2419] mb-4">
                  Atardeceres Únicos
                </h3>
                <p className="text-lg text-[#6B5D4F] leading-relaxed">
                  Vive el espectáculo natural más hermoso desde
                  la primera fila. Cada atardecer es una obra de
                  arte efímera que transforma el golfo de Nicoya
                  en un lienzo de colores imposibles.
                </p>
              </motion.div>

              {/* Guía narrativa paso a paso */}
              <div className="space-y-6">
                {sunsetNarrative.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4 + index * 0.15,
                    }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#E8DCC4]/30 hover:border-[#966F40]/40 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#966F40] to-[#8A7254] flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-[#2A2419] mb-2">
                          {step.title}
                        </h4>
                        <p className="text-[#6B5D4F] mb-3">
                          {step.description}
                        </p>
                        <p className="text-sm text-[#966F40] italic">
                          {step.highlight}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2 relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden group shadow-2xl sticky top-8"
            >
              <img
                src={sunsetImage}
                alt="Atardecer en terraza con vista al golfo"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-sm tracking-wider mb-2 opacity-90">
                  Golden Hour
                </p>
                <p className="text-2xl">5:00 PM - 6:30 PM</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* EXPERIENCIA 2: Distintos Tipos de Terrazas */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative sticky top-8"
            >
              <div className="grid grid-cols-2 gap-4">
                {currentTerraceGallery.slice(0, 4).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + index * 0.1,
                    }}
                    className="relative h-[220px] md:h-[280px] rounded-2xl overflow-hidden group shadow-lg"
                  >
                    <img
                      src={image}
                      alt={`Terraza tipo ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-6"
              >
                <span className="text-sm tracking-wider text-[#966F40] mb-2 block">
                  Espacios versátiles
                </span>
                <h3 className="text-4xl md:text-5xl text-[#2A2419] mb-4">
                  Distintos Tipos y Tamaños
                </h3>
                <p className="text-lg text-[#6B5D4F] leading-relaxed">
                  Cada grupo merece su espacio perfecto. Desde
                  momentos íntimos hasta grandes celebraciones,
                  tenemos la terraza ideal para tu experiencia.
                </p>
              </motion.div>

              {/* Guía narrativa de tipos de terrazas */}
              <div className="space-y-6">
                {currentTerraceTypesNarrative.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6 + index * 0.15,
                    }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#E8DCC4]/30 hover:border-[#966F40]/40 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#8A7254] to-[#6B5D4F] flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-[#2A2419] mb-2">
                          {step.title}
                        </h4>
                        <p className="text-[#6B5D4F] mb-3">
                          {step.description}
                        </p>
                        <p className="text-sm text-[#966F40] italic">
                          {step.highlight}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* EXPERIENCIA 3: Fogatas y Magia Nocturna */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
            <div className="order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="mb-6"
              >
                <span className="text-sm tracking-wider text-[#966F40] mb-2 block">
                  Experiencia nocturna
                </span>
                <h3 className="text-4xl md:text-5xl text-[#2A2419] mb-4">
                  Fogatas y Magia Nocturna
                </h3>
                <p className="text-lg text-[#6B5D4F] leading-relaxed">
                  Cuando cae la noche, la verdadera magia
                  comienza. Las fogatas transforman nuestras
                  terrazas en santuarios de calidez y conexión
                  bajo las estrellas.
                </p>
              </motion.div>

              {/* Guía narrativa de fogatas */}
              <div className="space-y-6">
                {firePitNarrative.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.8 + index * 0.15,
                    }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#E8DCC4]/30 hover:border-[#966F40]/40 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#966F40] to-[#8A7254] flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-[#2A2419] mb-2">
                          {step.title}
                        </h4>
                        <p className="text-[#6B5D4F] mb-3">
                          {step.description}
                        </p>
                        <p className="text-sm text-[#966F40] italic">
                          {step.highlight}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="order-1 md:order-2 relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden group shadow-2xl sticky top-8"
            >
              <img
                src={firePitImage}
                alt="Fogata en terraza bajo las estrellas"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-sm tracking-wider mb-2 opacity-90">
                  Experiencia nocturna
                </p>
                <p className="text-2xl">7:00 PM - 11:00 PM</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* EXPERIENCIA 4: Vistas Panorámicas */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="relative h-[500px] md:h-[700px] rounded-3xl overflow-hidden group shadow-2xl sticky top-8"
            >
              <img
                src={panoramicImage}
                alt="Vista panorámica desde las terrazas"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-sm tracking-wider mb-2 opacity-90">
                  Vista panorámica
                </p>
                <p className="text-2xl">Golfo de Nicoya</p>
              </div>
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="mb-6"
              >
                <span className="text-sm tracking-wider text-[#966F40] mb-2 block">
                  Naturaleza inmersiva
                </span>
                <h3 className="text-4xl md:text-5xl text-[#B1630A] mb-4">
                  Vistas Que Quitan el Aliento
                </h3>
                <p className="text-lg text-[#6B5D4F] leading-relaxed">
                  No es solo observar un paisaje, es convertirse
                  en parte de él. Cada terraza ofrece una
                  perspectiva única del esplendor natural de
                  Costa Rica.
                </p>
              </motion.div>

              {/* Guía narrativa de vistas */}
              <div className="space-y-6">
                {panoramicNarrative.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 1.0 + index * 0.15,
                    }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#E8DCC4]/30 hover:border-[#966F40]/40 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#8A7254] to-[#6B5D4F] flex items-center justify-center text-white text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-[#2A2419] mb-2">
                          {step.title}
                        </h4>
                        <p className="text-[#6B5D4F] mb-3">
                          {step.description}
                        </p>
                        <p className="text-sm text-[#966F40] italic">
                          {step.highlight}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.5 }}
                className="mt-8 bg-gradient-to-br from-[#966F40] to-[#8A7254] rounded-2xl p-6 text-white"
              >
                <p className="text-sm tracking-wider mb-3 opacity-90">
                  Lo que verás
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="opacity-80 mb-1">Horizonte</p>
                    <p className="text-lg">∞ Infinito</p>
                  </div>
                  <div>
                    <p className="opacity-80 mb-1">Altura</p>
                    <p className="text-lg">150m</p>
                  </div>
                  <div>
                    <p className="opacity-80 mb-1">
                      Visibilidad
                    </p>
                    <p className="text-lg">360°</p>
                  </div>
                  <div>
                    <p className="opacity-80 mb-1">Amanecer</p>
                    <p className="text-lg">5:30 AM</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <TerraceReservationModal
        isOpen={isReservationModalOpen}
        onClose={() => setIsReservationModalOpen(false)}
      />
    </section>
  );
}
