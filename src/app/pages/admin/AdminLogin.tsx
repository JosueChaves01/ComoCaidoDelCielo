import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, User, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner"; // They have 'sonner' installed

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const heroImage = "https://scontent.fsjo8-1.fna.fbcdn.net/v/t39.30808-6/474073411_988019740087191_996796627425577335_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=7b2446&_nc_ohc=jC4ynTK0_RQQ7kNvwH78VgQ&_nc_oc=Adp_5TUxoLvAJI3UUVBmMbkOlx5OvcONZG1j4_t4TnuMh6CouZpG_y3yUyaodeY7t-j_UUxlCPNGpZNGgMU1-S-z&_nc_zt=23&_nc_ht=scontent.fsjo8-1.fna&_nc_gid=A8STgCoqxKqKS5emqKySXA&_nc_ss=7a30f&oh=00_AfzyBRQPZ3lP8oaVjsevRRD5Yq0k-AAaJy8CqSNd0LDZ8g&oe=69CE23CC";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (username === "admin" && password === "cielo2026") {
        toast.success("¡Bienvenido al Panel de Administración!");
        localStorage.setItem("adminAuth", "true");
        navigate("/admin/dashboard");
      } else {
        toast.error("Credenciales incorrectas. Intenta de nuevo.");
      }
      setIsLoading(false);
    }, 1000);
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
        {/* Subtle background glow effect matching brand colors */}
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

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#C89F6A]/50 focus:border-[#C89F6A] transition-all backdrop-blur-sm"
                  placeholder="Usuario"
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
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full group relative flex items-center justify-center p-4 bg-gradient-to-r from-[#C89F6A] to-[#D5B285] text-black rounded-xl font-bold tracking-wider hover:opacity-90 overflow-hidden transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <span className={`relative z-10 flex items-center transition-transform ${isLoading ? '' : 'group-hover:-translate-x-2'}`}>
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
             <p className="text-white/30 text-sm">Protegido por seguridad interna.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
