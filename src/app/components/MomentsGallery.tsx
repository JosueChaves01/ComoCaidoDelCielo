import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

interface MomentsGalleryProps {
  images: string[];
}

export function MomentsGallery({ images }: MomentsGalleryProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-24 px-6 md:px-12 bg-[#3B2A22]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl text-white mb-6">
            Momentos que inspiran
          </h2>
          <p className="text-lg md:text-xl text-[#D6BFA6] max-w-3xl mx-auto">
            Más que un lugar, somos recuerdos en construcción.
            Estas son algunas de las historias que se han vivido aquí.
          </p>
        </motion.div>

        {/* Masonry-style Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-3xl overflow-hidden group ${index % 5 === 0 ? "row-span-2 col-span-2" : ""
                } ${index % 7 === 0 ? "col-span-2" : ""}`}
              style={{ height: index % 5 === 0 ? "400px" : "200px" }}
            >
              <img
                src={image}
                alt={`Momento ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center bg-[#D6BFA6] p-12 rounded-3xl shadow-lg"
        >
          <p className="text-2xl md:text-3xl text-[#3B2A22] italic mb-6">
            "Un lugar donde cada visita se convierte en una historia que quieres volver a vivir"
          </p>
          <p className="text-[#7A553A]">— Nuestros visitantes</p>
        </motion.div>
      </div>
    </section>
  );
}
