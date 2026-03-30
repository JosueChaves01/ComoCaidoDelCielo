import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Inicio", href: "#" },
    { label: "Terrazas", href: "#terrazas" },
    { label: "Eventos", href: "#eventos" },
    { label: "Salon", href: "#salon" },
    { label: "Food Truck", href: "#foodtruck" },
    { label: "Hospedaje", href: "#hospedaje" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <a
          href="#"
          className={`text-2xl transition-colors ${
            isScrolled ? "text-[#8B6F47]" : "text-white"
          }`}
        >
          Como Caído del Cielo
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`transition-colors hover:opacity-70 ${
                isScrolled ? "text-[#2A2419]" : "text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
          <button
            className={`px-6 py-2 rounded-full transition-all ${
              isScrolled
                ? "bg-[#7A553A] text-white hover:bg-[#3B2A22]"
                : "bg-white/20 backdrop-blur-sm text-white border border-white/40 hover:bg-white/30"
            }`}
          >
            Reservar
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden ${isScrolled ? "text-[#2A2419]" : "text-white"}`}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-[#E8DED0]"
          >
            <div className="px-6 py-4 space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-[#2A2419] hover:text-[#8B6F47] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <button className="w-full px-6 py-3 bg-[#7A553A] text-white rounded-full hover:bg-[#3B2A22] transition-all">
                Reservar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
