import { motion } from "motion/react";
import { Coffee, Cake, Cookie, ArrowLeft } from "lucide-react";
import { MenuCategory } from "../components/MenuCategory";

export default function MenuPage() {
  const bebidasCalientes = [
    {
      name: "Chocolate Caliente con Marshmallows",
      price: 1500,
      description: "Chocolate espeso y cremoso coronado con marshmallows frescos, perfecto para las tardes frescas.",
      image: "https://images.unsplash.com/photo-1542990646-d34eb1520c56?w=400&h=300&fit=crop"
    },
    {
      name: "Chocolate Bautizado",
      price: 2000,
      description: "Nuestra especialidad secreta con un toque especial que lo hace único y memorable.",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop"
    },
    {
      name: "Chocolate Full",
      price: 2500,
      description: "La experiencia completa de chocolate con todos nuestros acompañamientos especiales.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
    },
    {
      name: "Café Especial",
      price: 1200,
      description: "Café recién molido seleccionado de las mejores fincas, preparado al momento.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
    },
    {
      name: "Refrescos Naturales",
      price: 800,
      description: "Bebidas refrescantes preparadas con frutas naturales de la región.",
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop"
    }
  ];

  const reposteriaDulce = [
    {
      name: "Donas Frescas",
      price: 750,
      description: "Donas esponjosas cubiertas con glaseado casero y toppings variados.",
      image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop"
    },
    {
      name: "Tres Leches",
      price: 2000,
      description: "El clásico postre latinoamericano con nuestra receta especial de三代 leche.",
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop"
    },
    {
      name: "Caja Repostería",
      price: 2500,
      description: "Selección variada de nuestros mejores postres del día, perfecta para compartir.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop"
    }
  ];

  const reposteriaSalada = [
    {
      name: "Cajita Repostería Salada",
      price: 2000,
      description: "Surtido de bocadillos salados perfectos para acompañar tus bebidas favoritas.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F6F2] via-[#F0E8E0] to-[#E8DCC4]">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => window.close()}
            className="flex items-center gap-2 text-[#8B6F47] hover:text-[#6B5337] transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al inicio</span>
          </button>
          
          <h1 className="text-2xl font-bold text-[#2A2419]">Menú Food Truck</h1>
          
          <div className="w-24"></div> {/* Spacer for center alignment */}
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-[#2A2419] mb-6">
            Deliciosos
            <span className="block text-[#8B6F47]">Momentos</span>
          </h1>
          <p className="text-xl text-[#6B5D4F] max-w-2xl mx-auto leading-relaxed">
            Descubre nuestra selección de bebidas calientes, postres caseros y delicias 
            preparadas con amor para hacer tu visita inolvidable.
          </p>
        </motion.div>
      </motion.section>

      {/* Menu Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <MenuCategory
          title="Bebidas Calientes"
          description="Calienta tu corazón con nuestras bebidas especiales, preparadas con los mejores ingredientes y mucho amor."
          icon={<Coffee size={24} />}
          items={bebidasCalientes}
        />

        <MenuCategory
          title="Repostería Dulce"
          description="Postres caseros que te transportarán a la infancia, cada bocado es una experiencia única."
          icon={<Cake size={24} />}
          items={reposteriaDulce}
        />

        <MenuCategory
          title="Opciones Saladas"
          description="Perfectas complementos para equilibrar tu experiencia gastronómica."
          icon={<Cookie size={24} />}
          items={reposteriaSalada}
        />
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-[#2A2419] text-white py-12 px-6 text-center"
      >
        <h3 className="text-2xl font-bold mb-4">¿Te antojaste?</h3>
        <p className="text-white/80 mb-6">
          Visítanos en nuestro food truck y disfruta de estas delicias en un ambiente único.
        </p>
        <button
          onClick={() => window.close()}
          className="inline-block px-8 py-3 bg-[#8B6F47] text-white rounded-full hover:bg-[#6B5337] transition-colors"
        >
          Volver al inicio
        </button>
      </motion.footer>
    </div>
  );
}
