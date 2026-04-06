import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, X, Home, Sunset, Calendar, Utensils, ChefHat, Bed, Instagram, Facebook } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/useAuth";
import { MyReservationsModal } from "./MyReservationsModal";
import { NavbarAuthPanel } from "./navbar/NavbarAuthPanel";
import { NavbarMobileMenu } from "./navbar/NavbarMobileMenu";

export function Navbar() {
  const { user, loading } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMyReservations, setShowMyReservations] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const SOCIAL_LINKS = {
    instagram: "https://www.instagram.com/comocaidodelcielo_sr/",
    facebook: "https://www.facebook.com/profile.php?id=100066375234150"
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.href },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error("Google Sign In Error:", err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
  };

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
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C89F6A] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {/* Social Icons */}
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#C89F6A] transition-colors p-2">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#C89F6A] transition-colors p-2">
                <Facebook size={20} strokeWidth={1.5} />
              </a>

              {/* Auth Panel */}
              <NavbarAuthPanel onShowReservations={() => setShowMyReservations(true)} />

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
            {isMobileMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <NavbarMobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={menuItems}
        socialLinks={SOCIAL_LINKS}
        onShowReservations={() => setShowMyReservations(true)}
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
        authLoading={authLoading}
      />

      <MyReservationsModal 
        isOpen={showMyReservations} 
        onClose={() => setShowMyReservations(false)} 
      />
    </>
  );
}
