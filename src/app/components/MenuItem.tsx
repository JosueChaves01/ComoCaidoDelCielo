import { motion } from "motion/react";
import { useState } from "react";

interface MenuItemProps {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  isAvailable?: boolean;
}

export function MenuItem({ name, price, description, image, category, isAvailable = true }: MenuItemProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-[#F5F2E8] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group ${!isAvailable ? 'grayscale opacity-80' : 'hover:shadow-xl'}`}
    >
      <div className="relative aspect-square overflow-hidden max-h-72">
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-red-500 text-white font-bold px-6 py-2 rounded-full transform -rotate-12 shadow-xl border-2 border-white/30 uppercase tracking-widest text-lg">
              Agotado
            </div>
          </div>
        )}

        {!imageError ? (
          <img
            src={image}
            alt={name}
            className={`w-full h-72 object-cover rounded-t-lg transition-all duration-300 ${isAvailable ? 'group-hover:scale-105 group-hover:brightness-110 group-hover:contrast-105' : ''}`}
            onError={() => setImageError(true)}
            style={{
              transform: isAvailable ? 'scale(1.05)' : 'none',
              transition: 'transform 0.3s ease-in-out',
              filter: isAvailable ? 'brightness(1.1) contrast(1.2)' : 'brightness(0.8)',
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F0E8E0] to-[#E8DCC4] flex items-center justify-center">
            <span className="text-6xl">🍰</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full z-10">
          <span className="text-[#8B6F47] font-bold">₡{price}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`text-xl font-bold mb-2 ${!isAvailable ? 'text-gray-500' : 'text-[#2A2419]'}`}>{name}</h3>
        <p className={`text-sm leading-relaxed ${!isAvailable ? 'text-gray-400' : 'text-[#6B5D4F]'}`}>{description}</p>
        <div className="mt-2">
          <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${!isAvailable ? 'bg-gray-200 text-gray-400' : 'bg-[#F0E8E0] text-[#8B6F47]'}`}>
            {category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
