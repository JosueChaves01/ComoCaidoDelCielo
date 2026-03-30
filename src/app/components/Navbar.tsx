import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronRight, Home, Sunset, Calendar, Utensils, ChefHat, Bed } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    { label: "Inicio", href: "#", icon: Home },
    { label: "Terrazas", href: "#terrazas", icon: Sunset },
    { label: "Eventos", href: "#eventos", icon: Calendar },
    { label: "Salon", href: "#salon", icon: ChefHat },
    { label: "Food Truck", href: "#foodtruck", icon: Utensils },
    { label: "Hospedaje", href: "#hospedaje", icon: Bed },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-black/60 backdrop-blur-xl border-b border-white/10 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo/Brand */}
          <a
            href="#"
            className="text-xl md:text-2xl font-serif tracking-tight transition-all duration-500 text-white"
          >
            Como Caído <span className="text-[#C89F6A]">del Cielo</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm uppercase tracking-[0.2em] font-medium text-white/70 hover:text-[#C89F6A] transition-all duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C89F6A] transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <button
              className="px-8 py-2.5 rounded-full bg-[#C89F6A] text-black text-sm font-bold tracking-widest uppercase hover:scale-105 hover:bg-[#D4A574] transition-all shadow-[0_0_20px_rgba(200,159,106,0.2)]"
            >
              Reservar
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative z-50 p-2 text-white hover:text-[#C89F6A] transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X size={28} strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu size={28} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl md:hidden"
          >
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C89F6A]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7A553A]/20 rounded-full blur-[120px]" />

            <div className="relative w-full px-10 flex flex-col items-center text-center space-y-8">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center justify-center gap-4 text-3xl font-serif text-white hover:text-[#C89F6A] transition-colors"
                  >
                    <div className="bg-white/5 p-3 rounded-xl group-hover:bg-[#C89F6A]/20 transition-all border border-white/5 group-hover:border-[#C89F6A]/30">
                      <Icon className="w-6 h-6 text-[#C89F6A]" strokeWidth={1.5} />
                    </div>
                    {item.label}
                    <ChevronRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#C89F6A]" />
                  </motion.a>
                );
              })}

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="pt-10 w-full"
              >
                <button className="w-full max-w-[280px] px-10 py-5 bg-[#C89F6A] text-black font-bold tracking-widest uppercase rounded-full shadow-[0_15px_30px_rgba(200,159,106,0.2)]">
                  Reservar Ahora
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-12 text-white/30 text-xs tracking-widest uppercase"
              >
                Como Caído del Cielo — Costa Rica
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
