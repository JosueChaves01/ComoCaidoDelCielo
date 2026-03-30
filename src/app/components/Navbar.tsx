import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, ChevronRight, Home, Sunset, Calendar, Utensils, ChefHat, Bed, Instagram, Facebook } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const SOCIAL_LINKS = {
    instagram: "https://www.instagram.com/comocaidodelcielo_sr/",
    facebook: "https://www.facebook.com/profile.php?id=100066375234150"
  };

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
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6 mr-4 border-r border-white/10 pr-8">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-[11px] uppercase tracking-[0.2em] font-medium text-white/70 hover:text-[#C89F6A] transition-all duration-300 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C89F6A] transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Social Icons Desktop */}
            <div className="flex items-center gap-4">
              <a 
                href={SOCIAL_LINKS.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#C89F6A] transition-colors p-2"
              >
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a 
                href={SOCIAL_LINKS.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#C89F6A] transition-colors p-2 mr-2"
              >
                <Facebook size={20} strokeWidth={1.5} />
              </a>
              <button
                className="px-8 py-2.5 rounded-full bg-[#C89F6A] text-black text-sm font-bold tracking-widest uppercase hover:scale-105 hover:bg-[#D4A574] transition-all shadow-[0_0_20px_rgba(200,159,106,0.2)]"
              >
                Reservar
              </button>
            </div>
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

            <div className="relative w-full px-10 flex flex-col items-center text-center">
              <div className="space-y-6 w-full">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="group flex items-center justify-center gap-4 text-2xl font-serif text-white hover:text-[#C89F6A] transition-colors"
                    >
                      <div className="bg-white/5 p-2.5 rounded-xl group-hover:bg-[#C89F6A]/20 transition-all border border-white/5 group-hover:border-[#C89F6A]/30">
                        <Icon className="w-5 h-5 text-[#C89F6A]" strokeWidth={1.5} />
                      </div>
                      {item.label}
                    </motion.a>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="pt-10 w-full"
              >
                <button className="w-full max-w-[280px] px-10 py-4 bg-[#C89F6A] text-black font-bold tracking-widest uppercase rounded-full shadow-[0_15px_30px_rgba(200,159,106,0.2)]">
                  Reservar Ahora
                </button>
              </motion.div>

              {/* Mobile Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-8 pt-12"
              >
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full text-white/60 hover:text-[#C89F6A] transition-all">
                  <Instagram size={24} strokeWidth={1.5} />
                </a>
                <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full text-white/60 hover:text-[#C89F6A] transition-all">
                  <Facebook size={24} strokeWidth={1.5} />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-10 text-white/20 text-[10px] tracking-widest uppercase"
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
