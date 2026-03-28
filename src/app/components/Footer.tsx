import { motion } from "motion/react";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#FBF8F3] border-t border-[#E8DED0] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-3xl text-[#8B6F47] mb-4">Como Caído del Cielo</h3>
            <p className="text-[#6B5D4F] mb-4">
              Donde cada momento se convierte en un recuerdo que quieres volver a vivir.
            </p>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-[#8B6F47] text-white p-2 rounded-full hover:bg-[#6B5337] transition"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="bg-[#8B6F47] text-white p-2 rounded-full hover:bg-[#6B5337] transition"
              >
                <Facebook size={20} />
              </motion.a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl text-[#2A2419] mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#6B5D4F]">
                <Phone size={18} />
                <span>+52 123 456 7890</span>
              </div>
              <div className="flex items-center gap-3 text-[#6B5D4F]">
                <Mail size={18} />
                <span>hola@comocaidodelcielo.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl text-[#2A2419] mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#terrazas" className="text-[#6B5D4F] hover:text-[#8B6F47] transition">
                  Terrazas
                </a>
              </li>
              <li>
                <a href="#foodtruck" className="text-[#6B5D4F] hover:text-[#8B6F47] transition">
                  Food Truck
                </a>
              </li>
              <li>
                <a href="#eventos" className="text-[#6B5D4F] hover:text-[#8B6F47] transition">
                  Eventos
                </a>
              </li>
              <li>
                <a href="#hospedaje" className="text-[#6B5D4F] hover:text-[#8B6F47] transition">
                  Hospedaje
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#E8DED0] text-center text-[#6B5D4F]">
          <p>&copy; 2026 Como Caído del Cielo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
