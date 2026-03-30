import { motion } from "motion/react";
import { X, Clock, MapPin, Star } from "lucide-react";

interface SpecialEvent {
  id: string;
  name: string;
  image: string;
  date?: string;
  description: string;
  menu: string[];
}

interface SpecialEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: SpecialEvent | null;
}

export function SpecialEventsModal({ isOpen, onClose, event }: SpecialEventsModalProps) {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden bg-gradient-to-br from-[#8B6F47] via-[#D4A574] to-[#F5EFE6] rounded-3xl shadow-2xl z-10"
      >
        {/* Header with image */}
        <div className="relative h-64 md:h-80">
          <img 
            src={event.image} 
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Title overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl md:text-4xl text-white font-bold mb-2">
              {event.name}
            </h2>
            {event.date && (
              <div className="flex items-center gap-2 text-white/90">
                <Clock size={16} />
                <span>{event.date}</span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-20rem)]">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-[#2A2419] mb-3 flex items-center gap-2">
              <Star className="text-[#C89F6A]" size={20} />
              Acerca del evento
            </h3>
            <p className="text-[#6B5D4F] leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="text-xl font-semibold text-[#2A2419] mb-4 flex items-center gap-2">
              <MapPin className="text-[#C89F6A]" size={20} />
              Menú Especial
            </h3>
            <div className="grid gap-3">
              {event.menu.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-white/30 rounded-lg backdrop-blur-sm border border-[#C89F6A]/20"
                >
                  <div className="w-2 h-2 rounded-full bg-[#C89F6A] mt-2 flex-shrink-0" />
                  <span className="text-[#2A2419] font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
