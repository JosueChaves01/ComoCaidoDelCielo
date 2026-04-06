import React from "react";
import { 
  Home as HomeIcon, 
  ChefHat, 
  TreePine, 
  Zap,
  Car,
  Bath,
  Flame,
  Wifi
} from "lucide-react";

export interface AmenityCategory {
  title: string;
  icon: React.ReactNode;
  amenities: string[];
}

export const AIRBNB_DESCRIPTION = {
  title: "Cabaña en las Terrazas",
  location: "Nicoya, Guanacaste",
  guests: "Hasta 6 huéspedes",
  aboutShort: `Este acogedor refugio familiar ofrece tranquilidad absoluta en medio de la naturaleza. 
  Ubicado estratégicamente junto a la vía principal para facilitar el acceso, combina comodidad 
  moderna con la serenidad del entorno natural.`,
  details: [
    "La cabaña cuenta con una habitación principal en el segundo piso equipada con dos camas individuales, una matrimonial y televisor para entretenimiento.",
    "En la planta baja, una habitación adicional con camarote ofrece flexibilidad para diferentes configuraciones de huéspedes."
  ],
  guestAccess: `Disfruta de privacidad total en todas las áreas de la cabaña. Desde el jardín hasta 
  las habitaciones, cada espacio está diseñado para ofrecer una experiencia íntima 
  y personalizada, permitiendo que te sientas completamente en casa.`,
  pricing: "Desde $85 USD por noche. Precios pueden variar según temporada.",
  minNights: 2
};

export const AMENITY_CATEGORIES: AmenityCategory[] = [
  {
    title: "Alojamiento",
    icon: React.createElement(HomeIcon, { className: "w-5 h-5" }),
    amenities: [
      "2 dormitorios con camas cómodas",
      "Baño completo con agua caliente",
      "TV en las habitaciones",
      "Toallas y amenities incluidos"
    ]
  },
  {
    title: "Cocina y Comedor",
    icon: React.createElement(ChefHat, { className: "w-5 h-5" }),
    amenities: [
      "Cocina totalmente equipada",
      "Refrigerador, microondas y horno",
      "Utensilios y vajilla completa",
      "Mesa para compartir"
    ]
  },
  {
    title: "Exterior y Relax",
    icon: React.createElement(TreePine, { className: "w-5 h-5" }),
    amenities: [
      "Área de fogatas",
      "Parrilla y asador",
      "Patio con vistas",
      "Jardín privado"
    ]
  },
  {
    title: "Servicios",
    icon: React.createElement(Zap, { className: "w-5 h-5" }),
    amenities: [
      "Wifi gratuito",
      "Estacionamiento privado",
      "Se permiten mascotas",
      "Anfitrión disponible"
    ]
  }
];

export const LOCATION_FEATURES = [
  { icon: React.createElement(Car, { className: "w-5 h-5 text-[#8B7355]" }), text: "Estacionamiento gratuito en las instalaciones" },
  { icon: React.createElement(HomeIcon, { className: "w-5 h-5 text-[#8B7355]" }), text: "Entrada independiente" },
  { icon: React.createElement(Flame, { className: "w-5 h-5 text-[#8B7355]" }), text: "Lugar para hacer fogata" },
  { icon: React.createElement(TreePine, { className: "w-5 h-5 text-[#8B7355]" }), text: "Jardín privado" }
];
