import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Home, Sunset, Calendar, Utensils, ChefHat, Bed, Instagram, Facebook, LogIn, LogOut, Mail, ChevronLeft, Loader2, User2 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/useAuth";

type AuthView = "hidden" | "options" | "email" | "sent";

export function Navbar() {
  const { user, loading } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("hidden");
  const [authEmail, setAuthEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const authPanelRef = useRef<HTMLDivElement>(null);

  const SOCIAL_LINKS = {
    instagram: "https://www.instagram.com/comocaidodelcielo_sr/",
    facebook: "https://www.facebook.com/profile.php?id=100066375234150"
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close auth panel on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (authPanelRef.current && !authPanelRef.current.contains(e.target as Node)) {
        setAuthView("hidden");
      }
    };
    if (authView !== "hidden") {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [authView]);

  // Close panel when user logs in
  useEffect(() => {
    if (user) setAuthView("hidden");
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
    setAuthLoading(false);
  };

  const handleEmailSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: authEmail.trim(),
      options: { emailRedirectTo: window.location.href },
    });
    setAuthLoading(false);
    if (!error) setAuthView("sent");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
  };

  const displayName = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "";

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
                className="text-white/60 hover:text-[#C89F6A] transition-colors p-2"
              >
                <Facebook size={20} strokeWidth={1.5} />
              </a>

              {/* Auth button + dropdown */}
              <div className="relative" ref={authPanelRef}>
                {loading ? (
                  <Loader2 size={15} className="animate-spin text-white/40" />
                ) : user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[11px] uppercase tracking-[0.15em] font-medium"
                  >
                    <User2 size={15} />
                    <span className="max-w-[90px] truncate">{displayName}</span>
                    <LogOut size={13} className="opacity-60" />
                  </button>
                ) : (
                  <button
                    onClick={() => setAuthView(authView === "hidden" ? "options" : "hidden")}
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[11px] uppercase tracking-[0.15em] font-medium"
                  >
                    <LogIn size={15} />
                    Iniciar sesión
                  </button>
                )}

                {/* Dropdown panel */}
                <AnimatePresence>
                  {authView !== "hidden" && !user && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-[#E8DED0] overflow-hidden z-50"
                    >
                      <div className="p-4 space-y-3">
                        {authView === "sent" ? (
                          <p className="text-center text-sm text-[#3B2A22] py-3">
                            ✉️ Revisa tu correo — te enviamos un enlace para iniciar sesión.
                          </p>
                        ) : authView === "email" ? (
                          <>
                            <button
                              onClick={() => setAuthView("options")}
                              className="flex items-center gap-1 text-[11px] text-[#9B8677] hover:text-[#3B2A22] transition-colors"
                            >
                              <ChevronLeft size={13} /> Volver
                            </button>
                            <p className="text-xs text-[#9B8677]">
                              Te enviaremos un enlace de acceso a tu correo.
                            </p>
                            <form onSubmit={handleEmailSignIn} className="flex gap-2">
                              <input
                                type="email"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                required
                                autoFocus
                                className="flex-1 px-3 py-2 text-sm rounded-full bg-[#F5EFE6] border border-[#E8DED0] focus:outline-none focus:ring-2 focus:ring-[#3B2A22]/20 text-[#3B2A22]"
                              />
                              <button
                                type="submit"
                                disabled={authLoading}
                                className="px-4 py-2 rounded-full bg-[#3B2A22] text-white hover:bg-[#2A1F19] transition-all disabled:opacity-50 flex items-center"
                              >
                                {authLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                              </button>
                            </form>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-[#9B8677] text-center pb-1">
                              Inicia sesión para usar el asistente de reservas
                            </p>
                            <button
                              onClick={handleGoogleSignIn}
                              disabled={authLoading}
                              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full border border-[#E8DED0] bg-white hover:bg-[#F5EFE6] text-sm text-[#3B2A22] font-medium transition-all disabled:opacity-50"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                              </svg>
                              Continuar con Google
                            </button>
                            <button
                              onClick={() => setAuthView("email")}
                              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-full border border-[#E8DED0] bg-white hover:bg-[#F5EFE6] text-sm text-[#3B2A22] font-medium transition-all"
                            >
                              <Mail size={15} />
                              Continuar con correo
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
                className="pt-10 w-full flex flex-col items-center gap-4"
              >
                <button className="w-full max-w-[280px] px-10 py-4 bg-[#C89F6A] text-black font-bold tracking-widest uppercase rounded-full shadow-[0_15px_30px_rgba(200,159,106,0.2)]">
                  Reservar Ahora
                </button>

                {/* Mobile auth */}
                {loading ? null : user ? (
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm"
                  >
                    <LogOut size={15} />
                    Cerrar sesión ({displayName})
                  </button>
                ) : (
                  <div className="w-full max-w-[280px] space-y-2">
                    <button
                      onClick={handleGoogleSignIn}
                      disabled={authLoading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all disabled:opacity-50"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Iniciar sesión con Google
                    </button>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        // Small delay to let menu close, then show auth in desktop panel isn't relevant on mobile
                        // We handle email inline in mobile
                      }}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all"
                    >
                      <Mail size={15} />
                      Iniciar sesión con correo
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Mobile Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-8 pt-10"
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
