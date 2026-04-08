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
      whileHover={{ y: -5 }}
      className={`bg-gradient-to-br from-[#F5F2E8] to-[#F0E8E0] rounded-2xl shadow-lg overflow-hidden transition-all duration-300 group ${
        !isAvailable ? 'grayscale opacity-80' : 'hover:shadow-2xl hover:scale-105'
      }`}
    >
      <div className="relative aspect-[4/3] sm:aspect-[3/2] overflow-hidden">
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-sm">
            <motion.div 
              className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-4 md:px-6 py-2 md:py-3 rounded-full transform -rotate-12 shadow-2xl border-2 border-white/40 uppercase tracking-widest text-sm md:text-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              AGOTADO
            </motion.div>
          </div>
        )}

        {!imageError ? (
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isAvailable 
                ? 'group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105' 
                : 'filter brightness-75'
            }`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#F0E8E0] to-[#E8DCC4] flex items-center justify-center">
            <span className="text-4xl md:text-6xl opacity-50">🍰</span>
          </div>
        )}
        
        {/* Price Badge */}
        <motion.div 
          className={`absolute top-2 md:top-3 right-2 md:right-3 px-2 md:px-4 py-1 md:py-2 rounded-full z-10 backdrop-blur-sm ${
            isAvailable 
              ? 'bg-gradient-to-r from-[#C89F6A] to-[#D4A574] text-white shadow-lg' 
              : 'bg-gray-400/80 text-white/80'
          }`}
          whileHover={{ scale: 1.1 }}
        >
          <span className="font-bold text-xs md:text-sm">₡{price}</span>
        </motion.div>
      </div>
      
      <div className="p-3 md:p-5 bg-gradient-to-b from-white/50 to-transparent">
        <h3 className={`text-base md:text-xl font-bold mb-1 md:mb-2 transition-colors duration-300 ${
          !isAvailable ? 'text-gray-500' : 'text-[#3B2A22] group-hover:text-[#C89F6A]'
        }`}>
          {name}
        </h3>
        <p className={`text-xs md:text-sm leading-relaxed mb-2 md:mb-3 transition-colors duration-300 ${
          !isAvailable ? 'text-gray-400' : 'text-[#6B5D4F] group-hover:text-[#8B6F47]'
        }`}>
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className={`inline-block px-2 md:px-3 py-1 text-xs rounded-full font-medium transition-all duration-300 ${
            !isAvailable 
              ? 'bg-gray-200 text-gray-400' 
              : 'bg-gradient-to-r from-[#F0E8E0] to-[#E8DCC4] text-[#8B6F47] border border-[#C89F6A]/20 group-hover:border-[#C89F6A]/40'
          }`}>
            <span className="hidden sm:inline">{category}</span>
            <span className="sm:hidden">
              {category === 'fogata' ? 'Fogata' :
               category === 'reposteria' ? 'Repostería' :
               category === 'refrescos' ? 'Refrescos' :
               category === 'calientes' ? 'Calientes' :
               category === 'alcoholicas' ? 'Alcohólicas' :
               category}
            </span>
          </span>
          {isAvailable && (
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
