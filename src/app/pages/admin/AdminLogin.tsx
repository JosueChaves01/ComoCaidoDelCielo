import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Lock, Mail, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";
import { loginSchema } from "../../../lib/adminSchemas";

const BRUTE_FORCE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-brute-force`;

// Ícono de Google SVG (sin dependencia externa)
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const heroImage = "/assets/Hero/Atardecer.png";

  // Mostrar mensaje si fue redirigido por falta de permisos
  useEffect(() => {
    const state = location.state as { reason?: string } | null;
    if (state?.reason === "unauthorized") {
      toast.error("No tienes permisos de administrador.");
      // Limpiar el state para que no aparezca al recargar
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/dashboard`,
      },
    });
    if (error) {
      toast.error("Error al iniciar sesión con Google.");
      setIsGoogleLoading(false);
    }
    // Si no hay error, el navegador redirige a Google — no hace falta setIsGoogleLoading(false)
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Validar inputs con Zod
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      // 2. Verificar brute force ANTES de intentar login
      const bruteRes = await fetch(BRUTE_FORCE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ action: "check" }),
      });

      if (bruteRes.ok) {
        const bruteData = await bruteRes.json();
        if (bruteData.blocked) {
          toast.error(bruteData.message);
          setIsLoading(false);
          return;
        }
      }

      // 3. Intentar autenticación con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (error || !data.user) {
        // Registrar el intento fallido
        await fetch(BRUTE_FORCE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ action: "record_failure" }),
        }).catch(() => { /* No bloquear el flujo si falla el registro */ });

        toast.error("Credenciales incorrectas. Intenta de nuevo.");
        setIsLoading(false);
        return;
      }

      // 4. Verificar que el usuario tiene rol de administrador
      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (!adminRow) {
        // Autenticado en Supabase pero NO es admin: cerrar sesión
        await supabase.auth.signOut();
        await fetch(BRUTE_FORCE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ action: "record_failure" }),
        }).catch(() => {});

        toast.error("No tienes permisos de administrador.");
        setIsLoading(false);
        return;
      }

      // 5. Login exitoso: registrar y redirigir
      await fetch(BRUTE_FORCE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ action: "record_success" }),
      }).catch(() => {});

      toast.success("¡Bienvenido al Panel de Administración!");
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast.error("Error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#090B10] text-[#EFEAE2] font-sans">
      {/* Botón para volver al inicio */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-[#C89F6A] hover:text-white transition-colors uppercase tracking-widest text-sm font-semibold group bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver
      </button>

      {/* Left Column: Image Background */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
        <img
          src={heroImage}
          alt="Atardecer Como Caído del Cielo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 flex flex-col justify-end p-12 lg:p-24 h-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-5xl lg:leading-tight mb-4 font-normal text-white drop-shadow-lg">
              El panel de control detrás de
              <br />
              <span className="text-[#C89F6A] font-semibold italic block mt-2">la magia.</span>
            </h1>
            <p className="text-white/80 max-w-lg text-lg font-light leading-relaxed">
              Administra los eventos, actualiza la cartelera y asegúrate de que cada noche sea inolvidable para nuestros invitados.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#C89F6A]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none"></div>

        <motion.div
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold mb-2 text-white">Inicio de Sesión</h2>
            <p className="text-[#C89F6A] tracking-wider uppercase text-sm font-medium">Área Administrativa</p>
          </div>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {isGoogleLoading ? "Redirigiendo..." : "Continuar con Google"}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs uppercase tracking-widest">o</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#C89F6A]/50 focus:border-[#C89F6A] transition-all backdrop-blur-sm"
                  placeholder="Correo electrónico"
                  autoComplete="email"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#C89F6A]/50 focus:border-[#C89F6A] transition-all backdrop-blur-sm"
                  placeholder="Contraseña"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full group relative flex items-center justify-center p-4 bg-gradient-to-r from-[#C89F6A] to-[#D5B285] text-black rounded-xl font-bold tracking-wider hover:opacity-90 overflow-hidden transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <span className={`relative z-10 flex items-center transition-transform ${isLoading ? "" : "group-hover:-translate-x-2"}`}>
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  "INGRESAR"
                )}
              </span>
              {!isLoading && (
                <ArrowRight className="absolute right-4 w-5 h-5 text-black opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all z-10" />
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/30 text-sm">Acceso restringido. Protegido por Supabase Auth.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
