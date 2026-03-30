import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Users, Wifi, Car, Shield, Flame, Bath, Bed, ChefHat, Home as HomeIcon, TreePine, Zap, Waves, Utensils, Coffee, Gamepad2, Tv, Phone } from "lucide-react";

interface AirbnbModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

interface AmenityCategory {
  title: string;
  icon: React.ReactNode;
  amenities: string[];
}

export function AirbnbModal({ isOpen, onClose, images }: AirbnbModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const amenityCategories: AmenityCategory[] = [
    {
      title: "Alojamiento",
      icon: <HomeIcon className="w-5 h-5" />,
      amenities: [
        "2 dormitorios con camas cómodas",
        "Baño completo con agua caliente",
        "TV en las habitaciones",
        "Toallas y amenities incluidos"
      ]
    },
    {
      title: "Cocina y Comedor",
      icon: <ChefHat className="w-5 h-5" />,
      amenities: [
        "Cocina totalmente equipada",
        "Refrigerador, microondas y horno",
        "Utensilios y vajilla completa",
        "Mesa para compartir"
      ]
    },
    {
      title: "Exterior y Relax",
      icon: <TreePine className="w-5 h-5" />,
      amenities: [
        "Área de fogatas",
        "Parrilla y asador",
        "Patio con vistas",
        "Jardín privado"
      ]
    },
    {
      title: "Servicios",
      icon: <Zap className="w-5 h-5" />,
      amenities: [
        "Wifi gratuito",
        "Estacionamiento privado",
        "Se permiten mascotas",
        "Anfitrión disponible"
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-6xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#8B6F47] via-[#D4A574] to-[#F5EFE6] rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#8B6F47]/95 backdrop-blur-sm border-b border-[#C19A6B]/30 rounded-t-3xl p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white">Cabaña en las Terrazas</h2>
                  <div className="flex items-center gap-4 mt-2 text-white/80">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Nicoya, Guanacaste</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Hasta 6 huéspedes</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="relative h-[400px] md:h-[500px] bg-gray-100">
              <img
                src={images[currentImageIndex]}
                alt={`Imagen ${currentImageIndex + 1} del hospedaje`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-105"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-105"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Thumbnail Strip */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-[#C19A6B] scale-110'
                        : 'border-white/50 hover:border-white'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-8">
              {/* About This Space */}
              <section className="bg-gradient-to-r from-[#F5F2E8] to-[#E8DCC4]/30 rounded-2xl p-8 border border-[#C19A6B]/20">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-[#C19A6B]/20 rounded-xl">
                    <HomeIcon className="w-6 h-6 text-[#C19A6B]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#2A2419] mb-2">Acerca de este espacio</h3>
                    <p className="text-[#6B5D4F] leading-relaxed">
                      Este acogedor refugio familiar ofrece tranquilidad absoluta en medio de la naturaleza. 
                      Ubicado estratégicamente junto a la vía principal para facilitar el acceso, combina comodidad 
                      moderna con la serenidad del entorno natural.
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 text-[#6B5D4F]">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#C19A6B]" />
                      <span>Parqueadero privado seguro</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-4 h-4 text-[#C19A6B]" />
                      <span>Baño completo con agua caliente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#C19A6B]" />
                      <span>Fogatas interior y exterior</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-[#C19A6B]" />
                      <span>WiFi gratuito</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm leading-relaxed">
                    <p>
                      La cabaña cuenta con una habitación principal en el segundo piso equipada con 
                      dos camas individuales, una matrimonial y televisor para entretenimiento.
                    </p>
                    <p>
                      En la planta baja, una habitación adicional con camarote ofrece flexibilidad 
                      para diferentes configuraciones de huéspedes.
                    </p>
                  </div>
                </div>
              </section>

              {/* Guest Access */}
              <section className="bg-[#F5F2E8]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#C19A6B]/20">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-[#8B7355]" />
                  <h3 className="text-xl font-semibold text-[#2A2419]">Acceso de los huéspedes</h3>
                </div>
                <p className="text-[#6B5D4F] leading-relaxed">
                  Disfruta de privacidad total en todas las áreas de la cabaña. Desde el jardín hasta 
                  las habitaciones, cada espacio está diseñado para ofrecer una experiencia íntima 
                  y personalizada, permitiendo que te sientas completamente en casa.
                </p>
              </section>

              {/* Amenities */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-6">Lo que este lugar ofrece</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {amenityCategories.map((category, index) => (
                    <motion.div
                      key={category.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-[#F5F2E8] rounded-2xl p-4 border border-[#C19A6B]/20 hover:border-[#C19A6B]/40 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#C19A6B]/20 rounded-lg text-[#C19A6B]">
                          {category.icon}
                        </div>
                        <h4 className="text-lg font-semibold text-[#2A2419]">{category.title}</h4>
                      </div>
                      <ul className="space-y-1">
                        {category.amenities.map((amenity, amenityIndex) => (
                          <li key={amenityIndex} className="flex items-center gap-2 text-[#6B5D4F]">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C19A6B]"></div>
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Location Features */}
              <section>
                <h3 className="text-2xl font-bold text-white mb-4">Características de la ubicación</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-[#F5F2E8] rounded-xl">
                    <div className="p-2 bg-[#8B7355]/20 rounded-lg">
                      <Car className="w-5 h-5 text-[#8B7355]" />
                    </div>
                    <span className="text-[#6B5D4F]">Estacionamiento gratuito en las instalaciones</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#F5F2E8] rounded-xl">
                    <div className="p-2 bg-[#8B7355]/20 rounded-lg">
                      <HomeIcon className="w-5 h-5 text-[#8B7355]" />
                    </div>
                    <span className="text-[#6B5D4F]">Entrada independiente</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#F5F2E8] rounded-xl">
                    <div className="p-2 bg-[#8B7355]/20 rounded-lg">
                      <Flame className="w-5 h-5 text-[#8B7355]" />
                    </div>
                    <span className="text-[#6B5D4F]">Lugar para hacer fogata</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-[#F5F2E8] rounded-xl">
                    <div className="p-2 bg-[#8B7355]/20 rounded-lg">
                      <TreePine className="w-5 h-5 text-[#8B7355]" />
                    </div>
                    <span className="text-[#6B5D4F]">Jardín privado</span>
                  </div>
                </div>
              </section>

              {/* Pricing & Booking */}
              <section className="bg-gradient-to-r from-[#C19A6B] to-[#8B7355] rounded-2xl p-8 text-white">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Reservar tu estadía</h3>
                    <p className="mb-4 opacity-90">
                      Desde $85 USD por noche. Precios pueden variar según temporada.
                    </p>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Mínimo 2 noches</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Hasta 6 huéspedes</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <button className="px-8 py-4 bg-white text-[#8B7355] rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
                      Ver disponibilidad en Airbnb
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
