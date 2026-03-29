import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LogOut, Calendar, Images, UploadCloud, CheckCircle2, X, Pencil, Trash2, Plus, List } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "carousel">("upcoming");
  const [activeSubTab, setActiveSubTab] = useState<"create" | "list">("create");
  
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
          <nav className="space-y-8">
            
            {/* Próximos Eventos Group */}
            <div>
              <div className="flex items-center gap-2 text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] mb-3 px-2">
                <Calendar className="w-4 h-4" /> Próximos Eventos
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab("upcoming"); setActiveSubTab("create"); }}
                  className={`flex items-center gap-3 w-full p-2 pl-4 rounded-lg text-left transition-all text-sm ${
                    activeTab === "upcoming" && activeSubTab === "create"
                      ? "bg-[#C89F6A]/20 text-[#C89F6A] font-medium" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Plus className="w-4 h-4" /> Nuevo Evento
                </button>
                <button
                  onClick={() => { setActiveTab("upcoming"); setActiveSubTab("list"); }}
                  className={`flex items-center gap-3 w-full p-2 pl-4 rounded-lg text-left transition-all text-sm ${
                    activeTab === "upcoming" && activeSubTab === "list"
                      ? "bg-[#C89F6A]/20 text-[#C89F6A] font-medium" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" /> Gestionar
                </button>
              </div>
            </div>

            {/* Carrusel Group */}
            <div>
              <div className="flex items-center gap-2 text-white/40 text-[11px] font-bold uppercase tracking-[0.2em] mb-3 px-2">
                <Images className="w-4 h-4" /> Carrusel Histórico
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab("carousel"); setActiveSubTab("create"); }}
                  className={`flex items-center gap-3 w-full p-2 pl-4 rounded-lg text-left transition-all text-sm ${
                    activeTab === "carousel" && activeSubTab === "create"
                      ? "bg-[#C89F6A]/20 text-[#C89F6A] font-medium" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Plus className="w-4 h-4" /> Nuevo Carrusel
                </button>
                <button
                  onClick={() => { setActiveTab("carousel"); setActiveSubTab("list"); }}
                  className={`flex items-center gap-3 w-full p-2 pl-4 rounded-lg text-left transition-all text-sm ${
                    activeTab === "carousel" && activeSubTab === "list"
                      ? "bg-[#C89F6A]/20 text-[#C89F6A] font-medium" 
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <List className="w-4 h-4" /> Gestionar
                </button>
              </div>
            </div>

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
        {/* Mobile Header mb-8 etc */}
        <div className="md:hidden flex justify-between items-center mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
           <h2 className="text-lg font-bold tracking-widest text-[#C89F6A] uppercase">Cielo Admin</h2>
           <button onClick={handleLogout} className="text-white/50 hover:text-red-400">
             <LogOut className="w-5 h-5" />
           </button>
        </div>
        
        {/* Mobile Tabs */}
        <div className="md:hidden flex flex-col space-y-2 mb-8 bg-black/40 p-2 rounded-xl">
           <div className="flex gap-2">
             <button 
               onClick={() => { setActiveTab('upcoming'); setActiveSubTab('create'); }}
               className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'upcoming' && activeSubTab === 'create' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}
             >
               <Calendar className="w-3 h-3" /> + Próximo
             </button>
             <button 
               onClick={() => { setActiveTab('upcoming'); setActiveSubTab('list'); }}
               className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'upcoming' && activeSubTab === 'list' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}
             >
               <List className="w-3 h-3" /> Ver
             </button>
           </div>
           <div className="flex gap-2">
             <button 
               onClick={() => { setActiveTab('carousel'); setActiveSubTab('create'); }}
               className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'carousel' && activeSubTab === 'create' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}
             >
               <Images className="w-3 h-3" /> + Carrusel
             </button>
             <button 
               onClick={() => { setActiveTab('carousel'); setActiveSubTab('list'); }}
               className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'carousel' && activeSubTab === 'list' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}
             >
               <List className="w-3 h-3" /> Ver
             </button>
           </div>
        </div>

        <motion.div
          key={activeTab + activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "upcoming" ? <UpcomingEventsManager subTab={activeSubTab} setSubTab={setActiveSubTab} /> : <CarouselEventsManager subTab={activeSubTab} setSubTab={setActiveSubTab} />}
        </motion.div>
      </main>
    </div>
  );
}

// ----------------------------------------------------
// HELPERS
// ----------------------------------------------------
const uploadImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage.from('events').upload(filePath, file);
  if (error) throw new Error(`Error subiendo imagen: ${error.message}`);

  const { data } = supabase.storage.from('events').getPublicUrl(filePath);
  return data.publicUrl;
};

const deleteImageFromUrl = async (publicUrl: string) => {
  try {
    const urlParts = publicUrl.split('/events/');
    if (urlParts.length === 2) {
      const filePath = urlParts[1];
      await supabase.storage.from('events').remove([filePath]);
    }
  } catch (e) {
    console.error("No se pudo borrar la imagen de Storage", e);
  }
};

// ----------------------------------------------------
// MANAGERS (TABS)
// ----------------------------------------------------

function UpcomingEventsManager({ subTab, setSubTab }: { subTab: "create"|"list", setSubTab: (tab:"create"|"list")=>void }) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null); // To auto-fill create form

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('upcoming_events').select('*').order('created_at', { ascending: false });
    if (data) setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (subTab === "list") fetchEvents();
  }, [subTab]);

  const handleDelete = async (item: any) => {
    if (!confirm("¿Seguro que deseas eliminar este evento y su imagen para siempre?")) return;
    const toastId = toast.loading("Eliminando...");
    try {
      if (item.poster_url) await deleteImageFromUrl(item.poster_url);
      await supabase.from('upcoming_events').delete().eq('id', item.id);
      setEvents(prev => prev.filter(e => e.id !== item.id));
      toast.success("Eliminado correctamente", { id: toastId });
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setSubTab("create");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
            Próximos <span className="text-[#C89F6A] font-semibold">Eventos</span>
          </h1>
          <p className="text-white/50 mt-2">
            Administra los afiches que verán tus visitantes en la página principal.
          </p>
        </div>
        
        {/* Status Indicator instead of toggles */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          {editingItem && subTab === "create" && (
            <div className="px-6 py-2 rounded-lg flex items-center gap-2 transition-colors bg-[#C89F6A] text-black font-semibold shadow-lg">
              <Pencil className="w-4 h-4" /> Editando Evento
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {subTab === "create" ? (
          <motion.div key="create" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
             <UpcomingCreateForm 
               editingItem={editingItem} 
               onSuccess={() => { setSubTab("list"); setEditingItem(null); }} 
               onCancelEdit={() => { setSubTab("list"); setEditingItem(null); }}
             />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
             <UpcomingList events={events} isLoading={isLoading} onDelete={handleDelete} onEdit={handleEdit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CarouselEventsManager({ subTab, setSubTab }: { subTab: "create"|"list", setSubTab: (tab:"create"|"list")=>void }) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('carousel_events').select('*').order('created_at', { ascending: false });
    if (data) setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (subTab === "list") fetchEvents();
  }, [subTab]);

  const handleDelete = async (item: any) => {
    if (!confirm("¿Seguro que deseas eliminar el evento del carrusel y TODAS sus fotos asociadas?")) return;
    const toastId = toast.loading("Eliminando fotos del servidor...");
    try {
      if (item.poster_url) await deleteImageFromUrl(item.poster_url);
      if (item.gallery_urls && Array.isArray(item.gallery_urls)) {
        for (const url of item.gallery_urls) {
          await deleteImageFromUrl(url);
        }
      }
      await supabase.from('carousel_events').delete().eq('id', item.id);
      setEvents(prev => prev.filter(e => e.id !== item.id));
      toast.success("Evento eliminado completamente", { id: toastId });
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setSubTab("create");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
            Carrusel <span className="text-[#C89F6A] font-semibold">Histórico</span>
          </h1>
          <p className="text-white/50 mt-2">
            Administra las historias y galerías de las noches memorables pasadas.
          </p>
        </div>
        
        {/* Status Indicator instead of toggles */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          {editingItem && subTab === "create" && (
            <div className="px-6 py-2 rounded-lg flex items-center gap-2 transition-colors bg-[#C89F6A] text-black font-semibold shadow-lg">
              <Pencil className="w-4 h-4" /> Editando Evento
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {subTab === "create" ? (
          <motion.div key="create" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
             <CarouselCreateForm 
                editingItem={editingItem} 
                onSuccess={() => { setSubTab("list"); setEditingItem(null); }}
                onCancelEdit={() => { setSubTab("list"); setEditingItem(null); }}
             />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
             <CarouselList events={events} isLoading={isLoading} onDelete={handleDelete} onEdit={handleEdit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ----------------------------------------------------
// FORMS & LIST COMPONENTS
// ----------------------------------------------------

function UpcomingCreateForm({ editingItem, onSuccess, onCancelEdit }: { editingItem?: any, onSuccess: () => void, onCancelEdit: () => void }) {
  const [title, setTitle] = useState(editingItem?.title || "");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem && !posterFile) return toast.error("Agrega un póster");
    
    setIsLoading(true);
    let loadingToast = toast.loading(editingItem ? "Actualizando evento..." : "Subiendo imagen y publicando...");

    try {
      let finalPosterUrl = editingItem?.poster_url;
      
      // If user selected a new poster, upload it. Optionally delete old poster.
      if (posterFile) {
        if (editingItem && finalPosterUrl) await deleteImageFromUrl(finalPosterUrl);
        finalPosterUrl = await uploadImage(posterFile);
      }

      if (editingItem) {
        const { error } = await supabase.from('upcoming_events').update({ title, poster_url: finalPosterUrl }).eq('id', editingItem.id);
        if (error) throw error;
        toast.success("¡Evento actualizado!", { id: loadingToast });
      } else {
        const { error } = await supabase.from('upcoming_events').insert([{ title, poster_url: finalPosterUrl }]);
        if (error) throw error;
        toast.success("¡Próximo evento publicado!", { id: loadingToast });
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Error al procesar", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-black/40 border border-[#C89F6A]/20 p-6 md:p-8 rounded-2xl backdrop-blur-md">
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
        <label className="block text-sm font-medium tracking-wide text-white/80">
          Póster Promocional {editingItem && "- Selecciona uno nuevo para reemplazar el actual"}
        </label>
        
        {editingItem && !posterFile && editingItem.poster_url && (
           <div className="mb-4 relative w-48 h-64 rounded-xl overflow-hidden border border-white/20">
              <img src={editingItem.poster_url} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs text-center py-2">Póster Actual</div>
           </div>
        )}

        <div className="relative group cursor-pointer border-2 border-dashed border-white/10 hover:border-[#C89F6A]/50 bg-black/30 rounded-2xl p-10 flex flex-col items-center justify-center transition-all overflow-hidden h-64 text-center">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) setPosterFile(e.target.files[0]);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            required={!editingItem}
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
                <p className="font-semibold text-white/70">Arrastra tu nuevo póster o haz clic</p>
                <p className="text-sm mt-1">PNG, JPG, WEBP (Recomendado 1080x1350)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex gap-4 justify-end">
        {editingItem && (
          <button type="button" onClick={onCancelEdit} className="px-6 py-4 text-white/60 hover:text-white transition-colors">Cancelar</button>
        )}
        <button 
          type="submit" 
          disabled={isLoading}
          className={`bg-[#C89F6A] hover:bg-[#D5B285] text-black font-semibold rounded-xl px-8 py-4 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(200,159,106,0.3)] w-full md:w-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Guardando...' : editingItem ? 'Actualizar Evento' : 'Publicar Evento'}
        </button>
      </div>
    </form>
  );
}

function UpcomingList({ events, isLoading, onDelete, onEdit }: any) {
  if (isLoading) return <div className="text-white/50 text-center py-20">Cargando eventos...</div>;
  if (!events.length) return <div className="text-white/50 text-center py-20">No hay eventos próximos aún.</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {events.map((ev: any) => (
        <div key={ev.id} className="bg-black/40 border border-white/5 rounded-xl overflow-hidden group">
          <div className="relative aspect-[3/4] overflow-hidden">
            <img src={ev.poster_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 p-4 w-full">
               <h3 className="text-white font-medium truncate">{ev.title}</h3>
            </div>
            
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => onEdit(ev)} className="bg-white/10 hover:bg-[#C89F6A] text-white hover:text-black p-2 rounded-full backdrop-blur-md transition-colors shadow-lg">
                 <Pencil className="w-4 h-4" />
               </button>
               <button onClick={() => onDelete(ev)} className="bg-white/10 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-colors shadow-lg">
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------

function CarouselCreateForm({ editingItem, onSuccess, onCancelEdit }: { editingItem?: any, onSuccess: () => void, onCancelEdit: () => void }) {
  const [title, setTitle] = useState(editingItem?.title || "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]); // New files
  const [existingGallery, setExistingGallery] = useState<string[]>(editingItem?.gallery_urls || []); // Keep track of old DB files
  const [isLoading, setIsLoading] = useState(false);

  // Sync existing ones if item changes
  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description);
      setExistingGallery(editingItem.gallery_urls || []);
      setGalleryFiles([]);
      setPosterFile(null);
    }
  }, [editingItem]);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingFile = async (idx: number, url: string) => {
    if (!confirm("Esto eliminará la foto de la nube en tiempo real. ¿Continuar?")) return;
    try {
      // 1. Delete from storage immediately
      await deleteImageFromUrl(url);
      
      // 2. Remove from local array
      const updatedGallery = [...existingGallery];
      updatedGallery.splice(idx, 1);
      setExistingGallery(updatedGallery);
      
      // 3. Update in database to sync
      await supabase.from('carousel_events').update({ gallery_urls: updatedGallery }).eq('id', editingItem.id);
      toast.success("Foto eliminada", { position: "bottom-right" });
    } catch(e) {
      toast.error("Error al borrar foto individual");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem && !posterFile) return toast.error("Es necesario subir una portada (póster)");
    if (!editingItem && galleryFiles.length === 0) return toast.error("Agrega al menos una foto para el collage");
    if (editingItem && existingGallery.length === 0 && galleryFiles.length === 0) return toast.error("Mantén al menos una foto en el collage");
    
    setIsLoading(true);
    let loadingToast = toast.loading(editingItem ? "Actualizando detalles..." : "Subiendo imágenes...");

    try {
      let finalPosterUrl = editingItem?.poster_url;
      if (posterFile) {
        if (editingItem && finalPosterUrl) await deleteImageFromUrl(finalPosterUrl);
        finalPosterUrl = await uploadImage(posterFile);
      }

      // Upload all new gallery files
      const newUrls = galleryFiles.length > 0 ? await Promise.all(galleryFiles.map(file => uploadImage(file))) : [];
      const finalGalleryUrls = [...existingGallery, ...newUrls];
      
      if (editingItem) {
        const { error } = await supabase.from('carousel_events').update({ 
          title, description, poster_url: finalPosterUrl, gallery_urls: finalGalleryUrls 
        }).eq('id', editingItem.id);
        if (error) throw error;
        toast.success("¡Evento de Carrusel actualizado!", { id: loadingToast });
      } else {
        const { error } = await supabase.from('carousel_events').insert([{ 
          title, description, poster_url: finalPosterUrl, gallery_urls: finalGalleryUrls 
        }]);
        if (error) throw error;
        toast.success("Evento publicado exitosamente", { id: loadingToast });
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Error inesperado", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-black/40 border border-[#C89F6A]/20 p-6 md:p-8 rounded-2xl backdrop-blur-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium tracking-wide text-white/80">Nombre del Evento</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A]"
            required
          />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium tracking-wide text-white/80">Descripción Corta</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] resize-none"
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium tracking-wide text-white/80">
          Imagen Principal (Póster/Portada) {editingItem && "- Selecciona otra para reemplazar"}
        </label>
        
        {editingItem && !posterFile && editingItem.poster_url && (
           <div className="mb-4 relative w-32 h-32 rounded-xl overflow-hidden border border-white/20">
              <img src={editingItem.poster_url} className="w-full h-full object-cover" />
           </div>
        )}

        <div className="relative group cursor-pointer border border-dashed border-white/10 hover:border-[#C89F6A]/50 bg-black/30 rounded-2xl p-6 h-32 flex items-center justify-center">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => { if (e.target.files && e.target.files[0]) setPosterFile(e.target.files[0]); }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            required={!editingItem}
          />
          {posterFile ? (
             <div className="text-green-400 font-medium">{posterFile.name} (Lista para subir)</div>
          ) : (
            <div className="flex text-white/50 group-hover:text-[#C89F6A]/70 items-center justify-center gap-2">
              <UploadCloud /> <span>Subir Portada</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium tracking-wide text-white/80 flex justify-between items-center">
          Fotografías del Collage
          {editingItem && <span className="text-xs text-[#C89F6A]">Click en la X roja para borrar fotos de la BD al instante.</span>}
        </label>
        
        {/* Manage existing photos in edit mode */}
        {editingItem && existingGallery.length > 0 && (
          <div className="bg-black/20 p-4 rounded-xl mb-4 border border-white/5">
             <p className="text-white/40 text-xs uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Fotos Activas en Servidor</p>
             <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
               {existingGallery.map((url, idx) => (
                 <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-white/20">
                    <img src={url} className="w-full h-full object-cover opacity-80 group-hover:opacity-40 transition-opacity" />
                    <button type="button" onClick={() => removeExistingFile(idx, url)} className="absolute inset-0 m-auto w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                 </div>
               ))}
             </div>
          </div>
        )}

        <div className="relative group cursor-pointer border border-white/10 hover:border-[#C89F6A]/50 bg-black/50 rounded-2xl p-4 flex flex-col items-center justify-center transition-all min-h-[100px]">
          <input 
            type="file" accept="image/*" multiple onChange={handleGalleryChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          />
          <div className="flex items-center gap-3 text-white/50 group-hover:text-[#C89F6A]/70 pointer-events-none">
             <Images /> <p>Agregar más fotos al collage</p>
          </div>
        </div>

        {galleryFiles.length > 0 && (
          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
             <p className="text-white/40 text-xs uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Nuevas Fotos (Se subirán al guardar)</p>
             <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
               {galleryFiles.map((file, idx) => (
                 <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-green-500/30">
                   <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-60" />
                   <button type="button" onClick={() => removeNewFile(idx)} className="absolute top-1 right-1 bg-black/80 hover:bg-red-500 p-1.5 rounded-full z-20">
                      <X className="w-3 h-3 text-white" />
                   </button>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-white/5 flex gap-4 justify-end">
        {editingItem && (
          <button type="button" onClick={onCancelEdit} className="px-6 py-4 text-white/60 hover:text-white transition-colors">Cancelar</button>
        )}
        <button 
          type="submit" 
          disabled={isLoading}
          className={`bg-[#C89F6A] hover:bg-[#D5B285] text-black font-semibold rounded-xl px-8 py-4 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(200,159,106,0.3)] flex items-center gap-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <CheckCircle2 className="w-5 h-5"/>}
          {isLoading ? 'Guardando...' : editingItem ? 'Guardar Cambios' : 'Publicar Evento'}
        </button>
      </div>
    </form>
  );
}

function CarouselList({ events, isLoading, onDelete, onEdit }: any) {
  if (isLoading) return <div className="text-white/50 text-center py-20">Cargando eventos...</div>;
  if (!events.length) return <div className="text-white/50 text-center py-20">No hay eventos aún.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {events.map((ev: any) => (
        <div key={ev.id} className="bg-black/40 border border-white/5 rounded-xl overflow-hidden flex flex-col group">
          <div className="h-48 relative overflow-hidden">
             <img src={ev.poster_url} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
             <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
             <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/80 border border-white/10">
               {ev.gallery_urls?.length || 0} fotos
             </div>
             
             <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <h3 className="text-xl font-medium text-white shadow-sm">{ev.title}</h3>
                <div className="flex gap-2">
                   <button onClick={() => onEdit(ev)} className="bg-white/10 hover:bg-[#C89F6A] text-white hover:text-black p-2 rounded-full backdrop-blur-md transition-colors shadow-lg">
                     <Pencil className="w-4 h-4" />
                   </button>
                   <button onClick={() => onDelete(ev)} className="bg-white/10 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-colors shadow-lg">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
             </div>
          </div>
          <div className="p-4 text-sm text-white/50">
             <p className="line-clamp-2">{ev.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
