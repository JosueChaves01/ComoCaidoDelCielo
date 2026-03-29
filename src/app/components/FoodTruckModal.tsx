import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { X, ChefHat, Coffee, Cake, Cookie } from "lucide-react";
import { MenuItem } from "./MenuItem";

interface FoodTruckModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

export function FoodTruckModal({ isOpen, onClose, images }: FoodTruckModalProps) {
  const menuItems = [
    {
      name: "Chocolate Caliente con Marshmallows",
      price: 1500,
      description: "Chocolate espeso y cremoso coronado con marshmallows frescos, perfecto para las tardes frescas.",
      image: "https://images.unsplash.com/photo-1542990646-d34eb1520c56?w=400&h=300&fit=crop",
      category: "Bebidas Calientes"
    },
    {
      name: "Chocolate Bautizado",
      price: 2000,
      description: "Nuestra especialidad secreta con un toque especial que lo hace único y memorable.",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
      category: "Bebidas Calientes"
    },
    {
      name: "Chocolate Full",
      price: 2500,
      description: "La experiencia completa de chocolate con todos nuestros acompañamientos especiales.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      category: "Bebidas Calientes"
    },
    {
      name: "Café Especial",
      price: 1200,
      description: "Café recién molido seleccionado de las mejores fincas, preparado al momento.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
      category: "Bebidas Calientes"
    },
    {
      name: "Refrescos Naturales",
      price: 800,
      description: "Bebidas refrescantes preparadas con frutas naturales de la región.",
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop",
      category: "Bebidas Calientes"
    },
    {
      name: "Donas Frescas",
      price: 750,
      description: "Donas esponjosas cubiertas con glaseado casero y toppings variados.",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop",
      category: "Repostería Dulce"
    },
    {
      name: "Tres Leches",
      price: 2000,
      description: "El clásico postre latinoamericano con nuestra receta especial de tres leches.",
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop",
      category: "Repostería Dulce"
    },
    {
      name: "Caja Repostería",
      price: 2500,
      description: "Selección variada de nuestros mejores postres del día, perfecta para compartir.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
      category: "Repostería Dulce"
    },
    {
      name: "Cajita Repostería Salada",
      price: 2000,
      description: "Surtido de bocadillos salados perfectos para acompañar tus bebidas favoritas.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
      category: "Opciones Saladas"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 bg-[#F0E8E0] rounded-3xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-[#2A2419]">Menú Food Truck</h2>
                  <div className="flex items-center gap-4 mt-2 text-[#6B5D4F]">
                    <div className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      <span>Gastronomía con alma</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Menu Items */}
              <section className="p-6 pb-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-[#2A2419] mb-2">Nuestros productos</h3>
                  <p className="text-[#6B5D4F]">
                    Deliciosas opciones preparadas con dedicación para complementar tu experiencia
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <MenuItem
                        name={item.name}
                        price={item.price}
                        description={item.description}
                        image={item.image}
                        category={item.category}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
