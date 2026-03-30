import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { X, ChefHat, Coffee, Cake, Cookie, Loader2 } from "lucide-react";
import { MenuItem } from "./MenuItem";
import { supabase } from "../../lib/supabase";

interface FoodTruckModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
}

interface MenuData {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  is_available: boolean;
  sort_order: number;
}

export function FoodTruckModal({ isOpen, onClose }: FoodTruckModalProps) {
  const [menuItems, setMenuItems] = useState<MenuData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchMenu = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("menu_items")
            .select("*")
            .order("is_available", { ascending: false })
            .order("sort_order", { ascending: true });

          if (error) throw error;
          if (data) setMenuItems(data);
        } catch (error) {
          console.error("Error fetching menu:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMenu();
    }
  }, [isOpen]);

  const categories = [
    { name: "Bebidas Calientes", icon: Coffee },
    { name: "Comida", icon: Cookie },
    { name: "Repostería", icon: Cake, filter: (cat: string) => cat.includes("Repostería") },
    { name: "Opciones Saladas", icon: Cookie }
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
            className="fixed inset-4 md:inset-12 lg:inset-20 max-w-6xl mx-auto bg-gradient-to-br from-[#8B6F47] via-[#D4A574] to-[#F5EFE6] rounded-3xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#8B6F47]/95 backdrop-blur-sm border-b border-[#C19A6B]/30 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white font-serif">Menú Rincón del Atardecer</h2>
                  <div className="flex items-center gap-4 mt-2 text-white/80">
                    <div className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      <span className="text-sm">Gastronomía con alma</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                  aria-label="Cerrar modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Menu Items */}
              <section className="p-6 md:p-10 pb-6">
                <div className="text-center mb-12">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Nuestros productos</h3>
                  <p className="text-white/70 max-w-2xl mx-auto">
                    Deliciosas opciones preparadas con dedicación para complementar tu experiencia
                  </p>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-white/60 gap-4">
                    <Loader2 className="w-10 h-10 animate-spin" />
                    <p className="animate-pulse">Cargando delicias...</p>
                  </div>
                ) : menuItems.length === 0 ? (
                  <div className="text-center py-20 text-white/40">
                    <p>El menú no está disponible en este momento.</p>
                  </div>
                ) : (
                  <div className="space-y-12 mb-8">
                    {categories.map((catGroup) => {
                      const filteredItems = menuItems.filter(item => 
                        catGroup.filter ? catGroup.filter(item.category) : item.category === catGroup.name
                      );

                      if (filteredItems.length === 0) return null;

                      const Icon = catGroup.icon;

                      return (
                        <div key={catGroup.name} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-2">
                            <div className="p-2 bg-white/10 rounded-lg">
                              <Icon className="w-5 h-5 text-[#C19A6B]" />
                            </div>
                            <h4 className="text-xl font-semibold text-white tracking-wide">{catGroup.name}</h4>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            {filteredItems.map((item, index) => (
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
                                  isAvailable={item.is_available}
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

