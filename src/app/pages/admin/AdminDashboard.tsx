import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LogOut, Calendar, Images, UploadCloud, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "carousel">("upcoming");
  
  // Auth Check
  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const generateStars = (count: number, withTwinkle = false, withColor = false) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.5 + 0.3,
      delay: withTwinkle ? `${Math.random() * 5}s` : "0s",
      duration: withTwinkle ? `${Math.random() * 4 + 2}s` : "0s",
      isSparkle: Math.random() > 0.65, 
      isGold: withColor && Math.random() > 0.7 
    }));
  };

  const stars1 = useMemo(() => generateStars(120, false, false), []);
  const stars2 = useMemo(() => generateStars(40, true, false), []);
  const stars3 = useMemo(() => generateStars(15, true, true), []);

  return (
    <div className="min-h-screen bg-[#090B10] flex text-[#EFEAE2] font-sans relative overflow-hidden">
      
      {/* Starry Background Layers */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute inset-0">
          {stars1.map(star => (
            <div key={star.id} className="absolute rounded-full bg-white opacity-20" style={{ top: star.top, left: star.left, width: star.size, height: star.size }} />
          ))}
        </div>
        
        <div className="absolute inset-0">
          {stars2.map(star => (
            <div 
              key={star.id} 
              className="absolute rounded-full bg-indigo-100 shadow-[0_0_8px_1px_rgba(255,255,255,0.4)] animate-pulse" 
              style={{ top: star.top, left: star.left, width: `${parseFloat(star.size) * 1.2}px`, height: `${parseFloat(star.size) * 1.2}px`, opacity: star.opacity, animationDelay: star.delay, animationDuration: star.duration }} 
            />
          ))}
        </div>
        
        <div className="absolute inset-0">
          {stars3.map(star => (
            star.isSparkle ? (
              <div 
                key={star.id} 
                className="absolute animate-pulse mix-blend-screen leading-none" 
                style={{ 
                  top: star.top, 
                  left: star.left, 
                  fontSize: `${parseFloat(star.size) * 4 + 4}px`, 
                  opacity: Math.min(star.opacity * 1.5, 1),
                  animationDelay: star.delay, 
                  animationDuration: star.duration,
                  color: star.isGold ? '#fff4e6' : '#ffffff',
                  textShadow: star.isGold ? '0 0 10px rgba(200,159,106,0.8)' : '0 0 10px rgba(255,255,255,0.8)'
                }}
              >
                ✦
              </div>
            ) : null
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#090B10]/80 backdrop-blur-md p-6 flex flex-col justify-between hidden md:flex relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-[#C89F6A] mb-12 uppercase">
            Cielo Admin
          </h2>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all ${
                activeTab === "upcoming" 
                  ? "bg-[#C89F6A]/20 text-[#C89F6A] font-medium" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Calendar className="w-5 h-5" />
              Próximos Eventos
            </button>
            <button
              onClick={() => setActiveTab("carousel")}
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-left transition-all ${
                activeTab === "carousel" 
                  ? "bg-[#C89F6A]/20 text-[#C89F6A] font-medium" 
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Images className="w-5 h-5" />
              Carrusel Eventos
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-lg text-left text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
           <h2 className="text-lg font-bold tracking-widest text-[#C89F6A] uppercase">Cielo Admin</h2>
           <button onClick={handleLogout} className="text-white/50 hover:text-red-400">
             <LogOut className="w-5 h-5" />
           </button>
        </div>
        
        {/* Mobile Tabs */}
        <div className="md:hidden flex space-x-2 mb-8 bg-black/40 p-1 rounded-xl">
           <button 
             onClick={() => setActiveTab('upcoming')}
             className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 rounded-lg transition-all ${activeTab === 'upcoming' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}
           >
             <Calendar className="w-4 h-4" /> Próximos
           </button>
           <button 
             onClick={() => setActiveTab('carousel')}
             className={`flex-1 py-3 text-sm flex items-center justify-center gap-2 rounded-lg transition-all ${activeTab === 'carousel' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}
           >
             <Images className="w-4 h-4" /> Carrusel
           </button>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "upcoming" ? <UpcomingEventsPanel /> : <CarouselEventsPanel />}
        </motion.div>
      </main>
    </div>
  );
}

// ----------------------------------------------------
// HELPER: Upload Image to Supabase
// ----------------------------------------------------
const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage.from('events').upload(filePath, file);
  if (error) {
    throw new Error(`Error subiendo imagen: ${error.message}`);
  }

  const { data } = supabase.storage.from('events').getPublicUrl(filePath);
  return data.publicUrl;
};

// ----------------------------------------------------
// CHILD COMPONENTS FOR FORMS
// ----------------------------------------------------

function UpcomingEventsPanel() {
  const [title, setTitle] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterFile) return toast.error("Agrega un póster");
    
    setIsLoading(true);
    let loadingToast = toast.loading("Subiendo la imagen y publicando...");

    try {
      const posterUrl = await uploadImage(posterFile);
      
      const { error } = await supabase
        .from('upcoming_events')
        .insert([{ title, poster_url: posterUrl }]);
        
      if (error) throw error;

      toast.success("¡Próximo evento publicado con éxito!", { id: loadingToast });
      setTitle("");
      setPosterFile(null);
    } catch (err: any) {
      toast.error(err.message || "Error al subir evento", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
          Agregar <span className="text-[#C89F6A] font-semibold">Próximo Evento</span>
        </h1>
        <p className="text-white/50 mt-2">
          Sube el afiche/póster del evento próximo. Este se mostrará en las cartas inferiores del Home.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/5 p-6 md:p-8 rounded-2xl backdrop-blur-sm">
        
        <div className="space-y-4">
          <label className="block text-sm font-medium tracking-wide text-white/80">Título del Evento</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Noche de Jazz" 
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] transition-colors"
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium tracking-wide text-white/80">Póster Promocional</label>
          <div className="relative group cursor-pointer border-2 border-dashed border-white/10 hover:border-[#C89F6A]/50 bg-black/30 rounded-2xl p-10 flex flex-col items-center justify-center transition-all overflow-hidden h-64 text-center">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPosterFile(e.target.files[0]);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              required
            />
            {posterFile ? (
              <div className="absolute inset-0 w-full h-full">
                <img src={URL.createObjectURL(posterFile)} alt="Preview" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50">
                   <CheckCircle2 className="w-10 h-10 text-green-400 mb-2" />
                   <p className="text-white font-medium">{posterFile.name}</p>
                   <p className="text-white/60 text-sm mt-1">Haz clic para reemplazar</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/50 group-hover:text-[#C89F6A]/70 transition-colors">
                <div className="p-4 bg-white/5 rounded-full">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-semibold text-white/70">Arrastra tu póster o haz clic</p>
                  <p className="text-sm mt-1">PNG, JPG, WEBP (Recomendado 1080x1350)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`bg-[#C89F6A] hover:bg-[#D5B285] text-black font-semibold rounded-xl px-8 py-4 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(200,159,106,0.3)] w-full md:w-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Publicando...' : 'Publicar Próximo Evento'}
          </button>
        </div>
      </form>
    </div>
  );
}

function CarouselEventsPanel() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setGalleryFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!posterFile) return toast.error("Es necesario subir una portada (póster)");
    if (galleryFiles.length === 0) return toast.error("Agrega al menos una foto para el collage");
    
    setIsLoading(true);
    let loadingToast = toast.loading("Subiendo imágenes y publicando al carrusel... (esto puede tardar)");

    try {
      const posterUrl = await uploadImage(posterFile);
      const galleryUrls = await Promise.all(galleryFiles.map(file => uploadImage(file)));
      
      const { error } = await supabase.from('carousel_events').insert([{ 
        title, 
        description, 
        poster_url: posterUrl, 
        gallery_urls: galleryUrls 
      }]);
      
      if (error) throw error;

      toast.success("Evento de Carrusel publicado exitosamente!", { id: loadingToast });
      setTitle("");
      setDescription("");
      setPosterFile(null);
      setGalleryFiles([]);
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error inesperado", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
          Agregar al <span className="text-[#C89F6A] font-semibold">Carrusel Histórico</span>
        </h1>
        <p className="text-white/50 mt-2">
          Crea una nueva "tarjeta" en el carrusel con su descripción y una galería de fotos masonary de cómo se vivió la noche.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 border border-white/5 p-6 md:p-8 rounded-2xl backdrop-blur-sm">
        
        {/* Info Text */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium tracking-wide text-white/80">Nombre del Evento</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Sunset Party 2.0" 
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] transition-colors"
              required
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium tracking-wide text-white/80">Descripción Corta</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Una breve reseña de la noche..." 
              rows={2}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] transition-colors resize-none"
              required
            />
          </div>
        </div>

        <hr className="border-white/5" />

        {/* Poster Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium tracking-wide text-white/80">
            Imagen Principal (Póster/Portada de la Tarjeta)
          </label>
          <div className="relative group cursor-pointer border-2 border-dashed border-white/10 hover:border-[#C89F6A]/50 bg-black/30 rounded-2xl p-6 h-48 flex items-center justify-center transition-all overflow-hidden text-center">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setPosterFile(e.target.files[0]);
                }
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              required
            />
            {posterFile ? (
               <div className="absolute inset-0 flex items-center bg-black/50 p-4 pl-10">
                  <img src={URL.createObjectURL(posterFile)} alt="Preview" className="h-full w-24 object-cover rounded-md mr-6 shadow-xl" />
                  <div className="text-left">
                     <p className="text-white font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" /> 
                        {posterFile.name}
                     </p>
                     <p className="text-white/50 text-xs mt-1">Haz clic en cualquier área para reemplazar</p>
                  </div>
               </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-white/50 group-hover:text-[#C89F6A]/70">
                <UploadCloud className="w-6 h-6" />
                <p className="font-medium text-white/70 text-sm">Sube la portada</p>
              </div>
            )}
          </div>
        </div>

        {/* Collage Upload */}
        <div className="space-y-4">
          <label className="block text-sm font-medium tracking-wide text-white/80">
            Galería del Evento (Collage Masonry)
          </label>
          
          <div className="relative group cursor-pointer border border-white/10 hover:border-[#C89F6A]/50 bg-black/50 rounded-2xl p-4 flex flex-col items-center justify-center transition-all min-h-[120px]">
            <input 
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleGalleryChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            />
            <div className="flex items-center gap-3 text-white/50 group-hover:text-[#C89F6A]/70 pointer-events-none">
               <div className="bg-white/5 p-3 rounded-full"><Images className="w-5 h-5" /></div>
               <p className="font-semibold text-white/80">Selecciona múltiples fotos para el collage</p>
            </div>
          </div>

          {/* Preview Gallery */}
          {galleryFiles.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
              <AnimatePresence>
                {galleryFiles.map((file, idx) => (
                  <motion.div 
                    key={`${file.name}-${idx}`} 
                    initial={{ opacity:0, scale:0.8 }}
                    animate={{ opacity:1, scale:1 }}
                    exit={{ opacity:0, scale:0.5 }}
                    className="relative aspect-square rounded-xl overflow-hidden shadow-lg group border border-white/10"
                  >
                    <img src={URL.createObjectURL(file)} alt="Gallery Item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <button 
                      type="button" 
                      onClick={() => removeGalleryFile(idx)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur-md transition-colors z-20"
                    >
                       <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="pt-8 border-t border-white/5 flex justify-end">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`bg-[#C89F6A] hover:bg-[#D5B285] text-black font-semibold rounded-xl px-8 py-4 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(200,159,106,0.3)] w-full md:w-auto flex justify-center items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
               <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
               <CheckCircle2 className="w-5 h-5"/>
            )}
            {isLoading ? 'Subiendo...' : 'Publicar en el Carrusel'}
          </button>
        </div>
      </form>
    </div>
  );
}
