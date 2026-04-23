import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LogIn, 
  LogOut, 
  Mail, 
  ChevronLeft, 
  Loader2, 
  User2, 
  ChevronDown, 
  BookOpen,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../lib/useAuth";
import { WhatsAppVerificationModal } from "../WhatsAppVerificationModal";

type AuthView = "hidden" | "options" | "email" | "sent";

interface NavbarAuthPanelProps {
  onShowReservations: () => void;
  forceShowAuth?: AuthView;
}

export function NavbarAuthPanel({ onShowReservations, forceShowAuth }: NavbarAuthPanelProps) {
  const { user, profile, loading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>("hidden");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const authPanelRef = useRef<HTMLDivElement>(null);

  // Allow parent to trigger auth panel visibility
  useEffect(() => {
    if (forceShowAuth && forceShowAuth !== "hidden") {
      setAuthView(forceShowAuth);
    }
  }, [forceShowAuth]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (authPanelRef.current && !authPanelRef.current.contains(e.target as Node)) {
        setAuthView("hidden");
        setIsUserMenuOpen(false);
      }
    };
    if (authView !== "hidden" || isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [authView, isUserMenuOpen]);

  useEffect(() => {
    if (user) {
      setAuthView("hidden");
      setIsUserMenuOpen(false);
    }
  }, [user]);

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

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: authEmail.trim(),
        options: { emailRedirectTo: window.location.href },
      });
      if (error) throw error;
      setAuthView("sent");
    } catch (err: any) {
      console.error("Email Sign In Error:", err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
  };

  const displayName = profile?.full_name ?? user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "";

  return (
    <div className="relative" ref={authPanelRef}>
      {loading ? (
        <Loader2 size={15} className="animate-spin text-white/40" />
      ) : user ? (
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-[11px] uppercase tracking-[0.15em] font-medium"
        >
          {profile?.is_verified ? (
            <ShieldCheck size={14} className="text-emerald-400" />
          ) : (
            <User2 size={15} />
          )}
          <span className="max-w-[90px] truncate">{displayName}</span>
          <ChevronDown size={13} className={`opacity-60 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
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
        {isUserMenuOpen && user && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-[#E8DED0] overflow-hidden z-50 text-black"
          >
            <div className="p-2 space-y-1">
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onShowReservations();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#F5EFE6] text-[#3B2A22] text-sm transition-colors text-left"
              >
                <BookOpen size={16} className="text-[#9B8677]" />
                <span className="font-medium">Mis Reservas</span>
              </button>

              {!profile?.is_verified && (
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    setIsVerifyModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-sm transition-colors text-left"
                >
                  <ShieldAlert size={16} className="text-orange-500" />
                  <span className="font-bold underline decoration-orange-300">Verificar Perfil</span>
                </button>
              )}

              <div className="h-[1px] bg-[#E8DED0] my-1 mx-2" />
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-sm transition-colors text-left"
              >
                <LogOut size={16} className="opacity-70" />
                <span className="font-medium">Cerrar sesión</span>
              </button>
            </div>
          </motion.div>
        )}

        {authView !== "hidden" && !user && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-[#E8DED0] overflow-hidden z-50 text-black"
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

      <WhatsAppVerificationModal 
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </div>
  );
}
