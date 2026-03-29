import { motion } from "motion/react";
import { MenuItem } from "./MenuItem";

interface MenuCategoryProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  items: Array<{
    name: string;
    price: number;
    description: string;
    image: string;
  }>;
}

export function MenuCategory({ title, description, icon, items }: MenuCategoryProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-16"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-[#8B6F47] text-white rounded-full mb-4"
        >
          {icon}
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#2A2419] mb-3">{title}</h2>
        <p className="text-[#6B5D4F] max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <MenuItem
              name={item.name}
              price={item.price}
              description={item.description}
              image={item.image}
              category={title}
            />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
