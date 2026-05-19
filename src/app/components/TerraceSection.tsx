import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Users } from "lucide-react";
import { supabase } from "../../lib/supabase";
import {
  TERRACE_TYPES_NARRATIVE,
  TERRACE_GALLERY,
} from "../../data/terraceNarratives";

interface TerraceSectionProps {
  images?: { description: string; url: string }[];
  onOpenReservation?: () => void;
}

export function TerraceSection({ images, onOpenReservation }: TerraceSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [dbTerraces, setDbTerraces] = useState<any[]>([]);

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
      }
    };
    fetchTerraces();
  }, []);

  // Sync narrative with DB data if available
  const terracesToRender = dbTerraces.length > 0 
    ? dbTerraces.map((t, i) => ({
        title: t.title,
        description: t.description || TERRACE_TYPES_NARRATIVE[i]?.description || "",
        highlight: t.highlight || TERRACE_TYPES_NARRATIVE[i]?.highlight || "",
        image: t.image_url || TERRACE_GALLERY[i] || "",
        capacity: t.max_capacity ? `${t.max_capacity} PAX` : (i === 0 ? "2-4 PAX" : i === 1 ? "6-10 PAX" : i === 2 ? "12+ PAX" : "EXCLUSIVO")
      }))
    : TERRACE_TYPES_NARRATIVE.map((step, i) => ({
        title: step.title,
        description: step.description,
        highlight: step.highlight,
        image: TERRACE_GALLERY[i],
        capacity: i === 0 ? "2-4 PAX" : i === 1 ? "6-10 PAX" : i === 2 ? "12+ PAX" : "EXCLUSIVO"
      }));

  return (
    <section
      id="terrazas"
      ref={ref}
      className="py-24 px-6 md:px-12 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-sm tracking-widest text-[#C89F6A] mb-3 block uppercase font-bold">
            Espacios con Alma
          </span>
          <h2 className="text-4xl md:text-6xl text-white mb-6">
            Nuestras Terrazas
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
            Descubre el rincón perfecto para tu próxima experiencia. Cada terraza ha sido 
            diseñada para ofrecerte vistas inigualables y un ambiente de máxima exclusividad.
          </p>

          <button
            onClick={onOpenReservation}
            className="px-8 py-4 bg-gradient-to-r from-[#B1630A] to-[#C89F6A] text-white font-bold rounded-xl hover:shadow-[0_4px_20px_rgba(200,159,106,0.4)] transition-all hover:-translate-y-1 transform uppercase tracking-widest text-sm"
          >
            Ver Disponibilidad y Reservar
          </button>
        </motion.div>

        {/* 4 Cards Grid/Scroll */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar">
          {terracesToRender.map((terrace, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2 + index * 0.1,
              }}
              className="min-w-[85%] md:min-w-0 snap-center bg-black/20 backdrop-blur-xl backdrop-saturate-150 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.6)] group flex flex-col h-full"
            >
              {/* Header: Title + Capacity */}
              <div className="p-8 pb-5 flex justify-between items-start gap-3">
                <h4 className="text-2xl text-white font-serif leading-tight group-hover:text-[#C89F6A] transition-colors">
                  {terrace.title}
                </h4>
                <div className="flex-shrink-0 bg-white/10 backdrop-blur-md backdrop-saturate-150 px-3 py-1.5 rounded-full text-white/80 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/15">
                  <Users size={12} />
                  {terrace.capacity}
                </div>
              </div>

              {/* Image Container */}
              <div className="px-6 relative h-48 overflow-hidden">
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-inner border border-white/20">
                  <img
                    src={terrace.image}
                    alt={terrace.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-x-6 bottom-0 h-1/2 bg-gradient-to-t from-[#2A2419]/20 to-transparent" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {terrace.title.toLowerCase().includes("atardecer") ? "Disfruta de los mejores crepúsculos de San Ramón en un ambiente íntimo y acogedor." : terrace.description}
                </p>
                
                <div className="mt-auto pt-5 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C89F6A]" />
                    <p className="text-xs text-[#C89F6A] font-bold uppercase tracking-widest">
                      Destacado
                    </p>
                  </div>
                  <p className="text-white/60 text-sm italic mt-1 font-medium">
                    {terrace.highlight}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
