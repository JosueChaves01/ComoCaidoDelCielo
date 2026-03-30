import { motion } from "motion/react";

interface SpecialEvent {
  id: string;
  name: string;
  image: string;
  date?: string;
  description: string;
  menu: string[];
}

interface SpecialEventCardProps {
  event: SpecialEvent;
  onClick: (event: SpecialEvent) => void;
}

export function SpecialEventCard({ event, onClick }: SpecialEventCardProps) {
  return (
    <motion.div 
      onClick={() => onClick(event)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden shadow-2xl group border border-white/5 cursor-pointer"
    >
      <img 
        src={event.image} 
        alt={event.name} 
        className="w-full aspect-[3/4] object-cover group-hover:scale-110 group-hover:blur-[2px] transition-all duration-700" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
        <h4 className="text-2xl text-white font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
          {event.name}
        </h4>
        {event.date && (
          <p className="text-white/80 text-sm mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
            {event.date}
          </p>
        )}
        <div className="mt-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-200">
          <span className="inline-block px-3 py-1 bg-[#C89F6A]/20 backdrop-blur-sm text-[#C89F6A] text-xs rounded-full border border-[#C89F6A]/30">
            Ver menú completo
          </span>
        </div>
      </div>
    </motion.div>
  );
}
