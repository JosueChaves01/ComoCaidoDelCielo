import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef, useState } from "react";
import { Calendar } from "lucide-react";
import { SpecialEventCard } from "./SpecialEventCard";
import { SpecialEventsModal } from "./SpecialEventsModal";

export interface SpecialEvent {
  id: string;
  name: string;
  image: string;
  date?: string;
  description: string;
  menu: string[];
}

interface SpecialEventsSectionProps {
  events: SpecialEvent[];
}

export function SpecialEventsSection({ events }: SpecialEventsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEventClick = (event: SpecialEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 bg-gradient-to-b from-[#3A4F35] to-[#0F0F0A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-white mb-6">
            Menús de Eventos Especiales
          </h2>
          <p className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto">
            Descubre nuestros menús exclusivos para eventos especiales. 
            Cada actividad tiene su propio menú único diseñado para complementar la experiencia.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {events.map((event, index) => (
            <SpecialEventCard
              key={event.id}
              event={event}
              onClick={handleEventClick}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <SpecialEventsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        event={selectedEvent}
      />
    </section>
  );
}
