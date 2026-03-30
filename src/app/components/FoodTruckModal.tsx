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
      image: "https://comidaspelomundo.com/wp-content/uploads/2023/09/chocolate-e-marshmallow.jpg",
      category: "Bebidas Calientes"
    },
    {
      name: "Chocolate Bautizado",
      price: 2000,
      description: "Nuestra especialidad secreta con un toque especial que lo hace único y memorable.",
      image: "https://cocina.guru/wp-content/uploads/2024/01/Receta-de-Chocolate-Caliente.jpg",
      category: "Bebidas Calientes"
    },
    {
      name: "Chocolate Full",
      price: 2500,
      description: "La experiencia completa de chocolate con todos nuestros acompañamientos especiales.",
      image: "https://cdn.momsdish.com/wp-content/uploads/2023/12/Crockpot-Hot-Chocolate-07-1200x800.jpg",
      category: "Bebidas Calientes"
    },
    {
      name: "Café ",
      price: 1200,
      description: "Café recién molido seleccionado de las mejores fincas, preparado al momento.",
      image: "https://tse1.mm.bing.net/th/id/OIP.4HPMYZ9ZVlCjwDnOvQVvngHaE8?rs=1&pid=ImgDetMain&o=7&rm=3",
      category: "Bebidas Calientes"
    },
    {
      name: "Sandwich",
      price: 2000,
      description: "Sandwich fresco con ingredientes seleccionados, perfecto para complementar tu experiencia.",
      image: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.75761-15/476257377_18013476665690161_905882436149764683_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=13d280&_nc_ohc=p9Ww65InfEIQ7kNvwGd3T4t&_nc_oc=AdoD8OWzyGwp_yRLyJm4OtVUsVQMqURVsMZhfmMytks60P6wXhPBELHgKLqPbHV_-OZdPdeyV0ewTeYXIP_AitTS&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=JSth1nyyLkxXRFhm2LrV0A&_nc_ss=7a30f&oh=00_Afxk5R5fFRqrFUduHe0KUjVBhZk21zcEWQlFo_VqhMN9ng&oe=69CEA8AD",
      category: "Comida"
    },
    {
      name: "Donas Frescas",
      price: 750,
      description: "Donas esponjosas cubiertas con glaseado casero y toppings variados.",
      image: "https://www.cardamomo.news/__export/1678300932103/sites/debate/img/2023/03/08/donas-krispy-kreme.jpg_242310155.jpg",
      category: "Repostería Dulce"
    },
    {
      name: "Tres Leches",
      price: 2000,
      description: "El clásico postre latinoamericano con nuestra receta especial de tres leches.",
      image: "https://cdn.apartmenttherapy.info/image/upload/f_jpg,q_auto:eco,c_fill,g_auto,w_1500,ar_4:3/k/Photo/Recipes/2024-09-tres-leches-cake/tres-leches-cake-3246-horizontal_74ed2a-crop",
      category: "Repostería Dulce"
    },
    {
      name: "Caja Repostería Dulce",
      price: 2500,
      description: "Selección variada de nuestros mejores postres del día, perfecta para compartir.",
      image: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.75761-15/476445130_18013476695690161_6028235328747529693_n.jpg?stp=dst-jpegr_tt6&_nc_cat=104&ccb=1-7&_nc_sid=13d280&_nc_ohc=YVl0de5pBZUQ7kNvwFoAXhB&_nc_oc=AdqKNdDA0IHeACp83bMQSXy9_YcEVr04xvgkQiv4tPyaMJEdwXdcH157BNxPmuJb7tDCUkSYaonESQHtA4Apecma&_nc_zt=23&se=-1&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=peEdKIhbmQuEH-HFZBX-Mw&_nc_ss=7a389&oh=00_Afwe_HhuP_WHdRwAknrLVQ4ZHNh61qRqs_7MxKIptngJ4w&oe=69CF6C9F",
      category: "Repostería Dulce"
    },
    {
      name: "Cajita Repostería Salada",
      price: 2000,
      description: "Surtido de bocadillos salados perfectos para acompañar tus bebidas favoritas.",
      image: "https://scontent.fsjo8-1.fna.fbcdn.net/v/t51.75761-15/476005974_18013476626690161_2046793246373793979_n.jpg?stp=c0.99.1200.1200a_dst-jpg_s206x206_tt6&_nc_cat=100&ccb=1-7&_nc_sid=a934a8&_nc_ohc=E6FAQTQwUmgQ7kNvwEjd92N&_nc_oc=AdoI2ktW-BB7ST6gb0M2AQSnmWYb32AVmlCiTMiufcnk-qXWBklCR3uys_5HzaRRjx6v5wR00ZOcv5Rk-roP4y4e&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=S7nEbOvsMzxh--dB9yfkkQ&_nc_ss=7a389&oh=00_AfzcbDCsTE3h9A1HHQi9GPSewkVyT_rJ3kl4Gx_8yhtOvg&oe=69CF66E7",
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
            className="fixed inset-4 md:inset-12 lg:inset-20 max-w-6xl mx-auto bg-gradient-to-br from-[#8B6F47] via-[#D4A574] to-[#F5EFE6] rounded-3xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#8B6F47]/95 backdrop-blur-sm border-b border-[#C19A6B]/30 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white">Menú Food Truck</h2>
                  <div className="flex items-center gap-4 mt-2 text-white/80">
                    <div className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4" />
                      <span>Gastronomía con alma</span>
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
            <div className="flex-1 overflow-y-auto">
              {/* Menu Items */}
              <section className="p-6 pb-6">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Nuestros productos</h3>
                  <p className="text-gray-300">
                    Deliciosas opciones preparadas con dedicación para complementar tu experiencia
                  </p>
                </div>

                {/* Categorized Menu */}
                <div className="space-y-8 mb-8">
                  {/* Bebidas Calientes */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Coffee className="w-5 h-5 text-[#C19A6B]" />
                      <h4 className="text-lg font-semibold text-white">Bebidas Calientes</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {menuItems.filter(item => item.category === "Bebidas Calientes").map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
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
                  </div>

                  {/* Comida */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Cookie className="w-5 h-5 text-[#C19A6B]" />
                      <h4 className="text-lg font-semibold text-white">Comida</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {menuItems.filter(item => item.category === "Comida").map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
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
                  </div>

                  {/* Repostería */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Cake className="w-5 h-5 text-[#C19A6B]" />
                      <h4 className="text-lg font-semibold text-white">Repostería</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      {menuItems.filter(item => item.category.includes("Repostería")).map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
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
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
