import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { X, ChefHat, Coffee, Cake, Cookie, Loader2, Flame, Wine, Beer } from "lucide-react";
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
  const [activeCategory, setActiveCategory] = useState<string>("todos");

  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setMenuItems(staticMenuItems);
    }
  }, [isOpen]);

  const filteredItems = activeCategory === "todos" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const categories = [
    { id: "todos", name: "Todos los productos", icon: Coffee },
    { id: "fogata", name: "Llamada para la fogata", icon: Flame },
    { id: "reposteria", name: "Repostería", icon: Cake },
    { id: "refrescos", name: "Refrescos", icon: Coffee },
    { id: "calientes", name: "Bebidas calientes", icon: Coffee },
    { id: "alcoholicas", name: "Bebidas alcohólicas", icon: Wine }
  ];

  // Static menu data based on provided structure with specific real images
  const staticMenuItems: MenuData[] = [
    // Llamada para la fogata
    { name: "Malvabiscos", price: 1000, description: "18 unidades para compartir", image: "https://img.alicdn.com/i4/1830416989/TB286fnXG8lpuFjy0FpXXaGrpXa_!!1830416989.jpg", category: "fogata", is_available: true, sort_order: 1 },
    { name: "Chips Tosty", price: 500, description: "Crujientes y deliciosos", image: "https://tostydiversion.com/wp-content/uploads/2019/08/slider-productos-snacks.png", category: "fogata", is_available: true, sort_order: 2 },
    { name: "Pringles", price: 1000, description: "Papas fritas originales", image: "https://static.vecteezy.com/system/resources/previews/012/989/011/large_2x/pringles-variety-of-flavors-many-cardboard-tube-cans-with-pringles-potato-chips-pringles-is-a-brand-of-potato-snack-chips-owned-by-the-kellogg-company-free-photo.JPG", category: "fogata", is_available: true, sort_order: 3 },
    
    // Repostería
    { name: "Rollo de canela", price: 1000, description: "3 unidades recién horneadas", image: "https://th.bing.com/th/id/R.a2ef90707dde64fc63aa3d123b4f3491?rik=MAGznKoeTFvOFw&pid=ImgRaw&r=0", category: "reposteria", is_available: true, sort_order: 1 },
    { name: "Brownie", price: 500, description: "Chocolate intenso y húmedo", image: "https://tse1.mm.bing.net/th/id/OIP.MmgpqIBQdSKbl4uKRp1FawHaLH?rs=1&pid=ImgDetMain&o=7&rm=3", category: "reposteria", is_available: true, sort_order: 2 },
    { name: "Arroz con leche", price: 1000, description: "Tradicional y cremoso", image: "https://tse2.mm.bing.net/th/id/OIP.9Z9WXwi-L4p389D2p9bVxAHaEk?rs=1&pid=ImgDetMain&o=7&rm=3", category: "reposteria", is_available: true, sort_order: 3 },
    { name: "Queque chocolate", price: 500, description: "Esponjoso y rico", image: "https://th.bing.com/th/id/R.b161c00ac7e67fbabc0108604efa0fe3?rik=6s9gYBV2S6Ks0A&riu=http%3a%2f%2fwww.recetasdiarias.com%2fwp-content%2fuploads%2f2016%2f01%2fqueque-de-chocolate.jpg&ehk=hwWcpww74z0zTLHhgDLZEcXg9jK8u5ZIoQf42uqLVPQ%3d&risl=&pid=ImgRaw&r=0", category: "reposteria", is_available: true, sort_order: 4 },
    { name: "Queque seco", price: 500, description: "Clásico costarricense", image: "https://tse2.mm.bing.net/th/id/OIP.OTGE0_rOFxGIzwh6xpYmDwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3", category: "reposteria", is_available: true, sort_order: 5 },
    
    // Refrescos
    { name: "Coca Cola", price: 1000, description: "Refrescante y clásica", image: "https://wallpapers.com/images/hd/coca-cola-2250-x-1500-picture-09nyemq9u8q3i851.jpg", category: "refrescos", is_available: true, sort_order: 1 },
    { name: "Coca Cola Zero", price: 1000, description: "Mismo sabor, cero azúcar", image: "https://p4.wallpaperbetter.com/wallpaper/181/840/952/coca-cola-zero-bank-ice-wallpaper-preview.jpg", category: "refrescos", is_available: true, sort_order: 2 },
    { name: "Fanta Naranja", price: 1500, description: "Cítrica y refrescante", image: "https://tse4.mm.bing.net/th/id/OIP.ripAiKGq7d7-_Nxr6VWZKgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", category: "refrescos", is_available: true, sort_order: 3 },
    { name: "Fanta Kolita", price: 1000, description: "Sabor tropical", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop", category: "refrescos", is_available: true, sort_order: 4 },
    { name: "Fresca", price: 1000, description: "Refresco ligero y cítrico", image: "https://ferretica.shsolutionscr.com/assets/uploads/e939455358f9c5215d4dcfbf677c8149.png", category: "refrescos", is_available: true, sort_order: 5 },
    { name: "Té frío", price: 500, description: "Natural y refrescante", image: "https://th.bing.com/th/id/R.3d57b1aaf2cbbf9d62a3d30fa703d264?rik=a%2f0b1z%2bopCcvrw&pid=ImgRaw&r=0", category: "refrescos", is_available: true, sort_order: 6 },
    
    // Bebidas calientes
    { name: "Café Negro", price: 1000, description: "Intenso y aromático", image: "https://tse1.mm.bing.net/th/id/OIP.lIEmYBqTmnmXzto9aH7f0AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", category: "calientes", is_available: true, sort_order: 1 },
    { name: "Café con leche", price: 1000, description: "Suave y cremoso", image: "https://coffeevoila.com/wp-content/uploads/2024/11/Cafe-con-leche-recipe-1.jpg", category: "calientes", is_available: true, sort_order: 2 },
    { name: "Té", price: 800, description: "Relajante y natural", image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop", category: "calientes", is_available: true, sort_order: 3 },
    { name: "Chocolate con malvabiscos", price: 1500, description: "Cálido y delicioso", image: "https://img.cocinarico.es/2019-12/chocolate-caliente-con-malvaviscos-1.jpg", category: "calientes", is_available: true, sort_order: 4 },
    { name: "Chocolate", price: 1200, description: "Clásico y reconfortante", image: "https://tse2.mm.bing.net/th/id/OIP.xidCEKW-HAGcgKCt_B5EngHaFj?rs=1&pid=ImgDetMain&o=7&rm=3", category: "calientes", is_available: true, sort_order: 5 },
    { name: "Infusión de menta de la huerta", price: 1000, description: "Fresca y medicinal", image: "https://www.shutterstock.com/image-photo/tea-cup-260nw-203498539.jpg", category: "calientes", is_available: true, sort_order: 6 },
    
    // Bebidas alcohólicas
    { name: "Cerveza Nacional", price: 1500, description: "Cerveza local", image: "https://tse2.mm.bing.net/th/id/OIP.3Uds8fpM1p3rXJn3FQuVCQHaHm?rs=1&pid=ImgDetMain&o=7&rm=3", category: "alcoholicas", is_available: true, sort_order: 1 },
    { name: "Cerveza extranjera", price: 2000, description: "Importada y premium", image: "https://th.bing.com/th/id/R.fac48009b47d9b98bf0f67ec455f90c9?rik=xRcdiSo4et2ZiA&pid=ImgRaw&r=0", category: "alcoholicas", is_available: true, sort_order: 2 },
    { name: "Bavaria", price: 2000, description: "Cerveza de calidad", image: "https://cdnx.jumpseller.com/asesoria-tecnologica-old-/image/13004345/resize/1200/1200?1643729462", category: "alcoholicas", is_available: true, sort_order: 3 },
    { name: "Smirnoff", price: 2000, description: "Vodka premium", image: "https://tse3.mm.bing.net/th/id/OIP.oYv6rTDVfPhCsEl7qYXbwQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", category: "alcoholicas", is_available: true, sort_order: 4 },
    { name: "Copa vino tinto", price: 3500, description: "Vino tinto de calidad", image: "https://tse2.mm.bing.net/th/id/OIP.SLqV6RsR0LGEWy09bOx5twHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", category: "alcoholicas", is_available: true, sort_order: 5 },
    { name: "Copa vino blanco", price: 3000, description: "Vino blanco fresco", image: "https://tse4.mm.bing.net/th/id/OIP.lx87HpVbrSpCffsI0nr4TAHaEK?rs=1&pid=ImgDetMain&o=7&rm=3", category: "alcoholicas", is_available: true, sort_order: 6 },
    { name: "Vino caliente", price: 2000, description: "Especias y calor", image: "https://media.glamour.mx/photos/61907f242d97bd4c522a91b0/master/w_1600%2Cc_limit/210348.jpg", category: "alcoholicas", is_available: true, sort_order: 7 }
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
            className="fixed inset-2 md:inset-8 lg:inset-12 max-w-7xl mx-auto bg-gradient-to-br from-[#3B2A22] via-[#C89F6A] to-[#F5EFE6] rounded-2xl md:rounded-3xl overflow-hidden z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#3B2A22] via-[#8B6F47] to-[#C89F6A] backdrop-blur-sm border-b border-[#D4A574]/30 p-4 md:p-6">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-white font-serif mb-1 md:mb-2">Menú Rincón del Atardecer</h2>
                  <div className="flex items-center gap-2 md:gap-4 text-white/90">
                    <div className="flex items-center gap-1 md:gap-2 bg-white/10 px-2 md:px-3 py-1 rounded-full">
                      <ChefHat className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm font-medium">Gastronomía con alma</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 md:p-3 hover:bg-white/20 rounded-full transition-all duration-300 text-white hover:rotate-90 flex-shrink-0"
                  aria-label="Cerrar modal"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </div>

            {/* Category Navigation */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#C89F6A]/90 to-[#D4A574]/90 backdrop-blur-sm border-b border-[#F5EFE6]/20 px-3 md:px-6 py-3 md:py-4">
              {/* Mobile Grid Layout */}
              <div className="sm:hidden">
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = activeCategory === category.id;
                    
                    return (
                      <motion.button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-xs font-medium transition-all duration-300 ${
                          isActive
                            ? "bg-[#C89F6A] text-white shadow-lg scale-105 border-2 border-white"
                            : "bg-[#3B2A22] text-white hover:bg-[#3B2A22]/90 border border-[#C89F6A]/30"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-center leading-tight">
                          {category.id === 'todos' ? 'Todos' : 
                           category.id === 'fogata' ? 'Fogata' :
                           category.id === 'reposteria' ? 'Repost.' :
                           category.id === 'refrescos' ? 'Refres.' :
                           category.id === 'calientes' ? 'Calient.' :
                           'Alc.'}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
              
              {/* Tablet+ Horizontal Tabs */}
              <div className="hidden sm:flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
                {categories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  
                  return (
                    <motion.button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 ${
                        isActive
                          ? "bg-[#C89F6A] text-white shadow-lg scale-105 border-2 border-white"
                          : "bg-[#3B2A22]/80 text-white hover:bg-[#3B2A22] border border-[#C89F6A]/30"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="hidden md:inline">{category.name}</span>
                      <span className="md:hidden">
                        {category.id === 'todos' ? 'Todos' : 
                         category.id === 'fogata' ? 'Fogata' :
                         category.id === 'reposteria' ? 'Repost.' :
                         category.id === 'refrescos' ? 'Refres.' :
                         category.id === 'calientes' ? 'Calient.' :
                         'Alc.'}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Menu Items */}
              <section className="p-4 md:p-6 lg:p-10 pb-20">
                <div className="text-center mb-8 md:mb-12">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#3B2A22] mb-2 md:mb-3">
                    {activeCategory === "todos" ? "Todos nuestros productos" : categories.find(c => c.id === activeCategory)?.name}
                  </h3>
                  <p className="text-sm md:text-base text-[#6B5D4F] max-w-2xl mx-auto">
                    Deliciosas opciones preparadas con dedicación para complementar tu experiencia
                  </p>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-[#6B5D4F] gap-4">
                    <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" />
                    <p className="animate-pulse text-sm md:text-base">Cargando delicias...</p>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-20 text-[#6B5D4F]">
                    <p className="text-sm md:text-base">No hay productos disponibles en esta categoría.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
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
                )}
              </section>

              {/* Footer Note */}
              <div className="sticky bottom-0 bg-gradient-to-r from-[#C89F6A]/90 to-[#D4A574]/90 backdrop-blur-sm border-t border-[#F5EFE6]/20 p-3 md:p-4 text-center">
                <p className="text-[#3B2A22] font-medium text-xs md:text-sm">
                  ⚠️ El menú puede variar dependiendo del día, se acepta sinpe y efectivo
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

