import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Menu, 
  Instagram, 
  Facebook, 
  LogOut, 
  BookOpen, 
  Mail, 
  Loader2 
} from "lucide-react";
import { useAuth } from "../../../lib/useAuth";
import { LucideIcon } from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavbarMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  socialLinks: { instagram: string; facebook: string };
  onShowReservations: () => void;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  authLoading: boolean;
  onOpenReservation?: () => void;
}

export function NavbarMobileMenu({
  isOpen,
  onClose,
  menuItems,
  socialLinks,
  onShowReservations,
  onGoogleSignIn,
  onSignOut,
  authLoading,
  onOpenReservation,
}: NavbarMobileMenuProps) {
  const { user, loading } = useAuth();
  const displayName = user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "";

  return (
    <AnimatePresence>
      {isOpen && (
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
                    onClick={onClose}
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
              <button 
                onClick={() => {
                  onClose();
                  onOpenReservation?.();
                }}
                className="w-full max-w-[280px] px-10 py-4 bg-[#C89F6A] text-black font-bold tracking-widest uppercase rounded-full shadow-[0_15px_30px_rgba(200,159,106,0.2)]"
              >
                Reservar Ahora
              </button>

              {/* Mobile auth */}
              {!loading && (
                user ? (
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={() => {
                        onClose();
                        onShowReservations();
                      }}
                      className="flex items-center gap-2 text-[#C89F6A] font-medium tracking-wide border border-[#C89F6A]/30 bg-[#C89F6A]/10 px-6 py-2.5 rounded-full hover:bg-[#C89F6A]/20 transition-all text-sm"
                    >
                      <BookOpen size={16} />
                      Mis Reservas
                    </button>
                    <button
                      onClick={onSignOut}
                      className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors text-sm"
                    >
                      <LogOut size={15} />
                      Cerrar sesión ({displayName})
                    </button>
                  </div>
                ) : (
                  <div className="w-full max-w-[280px] space-y-2">
                    <button
                      onClick={onGoogleSignIn}
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
                      onClick={onClose}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-all"
                    >
                      <Mail size={15} />
                      Iniciar sesión con correo
                    </button>
                  </div>
                )
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
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full text-white/60 hover:text-[#C89F6A] transition-all">
                <Instagram size={24} strokeWidth={1.5} />
              </a>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full text-white/60 hover:text-[#C89F6A] transition-all">
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
  );
}
