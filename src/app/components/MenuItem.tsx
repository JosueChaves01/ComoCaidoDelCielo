import { motion } from "motion/react";
import { useState } from "react";

interface MenuItemProps {
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export function MenuItem({ name, price, description, image, category }: MenuItemProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative aspect-square overflow-hidden max-h-52">
        {!imageError ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F0E8E0] to-[#E8DCC4] flex items-center justify-center">
            <span className="text-6xl">🍰</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-[#8B6F47] font-bold">₡{price}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-[#2A2419] mb-2">{name}</h3>
        <p className="text-[#6B5D4F] text-sm leading-relaxed">{description}</p>
        <div className="mt-2">
          <span className="inline-block px-3 py-1 bg-[#F0E8E0] text-[#8B6F47] text-xs rounded-full font-medium">
            {category}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
