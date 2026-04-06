import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { LogOut, Calendar, Images, UploadCloud, CheckCircle2, X, Pencil, Trash2, Plus, List, ChefHat, LayoutTemplate, Sparkles, CalendarCheck, Check, Store, ChevronDown, Eye, RefreshCcw, ShieldCheck } from "lucide-react";
import { useAdminGuard } from "../../../lib/useAdminGuard";
import AdminManagement from "./AdminManagement";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "upcoming" | "carousel" | "menu" | "terraces" | "special_events" | "terrace_reservations" | "business_rules" | "admins">("home");
  const [activeSubTab, setActiveSubTab] = useState<"create" | "list" | "reservations" | "settings">("create");
  const [editingItem, setEditingItem] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const SIDEBAR_ITEMS = useMemo(() => [
    {
      id: "upcoming",
      title: "Próximos Eventos",
      icon: Calendar,
      items: [
        { label: "Nuevo Evento", icon: Plus, tab: "upcoming", subTab: "create" },
        { label: "Gestionar", icon: List, tab: "upcoming", subTab: "list" },
      ]
    },
    {
      id: "carousel",
      title: "Carrusel Histórico",
      icon: Images,
      items: [
        { label: "Nuevo Carrusel", icon: Plus, tab: "carousel", subTab: "create" },
        { label: "Gestionar", icon: List, tab: "carousel", subTab: "list" },
      ]
    },
    {
      id: "menu",
      title: "Menú Rincón",
      icon: ChefHat,
      items: [
        { label: "Nuevo Platillo", icon: Plus, tab: "menu", subTab: "create" },
        { label: "Gestionar", icon: List, tab: "menu", subTab: "list" },
      ]
    },
    {
      id: "terraces",
      title: "Terrazas",
      icon: LayoutTemplate,
      items: [
        { label: "Nueva Terraza", icon: Plus, tab: "terraces", subTab: "create" },
        { label: "Gestionar", icon: List, tab: "terraces", subTab: "list" },
      ]
    },
    {
      id: "special_events",
      title: "Eventos Especiales",
      icon: Sparkles,
      items: [
        { label: "Nuevo Evento", icon: Plus, tab: "special_events", subTab: "create" },
        { label: "Gestionar", icon: List, tab: "special_events", subTab: "list" },
      ]
    },
    {
      id: "terrace_reservations",
      title: "Reservaciones",
      icon: CalendarCheck,
      items: [
        { label: "Ver Reservas", icon: List, tab: "terrace_reservations", subTab: "list" },
      ]
    },
    {
      id: "admins",
      title: "Administradores",
      icon: ShieldCheck,
      items: [
        { label: "Gestionar", icon: List, tab: "admins", subTab: "list" },
      ]
    }
  ], []);

  // Auth Check: sesión real de Supabase + verificación de rol admin
  const { loading: authLoading } = useAdminGuard();

  const handleLogout = async () => {
    await supabase.auth.signOut();
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

  // Mostrar spinner mientras se verifica la sesión y el rol admin
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090B10] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C89F6A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[#090B10] flex text-[#EFEAE2] font-sans relative overflow-hidden">

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
      <aside className="w-64 border-r border-white/5 bg-[#090B10]/80 backdrop-blur-md p-6 flex flex-col justify-between hidden md:flex shrink-0 z-10 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div>
          <h2 className="text-xl font-bold tracking-widest text-[#C89F6A] mb-12 uppercase">
            Cielo Admin
          </h2>
          <nav className="space-y-8">
            {/* Dashboard Home */}
            <div>
              <button
                onClick={() => { setActiveTab("home"); setEditingItem(null); }}
                className={`flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all text-sm font-semibold tracking-wide ${activeTab === "home"
                  ? "bg-[#C89F6A] text-black shadow-[0_0_20px_rgba(200,159,106,0.3)]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <LayoutTemplate className="w-5 h-5" /> Dashboard
              </button>
            </div>

            {SIDEBAR_ITEMS.map((group) => {
              const Icon = group.icon;
              const isOpen = openMenu === group.id;

              return (
                <div key={group.id} className="mb-2">
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : group.id)}
                    className="w-full flex items-center justify-between text-white/40 hover:text-white/80 transition-colors py-2 px-3 rounded-lg hover:bg-white/5 group/button"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] group-hover/button:text-white transition-colors">
                      <Icon className="w-4 h-4" /> {group.title}
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 opacity-50 group-hover/button:opacity-100" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-1 mt-2">
                          {group.items.map((item, index) => {
                            const ItemIcon = item.icon;
                            // Check exact tab match. (For editing, activeSubTab handles the edit form correctly but editingItem nullifies active appearance, which matches existing behavior)
                            const isActive = activeTab === item.tab && activeSubTab === item.subTab && !editingItem;

                            return (
                              <button
                                key={index}
                                onClick={() => { setActiveTab(item.tab as any); setActiveSubTab(item.subTab as any); setEditingItem(null); }}
                                className={`flex items-center gap-3 w-full p-2 pl-4 rounded-lg text-left transition-all text-sm ${isActive
                                    ? "bg-[#C89F6A]/20 text-[#C89F6A] font-medium border-l-2 border-[#C89F6A]"
                                    : "text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
                                  }`}
                              >
                                <ItemIcon className="w-4 h-4" /> {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

          </nav>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => { setActiveTab("business_rules"); setActiveSubTab("settings"); setEditingItem(null); setOpenMenu(null); }}
            className={`flex items-center gap-3 w-full p-3 rounded-xl text-left transition-all text-sm font-semibold tracking-wide ${activeTab === "business_rules"
              ? "bg-[#C89F6A]/20 text-[#C89F6A] shadow-[0_0_20px_rgba(200,159,106,0.1)] border border-[#C89F6A]/30"
              : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
          >
            <Store className="w-5 h-5" /> Configuración
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-left text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto p-6 md:p-12 relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-8 bg-black/40 p-4 rounded-xl border border-white/5">
          <h2 className="text-lg font-bold tracking-widest text-[#C89F6A] uppercase">Cielo Admin</h2>
          <button onClick={handleLogout} className="text-white/50 hover:text-red-400">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex flex-col space-y-2 mb-8 bg-black/40 p-2 rounded-xl">
          <div className="flex gap-2">
            <button onClick={() => { setActiveTab('home'); setEditingItem(null); }} className={`flex-1 py-3 text-xs flex items-center justify-center gap-2 rounded-lg transition-all font-bold ${activeTab === 'home' ? 'bg-[#C89F6A] text-black' : 'text-white/50 bg-white/5'}`}>
              <LayoutTemplate className="w-4 h-4" /> DASHBOARD
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setActiveTab('upcoming'); setActiveSubTab('create'); }} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'upcoming' && activeSubTab === 'create' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <Calendar className="w-3 h-3" /> + Próximo
            </button>
            <button onClick={() => { setActiveTab('upcoming'); setActiveSubTab('list'); }} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'upcoming' && activeSubTab === 'list' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <List className="w-3 h-3" /> Ver
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setActiveTab('carousel'); setActiveSubTab('create'); }} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'carousel' && activeSubTab === 'create' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <Images className="w-3 h-3" /> + Carrusel
            </button>
            <button onClick={() => { setActiveTab('carousel'); setActiveSubTab('list'); }} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'carousel' && activeSubTab === 'list' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <List className="w-3 h-3" /> Ver
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setActiveTab('menu'); setActiveSubTab('create'); }} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'menu' && activeSubTab === 'create' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <ChefHat className="w-3 h-3" /> + Plato
            </button>
            <button onClick={() => { setActiveTab('menu'); setActiveSubTab('list'); }} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'menu' && activeSubTab === 'list' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <List className="w-3 h-3" /> Ver
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setActiveTab('terraces'); setActiveSubTab('create'); }} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'terraces' && activeSubTab === 'create' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <LayoutTemplate className="w-3 h-3" /> + Terraza
            </button>
            <button onClick={() => { setActiveTab('terraces'); setActiveSubTab('list'); }} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'terraces' && activeSubTab === 'list' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <List className="w-3 h-3" /> Ver
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setActiveTab('special_events'); setActiveSubTab('create'); }} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'special_events' && activeSubTab === 'create' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <Sparkles className="w-3 h-3" /> + Especial
            </button>
            <button onClick={() => { setActiveTab('special_events'); setActiveSubTab('list'); }} className={`flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'special_events' && activeSubTab === 'list' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <List className="w-3 h-3" /> Ver
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setActiveTab('terrace_reservations'); setActiveSubTab('list'); }} className={`w-full py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'terrace_reservations' && activeSubTab === 'list' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <CalendarCheck className="w-3 h-3" /> Ver Reservas de Terrazas
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setActiveTab('business_rules'); setActiveSubTab('settings'); }} className={`w-full py-2 text-xs flex items-center justify-center gap-1 rounded-lg transition-all ${activeTab === 'business_rules' && activeSubTab === 'settings' ? 'bg-[#C89F6A]/20 text-[#C89F6A]' : 'text-white/50'}`}>
              <Store className="w-3 h-3" /> Reglas de Negocio
            </button>
          </div>
        </div>

        <motion.div
          key={activeTab + activeSubTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === "home" ? (
            <HomeManager setActiveTab={setActiveTab} setActiveSubTab={setActiveSubTab} />
          ) : activeTab === "upcoming" ? (
            <UpcomingEventsManager subTab={activeSubTab} setSubTab={setActiveSubTab} editingItem={editingItem} setEditingItem={setEditingItem} />
          ) : activeTab === "carousel" ? (
            <CarouselEventsManager subTab={activeSubTab} setSubTab={setActiveSubTab} editingItem={editingItem} setEditingItem={setEditingItem} />
          ) : activeTab === "menu" ? (
            <MenuItemsManager subTab={activeSubTab} setSubTab={setActiveSubTab} editingItem={editingItem} setEditingItem={setEditingItem} />
          ) : activeTab === "terraces" ? (
            <TerracesManager subTab={activeSubTab} setSubTab={setActiveSubTab} editingItem={editingItem} setEditingItem={setEditingItem} />
          ) : activeTab === "special_events" ? (
            <SpecialEventsManager subTab={activeSubTab} setSubTab={setActiveSubTab} editingItem={editingItem} setEditingItem={setEditingItem} />
          ) : activeTab === "terrace_reservations" ? (
            <TerraceReservationsManager subTab={activeSubTab} setSubTab={setActiveSubTab} />
          ) : activeTab === "admins" ? (
            <AdminManagement />
          ) : (
            <BusinessRulesManager />
          )}
        </motion.div>
      </main>
    </div>
  );
}

// ----------------------------------------------------
// HELPERS
// ----------------------------------------------------
const uploadImage = async (file: File, bucket = 'events'): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error) throw new Error(`Error subiendo imagen: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

const deleteImageFromUrl = async (publicUrl: string, bucket = 'events') => {
  try {
    const urlParts = publicUrl.split(`/${bucket}/`);
    if (urlParts.length === 2) {
      const filePath = urlParts[1];
      await supabase.storage.from(bucket).remove([filePath]);
    }
  } catch (e) {
    console.error("No se pudo borrar la imagen de Storage", e);
  }
};

// ----------------------------------------------------
// MANAGERS (TABS)
// ----------------------------------------------------

function UpcomingEventsManager({ subTab, setSubTab, editingItem, setEditingItem }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
          <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <UpcomingCreateForm
              editingItem={editingItem}
              onSuccess={() => { setSubTab("list"); setEditingItem(null); }}
              onCancelEdit={() => { setSubTab("list"); setEditingItem(null); }}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <UpcomingList events={events} isLoading={isLoading} onDelete={handleDelete} onEdit={handleEdit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CarouselEventsManager({ subTab, setSubTab, editingItem, setEditingItem }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);


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
          <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <CarouselCreateForm
              editingItem={editingItem}
              onSuccess={() => { setSubTab("list"); setEditingItem(null); }}
              onCancelEdit={() => { setSubTab("list"); setEditingItem(null); }}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
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
    } catch (e) {
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
          {isLoading ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div> : <CheckCircle2 className="w-5 h-5" />}
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

// ----------------------------------------------------
// MENU ITEMS MANAGER
// ----------------------------------------------------

function MenuItemsManager({ subTab, setSubTab, editingItem, setEditingItem }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('menu_items').select('*').order('category', { ascending: true }).order('sort_order', { ascending: true });
    if (data) setItems(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (subTab === "list") fetchItems();
  }, [subTab]);

  const handleDelete = async (item: any) => {
    if (!confirm("¿Seguro que deseas eliminar este platillo?")) return;
    const toastId = toast.loading("Eliminando...");
    try {
      if (item.image && item.image.includes('supabase')) await deleteImageFromUrl(item.image);
      await supabase.from('menu_items').delete().eq('id', item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      toast.success("Platillo eliminado", { id: toastId });
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setSubTab("create");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
            Menú <span className="text-[#C89F6A] font-semibold">Rincón del Atardecer</span>
          </h1>
          <p className="text-white/50 mt-2">
            Gestiona los productos, precios y categorías que aparecen en el menú interactivo.
          </p>
        </div>

        {editingItem && subTab === "create" && (
          <div className="px-6 py-2 rounded-lg bg-[#C89F6A] text-black font-semibold shadow-lg flex items-center gap-2">
            <Pencil className="w-4 h-4" /> Editando: {editingItem.name}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {subTab === "create" ? (
          <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <MenuItemCreateForm
              editingItem={editingItem}
              onSuccess={() => { fetchItems(); setSubTab("list"); setEditingItem(null); }}
              onCancel={() => { setSubTab("list"); setEditingItem(null); }}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <MenuItemList items={items} isLoading={isLoading} onDelete={handleDelete} onEdit={handleEdit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItemCreateForm({ editingItem, onSuccess, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    category: "Bebidas Calientes",
    sort_order: 0,
    is_available: true
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync data when editingItem changes
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        description: editingItem.description || "",
        price: editingItem.price || 0,
        category: editingItem.category || "Bebidas Calientes",
        sort_order: editingItem.sort_order || 0,
        is_available: editingItem.is_available ?? true
      });
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "Bebidas Calientes",
        sort_order: 0,
        is_available: true
      });
      setImageFile(null);
    }
  }, [editingItem]);

  const categories = ["Bebidas Calientes", "Comida", "Repostería Dulce", "Opciones Saladas"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading(editingItem ? "Actualizando..." : "Creando...");

    try {
      let imageUrl = editingItem?.image;
      if (imageFile) {
        if (editingItem && imageUrl && imageUrl.includes('supabase')) await deleteImageFromUrl(imageUrl);
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        category: formData.category,
        sort_order: Number(formData.sort_order),
        is_available: Boolean(formData.is_available),
        image: imageUrl
      };

      if (editingItem) {
        const { error } = await supabase.from('menu_items').update(payload).eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('menu_items').insert([payload]);
        if (error) throw error;
      }

      toast.success("Guardado exitosamente", { id: toastId });
      onSuccess();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black/40 border border-white/10 p-8 rounded-2xl backdrop-blur-md space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-sm font-medium text-white/70">Nombre del Producto</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C89F6A]"
            required
          />
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium text-white/70">Categoría</label>
          <select
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:border-[#C89F6A]"
          >
            {categories.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
          </select>
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium text-white/70">Precio (₡)</label>
          <input
            type="number"
            value={formData.price}
            onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) })}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C89F6A]"
            required
          />
        </div>
        <div className="space-y-4">
          <label className="text-sm font-medium text-white/70">Orden de Aparición</label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#C89F6A]"
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-white/70">Descripción</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white resize-none focus:border-[#C89F6A]"
        />
      </div>

      <div className="space-y-4 border-2 border-dashed border-white/5 p-6 rounded-2xl hover:border-[#C89F6A]/30 transition-colors cursor-pointer relative">
        <label className="text-sm font-medium text-white/70 block mb-2">Imagen del Producto</label>
        <input
          type="file"
          onChange={e => e.target.files && setImageFile(e.target.files[0])}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
        />
        {imageFile ? (
          <div className="flex items-center gap-4 text-green-400">
            <CheckCircle2 className="w-8 h-8" /> <span>{imageFile.name} (Lista)</span>
          </div>
        ) : editingItem?.image ? (
          <div className="flex items-center gap-4 overflow-hidden">
            <img src={editingItem.image} className="w-16 h-16 rounded-lg object-cover" />
            <span className="text-white/50">Clic para subir otra imagen</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/40">
            <UploadCloud className="w-8 h-8" />
            <span>Selecciona una foto cuadrada (Ej: 800x800)</span>
          </div>
        )}
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#C89F6A]/30 transition-all group/toggle"
        onClick={() => setFormData(prev => ({ ...prev, is_available: !prev.is_available }))}
      >
        <div className="text-left space-y-0.5">
          <label className="text-sm font-medium text-white block cursor-pointer">Disponible actualmente</label>
          <span className="text-xs text-white/40 group-hover/toggle:text-white/60 transition-colors">Si se desactiva, el producto aparecerá como "Agotado" en el menú.</span>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${formData.is_available ? 'bg-[#C89F6A]' : 'bg-white/10'}`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 transform ${formData.is_available ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
      </button>

      <div className="flex gap-4 justify-end pt-6">
        <button type="button" onClick={onCancel} className="px-6 py-3 text-white/50 hover:text-white">Cancelar</button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#C89F6A] text-black font-bold px-10 py-3 rounded-xl hover:scale-105 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(200,159,106,0.3)]"
        >
          {isLoading ? "Guardando..." : editingItem ? "Actualizar Platillo" : "Agregar al Menú"}
        </button>
      </div>
    </form>
  );
}

function MenuItemList({ items, isLoading, onDelete, onEdit }: any) {
  if (isLoading) return <div className="text-center py-20 text-white/40">Cargando menú...</div>;
  if (!items.length) return <div className="text-center py-20 text-white/40">El menú está vacío.</div>;

  const categories = Array.from(new Set(items.map((i: any) => i.category)));

  return (
    <div className="space-y-12 pb-20">
      {categories.map((cat: any) => (
        <section key={cat} className="space-y-4">
          <h2 className="text-xl font-bold text-[#C89F6A] border-b border-white/5 pb-2 flex items-center gap-2 italic tracking-wider">
            <ChefHat className="w-5 h-5" /> {cat}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.filter((i: any) => i.category === cat).map((item: any) => (
              <div key={item.id} className={`bg-black/40 border border-white/5 rounded-2xl overflow-hidden group hover:border-[#C89F6A]/30 transition-all ${!item.is_available ? 'grayscale opacity-70' : ''}`}>
                <div className="p-4 flex gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/10 flex-shrink-0 relative">
                    {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                    {!item.is_available && (
                      <div className="absolute inset-0 bg-red-900/50 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Agotado</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-white truncate text-lg group-hover:text-[#C89F6A] transition-colors">{item.name}</h3>
                      <span className="text-sm font-bold text-[#C89F6A]">₡{item.price}</span>
                    </div>
                    <p className="text-xs text-white/50 line-clamp-2 mt-1 h-8">{item.description}</p>
                    <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(item)} className="p-2 bg-white/5 hover:bg-[#C89F6A] hover:text-black rounded-lg transition-all">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button onClick={() => onDelete(item)} className="p-2 bg-white/5 hover:bg-red-500 rounded-lg transition-all">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}


// TERRACES MANAGER
// ----------------------------------------------------

function TerracesManager({ subTab, setSubTab, editingItem, setEditingItem }: any) {
  const [terraces, setTerraces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTerraces = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('terraces').select('*').order('created_at', { ascending: false });
    if (data) setTerraces(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (subTab === "list") fetchTerraces();
  }, [subTab]);

  const handleDelete = async (item: any) => {
    if (!confirm("¿Seguro que deseas eliminar esta terraza y su imagen?")) return;
    const toastId = toast.loading("Eliminando...");
    try {
      if (item.image_url) await deleteImageFromUrl(item.image_url, 'terraces');
      await supabase.from('terraces').delete().eq('id', item.id);
      setTerraces(prev => prev.filter(t => t.id !== item.id));
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
            Gestión de <span className="text-[#C89F6A] font-semibold">Terrazas</span>
          </h1>
          <p className="text-white/50 mt-2">
            Administra las diferentes terrazas disponibles, sus historias y promociones.
          </p>
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          {editingItem && subTab === "create" && (
            <div className="px-6 py-2 rounded-lg flex items-center gap-2 transition-colors bg-[#C89F6A] text-black font-semibold shadow-lg">
              <Pencil className="w-4 h-4" /> Editando Terraza
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {subTab === "create" ? (
          <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <TerraceCreateForm
              editingItem={editingItem}
              onSuccess={() => { setSubTab("list"); setEditingItem(null); }}
              onCancelEdit={() => { setSubTab("list"); setEditingItem(null); }}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <TerraceList terraces={terraces} isLoading={isLoading} onDelete={handleDelete} onEdit={handleEdit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TerraceCreateForm({ editingItem, onSuccess, onCancelEdit }: { editingItem?: any, onSuccess: () => void, onCancelEdit: () => void }) {
  const [title, setTitle] = useState(editingItem?.title || "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [highlight, setHighlight] = useState(editingItem?.highlight || "");
  const [maxCapacity, setMaxCapacity] = useState<number>(editingItem?.max_capacity || 6);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description);
      setHighlight(editingItem.highlight);
      setMaxCapacity(editingItem.max_capacity || 6);
      setImageFile(null);
    }
  }, [editingItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem && !imageFile) return toast.error("Agrega una imagen representativa");
    setIsLoading(true);
    let loadingToast = toast.loading(editingItem ? "Actualizando terraza..." : "Creando terraza...");
    try {
      let finalImageUrl = editingItem?.image_url;
      if (imageFile) {
        if (editingItem && finalImageUrl) await deleteImageFromUrl(finalImageUrl, 'terraces');
        finalImageUrl = await uploadImage(imageFile, 'terraces');
      }
      if (editingItem) {
        const { error } = await supabase.from('terraces').update({ title, description, highlight, max_capacity: maxCapacity, image_url: finalImageUrl }).eq('id', editingItem.id);
        if (error) throw error;
        toast.success("¡Terraza actualizada!", { id: loadingToast });
      } else {
        const { error } = await supabase.from('terraces').insert([{ title, description, highlight, max_capacity: maxCapacity, image_url: finalImageUrl }]);
        if (error) throw error;
        toast.success("¡Terraza creada!", { id: loadingToast });
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium tracking-wide text-white/80">Nombre/Categoría</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Terrazas Íntimas" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] transition-colors" required />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium tracking-wide text-white/80">Frase/Destacado (Highlight)</label>
          <input type="text" value={highlight} onChange={(e) => setHighlight(e.target.value)} placeholder="Ej: Perfecto para aniversarios" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] transition-colors" required />
        </div>
        <div className="space-y-4 md:col-span-2">
          <label className="block text-sm font-medium tracking-wide text-white/80">Capacidad Máxima (personas)</label>
          <input type="number" min="1" value={maxCapacity} onChange={(e) => setMaxCapacity(parseInt(e.target.value) || 1)} placeholder="Ej: 6" className="w-full md:w-1/2 bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] transition-colors" required />
        </div>
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium tracking-wide text-white/80">Descripción Completa</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Escribe los detalles de la terraza..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] resize-none transition-colors" required />
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium tracking-wide text-white/80">
          Imagen Representativa {editingItem && "- Selecciona una nueva para reemplazar la actual"}
        </label>
        {editingItem && !imageFile && editingItem.image_url && (
          <div className="mb-4 relative w-48 h-32 rounded-xl overflow-hidden border border-white/20">
            <img src={editingItem.image_url} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative group cursor-pointer border-2 border-dashed border-white/10 hover:border-[#C89F6A]/50 bg-black/30 rounded-2xl p-10 flex flex-col items-center justify-center transition-all overflow-hidden h-48 text-center">
          <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!editingItem} />
          {imageFile ? (
            <div className="absolute inset-0 w-full h-full">
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50">
                <CheckCircle2 className="w-10 h-10 text-green-400 mb-2" />
                <p className="text-white font-medium">{imageFile.name}</p>
                <p className="text-white/60 text-sm mt-1">Haz clic para reemplazar</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-white/50 group-hover:text-[#C89F6A]/70 transition-colors">
              <div className="p-4 bg-white/5 rounded-full"><UploadCloud className="w-8 h-8" /></div>
              <div><p className="font-semibold text-white/70">Arrastra la imagen aquí</p></div>
            </div>
          )}
        </div>
      </div>
      <div className="pt-4 flex gap-4 justify-end">
        {editingItem && (
          <button type="button" onClick={onCancelEdit} className="px-6 py-4 text-white/60 hover:text-white transition-colors">Cancelar</button>
        )}
        <button type="submit" disabled={isLoading} className={`bg-[#C89F6A] hover:bg-[#D5B285] text-black font-semibold rounded-xl px-8 py-4 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(200,159,106,0.3)] w-full md:w-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isLoading ? 'Guardando...' : editingItem ? 'Actualizar Terraza' : 'Crear Terraza'}
        </button>
      </div>
    </form>
  );
}

function TerraceList({ terraces, isLoading, onDelete, onEdit }: any) {
  if (isLoading) return <div className="text-white/50 text-center py-20">Cargando terrazas...</div>;
  if (!terraces.length) return <div className="text-white/50 text-center py-20">No hay terrazas registradas aún.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {terraces.map((t: any) => (
        <div key={t.id} className="bg-black/40 border border-white/5 rounded-xl overflow-hidden group">
          <div className="relative h-48 overflow-hidden">
            <img src={t.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <h3 className="text-[#C89F6A] font-light text-xs uppercase tracking-wider mb-1">{t.highlight}</h3>
              <h4 className="text-white font-medium text-lg truncate">{t.title}</h4>
            </div>
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(t)} className="bg-white/10 hover:bg-[#C89F6A] text-white hover:text-black p-2 rounded-full backdrop-blur-md transition-colors shadow-lg">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(t)} className="bg-white/10 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-colors shadow-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-4 text-sm text-white/50 bg-[#090B10]/50 border-t border-white/5">
            <p className="line-clamp-3">{t.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------
// SPECIAL EVENTS MANAGER
// ----------------------------------------------------

function SpecialEventsManager({ subTab, setSubTab, editingItem, setEditingItem }: any) {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('special_events').select('*').order('created_at', { ascending: false });
    if (data) setEvents(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (subTab === "list") fetchEvents();
  }, [subTab]);

  const handleDelete = async (item: any) => {
    if (!confirm("¿Seguro que deseas eliminar este evento especial y su imagen?")) return;
    const toastId = toast.loading("Eliminando...");
    try {
      if (item.image_url) await deleteImageFromUrl(item.image_url, 'special-events');
      await supabase.from('special_events').delete().eq('id', item.id);
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
            Eventos <span className="text-[#C89F6A] font-semibold">Especiales</span>
          </h1>
          <p className="text-white/50 mt-2">
            Administra los eventos especiales con sus menús exclusivos que aparecen en la sección del Food Truck.
          </p>
        </div>
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
          <motion.div key="create" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <SpecialEventCreateForm
              editingItem={editingItem}
              onSuccess={() => { setSubTab("list"); setEditingItem(null); }}
              onCancelEdit={() => { setSubTab("list"); setEditingItem(null); }}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <SpecialEventList events={events} isLoading={isLoading} onDelete={handleDelete} onEdit={handleEdit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpecialEventCreateForm({ editingItem, onSuccess, onCancelEdit }: { editingItem?: any, onSuccess: () => void, onCancelEdit: () => void }) {
  const [name, setName] = useState(editingItem?.name || "");
  const [date, setDate] = useState(editingItem?.date || "");
  const [description, setDescription] = useState(editingItem?.description || "");
  const [menuItems, setMenuItems] = useState<string[]>(editingItem?.menu || [""]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setDate(editingItem.date || "");
      setDescription(editingItem.description);
      setMenuItems(editingItem.menu && editingItem.menu.length > 0 ? editingItem.menu : [""]);
      setImageFile(null);
    }
  }, [editingItem]);

  const addMenuItem = () => setMenuItems(prev => [...prev, ""]);
  const removeMenuItem = (index: number) => setMenuItems(prev => prev.filter((_, i) => i !== index));
  const updateMenuItem = (index: number, value: string) => {
    setMenuItems(prev => prev.map((item, i) => i === index ? value : item));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMenu = menuItems.filter(item => item.trim() !== "");
    if (cleanMenu.length === 0) return toast.error("Agrega al menos un ítem al menú");
    if (!editingItem && !imageFile) return toast.error("Agrega una imagen para el evento");

    setIsLoading(true);
    let loadingToast = toast.loading(editingItem ? "Actualizando evento..." : "Creando evento...");

    try {
      let finalImageUrl = editingItem?.image_url;
      if (imageFile) {
        if (editingItem && finalImageUrl) await deleteImageFromUrl(finalImageUrl, 'special-events');
        finalImageUrl = await uploadImage(imageFile, 'special-events');
      }

      const payload = { name, date: date || null, description, menu: cleanMenu, image_url: finalImageUrl };

      if (editingItem) {
        const { error } = await supabase.from('special_events').update(payload).eq('id', editingItem.id);
        if (error) throw error;
        toast.success("¡Evento actualizado!", { id: loadingToast });
      } else {
        const { error } = await supabase.from('special_events').insert([payload]);
        if (error) throw error;
        toast.success("¡Evento especial creado!", { id: loadingToast });
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium tracking-wide text-white/80">Nombre del Evento</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: Homenaje a la Música Italiana" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] transition-colors" required />
        </div>
        <div className="space-y-4">
          <label className="block text-sm font-medium tracking-wide text-white/80">Fecha del Evento (opcional)</label>
          <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Ej: Sábado 15 de Marzo" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] transition-colors" />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium tracking-wide text-white/80">Descripción del Evento</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Describe la experiencia del evento..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#C89F6A] resize-none transition-colors" required />
      </div>

      {/* Dynamic Menu Items Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium tracking-wide text-white/80">Menú del Evento ({menuItems.filter(i => i.trim()).length} ítems)</label>
          <button type="button" onClick={addMenuItem} className="flex items-center gap-1 text-xs text-[#C89F6A] hover:text-[#D5B285] transition-colors px-3 py-1.5 bg-[#C89F6A]/10 rounded-lg border border-[#C89F6A]/20 hover:border-[#C89F6A]/40">
            <Plus className="w-3 h-3" /> Agregar ítem
          </button>
        </div>
        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {menuItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 group">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#C89F6A]/20 flex items-center justify-center text-[#C89F6A] text-xs font-bold">
                {index + 1}
              </div>
              <input
                type="text"
                value={item}
                onChange={(e) => updateMenuItem(index, e.target.value)}
                placeholder={`Ej: Pizza Margarita Artesanal - ₡8.000`}
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#C89F6A] transition-colors"
              />
              {menuItems.length > 1 && (
                <button type="button" onClick={() => removeMenuItem(index)} className="flex-shrink-0 p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-4">
        <label className="block text-sm font-medium tracking-wide text-white/80">
          Imagen del Evento {editingItem && "- Selecciona una nueva para reemplazar"}
        </label>
        {editingItem && !imageFile && editingItem.image_url && (
          <div className="mb-4 relative w-48 h-64 rounded-xl overflow-hidden border border-white/20">
            <img src={editingItem.image_url} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs text-center py-2">Imagen Actual</div>
          </div>
        )}
        <div className="relative group cursor-pointer border-2 border-dashed border-white/10 hover:border-[#C89F6A]/50 bg-black/30 rounded-2xl p-10 flex flex-col items-center justify-center transition-all overflow-hidden h-48 text-center">
          <input type="file" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" required={!editingItem} />
          {imageFile ? (
            <div className="absolute inset-0 w-full h-full">
              <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50">
                <CheckCircle2 className="w-10 h-10 text-green-400 mb-2" />
                <p className="text-white font-medium">{imageFile.name}</p>
                <p className="text-white/60 text-sm mt-1">Haz clic para reemplazar</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-white/50 group-hover:text-[#C89F6A]/70 transition-colors">
              <div className="p-4 bg-white/5 rounded-full"><UploadCloud className="w-8 h-8" /></div>
              <div>
                <p className="font-semibold text-white/70">Arrastra la imagen aquí</p>
                <p className="text-sm mt-1">Recomendado: formato vertical (3:4)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex gap-4 justify-end">
        {editingItem && (
          <button type="button" onClick={onCancelEdit} className="px-6 py-4 text-white/60 hover:text-white transition-colors">Cancelar</button>
        )}
        <button type="submit" disabled={isLoading} className={`bg-[#C89F6A] hover:bg-[#D5B285] text-black font-semibold rounded-xl px-8 py-4 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(200,159,106,0.3)] w-full md:w-auto ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          {isLoading ? 'Guardando...' : editingItem ? 'Actualizar Evento' : 'Crear Evento Especial'}
        </button>
      </div>
    </form>
  );
}

function SpecialEventList({ events, isLoading, onDelete, onEdit }: any) {
  if (isLoading) return <div className="text-white/50 text-center py-20">Cargando eventos especiales...</div>;
  if (!events.length) return <div className="text-white/50 text-center py-20">No hay eventos especiales registrados aún.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((ev: any) => (
        <div key={ev.id} className="bg-black/40 border border-white/5 rounded-xl overflow-hidden group">
          <div className="relative h-56 overflow-hidden">
            <img src={ev.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-80" />
            <div className="absolute bottom-0 left-0 p-4 w-full">
              {ev.date && <p className="text-[#C89F6A] font-light text-xs uppercase tracking-wider mb-1">{ev.date}</p>}
              <h3 className="text-white font-medium text-lg truncate">{ev.name}</h3>
            </div>

            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(ev)} className="bg-white/10 hover:bg-[#C89F6A] text-white hover:text-black p-2 rounded-full backdrop-blur-md transition-colors shadow-lg">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => onDelete(ev)} className="bg-white/10 hover:bg-red-500 text-white p-2 rounded-full backdrop-blur-md transition-colors shadow-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Menu count badge */}
            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white/80 border border-white/10 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C89F6A]" /> {ev.menu?.length || 0} ítems
            </div>
          </div>
          <div className="p-4 text-sm text-white/50 bg-[#090B10]/50 border-t border-white/5">
            <p className="line-clamp-2 mb-3">{ev.description}</p>
            {ev.menu && ev.menu.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {ev.menu.slice(0, 3).map((item: string, i: number) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-[#C89F6A]/10 text-[#C89F6A] rounded-full border border-[#C89F6A]/20 truncate max-w-[150px]">{item}</span>
                ))}
                {ev.menu.length > 3 && <span className="text-[10px] px-2 py-0.5 text-white/40">+{ev.menu.length - 3} más</span>}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------
// TERRACE RESERVATIONS MANAGER
// ----------------------------------------------------

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  sin_confirmar:      { label: 'Sin Confirmar',      className: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  pendiente_revision: { label: 'Pendiente Revisión', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  pendiente_pago:     { label: 'Pendiente Pago',     className: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  aprobada:           { label: 'Pago Aprobado',        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  confirmed:          { label: 'Confirmada',           className: 'bg-lime-500/10 text-lime-400 border-lime-500/20' },
  pending:            { label: 'Pendiente',           className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  rechazada:           { label: 'Rechazada',            className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  cancelled:           { label: 'Cancelada',            className: 'bg-red-500/10 text-red-400 border-red-500/20' },
  pendiente_reembolso:    { label: 'Pendiente Reembolso',    className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  pendiente_cancelacion:  { label: 'Pendiente Cancelación',  className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  reembolsada:            { label: 'Reembolsada',            className: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
};

function TerraceReservationsManager({ subTab }: any) {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pendiente_revision'>(subTab === 'pending' ? 'pendiente_revision' : 'all');
  const [proofUrl, setProofUrl] = useState<string | null>(null);

  const fetchReservations = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('terrace_reservations')
      .select('*, terraces(title)')
      .order('created_at', { ascending: false });
    if (data) setReservations(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (subTab === "list") fetchReservations();
  }, [subTab]);

  const updateStatus = async (id: string, newStatus: string, clearPreviousStatus = false) => {
    const toastId = toast.loading("Actualizando estado...");
    try {
      const payload: Record<string, any> = { status: newStatus };
      if (clearPreviousStatus) payload.previous_status = null;
      const { error } = await supabase.from('terrace_reservations').update(payload).eq('id', id);
      if (error) throw error;
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, ...(clearPreviousStatus ? { previous_status: null } : {}) } : r));
      toast.success("Estado actualizado", { id: toastId });
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta reservación del historial?")) return;
    const toastId = toast.loading("Eliminando...");
    try {
      const { error } = await supabase.from('terrace_reservations').delete().eq('id', id);
      if (error) throw error;
      setReservations(prev => prev.filter(r => r.id !== id));
      toast.success("Eliminada correctamente", { id: toastId });
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const filtered = filter === 'pendiente_revision'
    ? reservations.filter(r => r.status === 'pendiente_revision')
    : reservations;

  const pendingCount = reservations.filter(r => r.status === 'pendiente_revision').length;

  if (isLoading) return <div className="text-white/50 text-center py-20">Cargando reservaciones...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
          Reservas de <span className="text-[#C89F6A] font-semibold">Terrazas</span>
        </h1>
        <p className="text-white/50 mt-2">Gestiona reservaciones y revisa comprobantes de pago.</p>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm transition-all border ${filter === 'all' ? 'bg-[#C89F6A]/20 text-[#C89F6A] border-[#C89F6A]/30' : 'text-white/50 bg-white/5 hover:bg-white/10 border-white/10'}`}>
          Todas
        </button>
        <button onClick={() => setFilter('pendiente_revision')} className={`px-4 py-2 rounded-lg text-sm transition-all border flex items-center gap-2 ${filter === 'pendiente_revision' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'text-white/50 bg-white/5 hover:bg-white/10 border-white/10'}`}>
          Pendientes de Revisión
          {pendingCount > 0 && <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount}</span>}
        </button>
      </div>

      {/* Modal comprobante */}
      <AnimatePresence>
        {proofUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setProofUrl(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#11141D] rounded-2xl overflow-hidden max-w-lg w-full border border-white/10"
              onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <span className="text-white font-medium text-sm">Comprobante de Pago</span>
                <button onClick={() => setProofUrl(null)} className="text-white/50 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <img src={proofUrl} alt="Comprobante" className="w-full object-contain max-h-[70vh]" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#11141D] border border-white/5 rounded-2xl overflow-hidden overflow-x-auto shadow-2xl">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-black/50 border-b border-white/10 text-xs uppercase tracking-widest text-[#C89F6A]">
              <th className="px-6 py-4 font-medium">Cliente</th>
              <th className="px-6 py-4 font-medium">Terraza & Fecha</th>
              <th className="px-6 py-4 font-medium">Personas</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-10 text-center text-white/40">
                {filter === 'pendiente_revision' ? 'No hay comprobantes pendientes de revisión.' : 'No hay reservas registradas.'}
              </td></tr>
            ) : (
              filtered.map((res: any) => {
                const cfg = STATUS_CONFIG[res.status] ?? { label: res.status, className: 'bg-white/5 text-white/50 border-white/10' };
                const isPendingReview = res.status === 'pendiente_revision';
                const isPendingRefund = res.status === 'pendiente_reembolso';
                const prevCfg = res.previous_status ? (STATUS_CONFIG[res.previous_status] ?? { label: res.previous_status, className: 'bg-white/5 text-white/50 border-white/10' }) : null;
                return (
                  <tr key={res.id} className={`hover:bg-white/5 transition-colors group ${isPendingReview ? 'bg-blue-500/5' : ''} ${isPendingRefund ? 'bg-purple-500/5' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{res.customer_name}</span>
                        <span className="text-white/40 text-xs">{res.customer_phone}</span>
                        {res.customer_email && <span className="text-white/30 text-xs">{res.customer_email}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white">{res.terraces?.title || 'Terraza'}</span>
                        <span className="text-[#C89F6A] font-bold text-xs">{res.reservation_date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/70">
                      <div className="flex flex-col gap-0.5">
                        <span>{res.adults_count} adultos</span>
                        {res.children_count > 0 && <span className="text-xs">{res.children_count} niños</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-green-400 font-medium">
                      ₡{(res.total_amount || res.adults_count * 3500).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${cfg.className}`}>
                          {cfg.label}
                        </span>
                        {isPendingRefund && prevCfg && (
                          <span className="text-xs text-white/40 flex items-center gap-1">
                            <span className="text-white/20">antes:</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${prevCfg.className}`}>
                              {prevCfg.label}
                            </span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        {res.payment_proof_url && (
                          <button onClick={() => setProofUrl(res.payment_proof_url)} className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-colors border border-blue-500/20" title="Ver comprobante">
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {isPendingReview && (
                          <>
                            <button onClick={() => updateStatus(res.id, 'aprobada')} className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20" title="Aprobar">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => updateStatus(res.id, 'rechazada')} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20" title="Rechazar">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {isPendingRefund && (
                          <button onClick={() => updateStatus(res.id, 'reembolsada', true)} className="p-2 bg-teal-500/10 text-teal-400 hover:bg-teal-500 hover:text-white rounded-lg transition-colors border border-teal-500/20" title="Marcar como reembolsada">
                            <RefreshCcw className="w-4 h-4" />
                          </button>
                        )}
                        {!isPendingReview && !isPendingRefund && res.status !== 'aprobada' && res.status !== 'rechazada' && res.status !== 'reembolsada' && res.status !== 'cancelled' && (
                          <>
                            {res.status !== 'confirmed' && (
                              <button onClick={() => updateStatus(res.id, 'confirmed')} className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20" title="Confirmar">
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {res.status !== 'cancelled' && (
                              <button onClick={() => updateStatus(res.id, 'cancelled')} className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20" title="Cancelar">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                        <button onClick={() => handleDelete(res.id)} className="p-2 bg-white/5 text-white/50 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-white/10 ml-1" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// BUSINESS RULES MANAGER
// ----------------------------------------------------

function BusinessRulesManager() {
  const [rules, setRules] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [adultPrice, setAdultPrice] = useState(3500);
  const [childPrice, setChildPrice] = useState(2500);
  const [openingTime, setOpeningTime] = useState("15:00:00");
  const [closingTime, setClosingTime] = useState("01:00:00");
  const [workingDays, setWorkingDays] = useState<string[]>([]);

  const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    const fetchRules = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from('business_rules').select('*').eq('id', 1).single();
      if (data && !error) {
        setRules(data);
        setAdultPrice(data.adult_price);
        setChildPrice(data.child_price);
        setOpeningTime(data.opening_time);
        setClosingTime(data.closing_time);
        setWorkingDays(data.working_days || []);
      }
      setIsLoading(false);
    };
    fetchRules();
  }, []);

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (workingDays.length === 0) return toast.error("Debes seleccionar al menos un día de trabajo.");

    setIsSaving(true);
    const toastId = toast.loading("Guardando reglas de negocio...");
    try {
      const payload = {
        adult_price: adultPrice,
        child_price: childPrice,
        opening_time: openingTime,
        closing_time: closingTime,
        working_days: workingDays
      };

      const { data, error } = await supabase.from('business_rules').update(payload).eq('id', 1).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Acceso denegado o no se encontró el registro para actualizar (Problema de permisos o RLS).");

      toast.success("Reglas guardadas exitosamente.", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Error al guardar.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="text-white/50 text-center py-20">Cargando reglas de negocio...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
          Reglas del <span className="text-[#C89F6A] font-semibold">Negocio</span>
        </h1>
        <p className="text-white/50 mt-2">
          Configura los precios base de las reservas, los días operativos y los horarios de la terraza.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-[#11141D] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl space-y-8">
        {/* Precios Section */}
        <div>
          <h3 className="text-xl text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <Sparkles className="text-[#C89F6A] w-5 h-5" /> Precios de Entrada / Reserva
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium tracking-wide text-white/80 mb-2">Precio por Adulto (₡)</label>
              <input
                type="number"
                min="0"
                required
                value={adultPrice}
                onChange={e => setAdultPrice(parseInt(e.target.value) || 0)}
                className="w-full bg-[#090B10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C89F6A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium tracking-wide text-white/80 mb-2">Precio por Niño (₡)</label>
              <input
                type="number"
                min="0"
                required
                value={childPrice}
                onChange={e => setChildPrice(parseInt(e.target.value) || 0)}
                className="w-full bg-[#090B10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C89F6A]"
              />
            </div>
          </div>
        </div>

        {/* Horarios Section */}
        <div>
          <h3 className="text-xl text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <Calendar className="text-[#C89F6A] w-5 h-5" /> Horarios de Operación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium tracking-wide text-white/80 mb-2">Hora de Apertura</label>
              <input
                type="time"
                required
                value={openingTime}
                onChange={e => setOpeningTime(e.target.value)}
                className="w-full bg-[#090B10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C89F6A] [color-scheme:dark]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium tracking-wide text-white/80 mb-2">Hora de Cierre</label>
              <input
                type="time"
                required
                value={closingTime}
                onChange={e => setClosingTime(e.target.value)}
                className="w-full bg-[#090B10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C89F6A] [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Días Operativos Section */}
        <div>
          <h3 className="text-xl text-white mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
            <CheckCircle2 className="text-[#C89F6A] w-5 h-5" /> Días de Trabajo de las Terrazas
          </h3>
          <p className="text-sm text-white/50 mb-4">Selecciona los días en los que se permite reservar terrazas.</p>
          <div className="flex flex-wrap gap-3">
            {DAYS_OF_WEEK.map(day => {
              const isActive = workingDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${isActive
                      ? 'bg-[#C89F6A] border-[#C89F6A] text-black shadow-lg shadow-[#C89F6A]/20'
                      : 'bg-[#090B10] border-white/10 text-white/50 hover:border-white/30'
                    }`}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-8 py-4 bg-[#C89F6A] hover:bg-[#D5B285] text-black font-semibold rounded-xl transition-colors shadow-lg shadow-[#C89F6A]/20 flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
function HomeManager({ setActiveTab, setActiveSubTab }: any) {
  const [stats, setStats] = useState({
    menuItems: 0,
    upcomingEvents: 0,
    reservations: 0,
    specialEvents: 0,
    incomeMonth: 0,
    customerVariation: 0,
    pendingReservations: 0,
    terraceData: [] as any[],
    monthlyTrend: [] as any[]
  });
  const [recentReservations, setRecentReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const now = new Date();
        const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString();

        const [
          { count: menuCount },
          { count: upcomingCount },
          { count: reservationsCount },
          { count: specialCount },
          { data: recentRes },
          { data: currentMonthRes },
          { data: lastMonthRes },
          { data: allEvents }
        ] = await Promise.all([
          supabase.from('menu_items').select('*', { count: 'exact', head: true }),
          supabase.from('upcoming_events').select('*', { count: 'exact', head: true }),
          supabase.from('terrace_reservations').select('*', { count: 'exact', head: true }),
          supabase.from('special_events').select('*', { count: 'exact', head: true }),
          supabase.from('terrace_reservations').select('*, terraces(title)').order('created_at', { ascending: false }).limit(5),
          supabase.from('terrace_reservations').select('*').gte('created_at', firstDayMonth),
          supabase.from('terrace_reservations').select('*').gte('created_at', firstDayLastMonth).lte('created_at', lastDayLastMonth),
          supabase.from('terrace_reservations').select('*, terraces(title)')
        ]);

        // Calculate Income
        const incomeCurrent = currentMonthRes?.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + Number(r.total_amount || 0), 0) || 0;

        // Variation
        const countCurrent = currentMonthRes?.length || 0;
        const countLast = lastMonthRes?.length || 0;
        const variation = countLast === 0 ? (countCurrent > 0 ? 100 : 0) : ((countCurrent - countLast) / countLast) * 100;

        // Terrace Popularity
        const terraceCounts: any = {};
        allEvents?.forEach(r => {
          const tName = r.terraces?.title || 'Otros';
          terraceCounts[tName] = (terraceCounts[tName] || 0) + 1;
        });
        const terraceData = Object.keys(terraceCounts).map(name => ({
          name,
          value: terraceCounts[name]
        })).sort((a, b) => b.value - a.value);

        // Monthly Trend (Last 6 months)
        const monthlyTrendData = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = d.toLocaleString('es-ES', { month: 'short' });
          const mStart = new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
          const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString();

          const monthRes = allEvents?.filter(r => r.created_at >= mStart && r.created_at <= mEnd);
          const income = monthRes?.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + Number(r.total_amount || 0), 0) || 0;

          monthlyTrendData.push({ name: monthName, income, reservations: monthRes?.length || 0 });
        }

        setStats({
          menuItems: menuCount || 0,
          upcomingEvents: upcomingCount || 0,
          reservations: reservationsCount || 0,
          specialEvents: specialCount || 0,
          pendingReservations: allEvents?.filter(r => r.status === 'pendiente_revision').length || 0,
          incomeMonth: incomeCurrent,
          customerVariation: variation,
          terraceData,
          monthlyTrend: monthlyTrendData
        });
        setRecentReservations(recentRes || []);
      } catch (e) {
        console.error("Error al cargar estadísticas", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const topMetrics = [
    {
      title: "Ingresos del Mes",
      value: `₡${isLoading ? "..." : stats.incomeMonth.toLocaleString()}`,
      label: "Mes Actual",
      variation: stats.customerVariation !== 0
        ? `${stats.customerVariation >= 0 ? '+' : ''}${stats.customerVariation.toFixed(0)}% vs mes ant.`
        : undefined,
      color: "from-[#C89F6A]/20 to-orange-500/10",
      borderColor: "hover:border-[#C89F6A]/30",
      icon: <Store className="w-5 h-5 text-[#C89F6A]" />,
      type: "income"
    },
    {
      title: "Crecimiento Clientes",
      value: isLoading ? "..." : `${stats.customerVariation >= 0 ? '+' : ''}${stats.customerVariation.toFixed(1)}%`,
      label: stats.customerVariation >= 0 ? 'Crecimiento' : 'Descenso',
      variation: stats.customerVariation >= 0 ? '↑' : '↓',
      color: "from-blue-500/10 to-indigo-500/10",
      borderColor: "hover:border-blue-500/30",
      icon: <Calendar className="w-5 h-5 text-blue-400" />,
      type: "growth"
    },
    {
      title: "Reservas Pendientes",
      value: stats.pendingReservations,
      label: "Acción Requerida",
      icon: <Eye className="w-6 h-6 text-blue-400" />,
      tab: "terrace_reservations",
      subTab: "pending",
      color: "from-blue-500/20 to-blue-900/10",
      borderColor: "hover:border-blue-500/50",
      isAlert: stats.pendingReservations > 0,
      type: "action"
    },
    {
      title: "Reservas Totales",
      value: stats.reservations,
      label: "Histórico",
      icon: <CalendarCheck className="w-6 h-6 text-green-400" />,
      tab: "terrace_reservations",
      subTab: "list",
      color: "from-green-500/10 to-[#090B10]",
      borderColor: "hover:border-green-500/30",
      type: "summary"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-3 tracking-tight">
            Bienvenido, <span className="text-[#C89F6A] font-semibold">Admin</span>
          </h1>
          <p className="text-white/40 text-lg">
            Análisis detallado de <span className="text-white/60 italic font-medium">Como Caído del Cielo</span>.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
          <div className="w-12 h-12 rounded-full bg-[#C89F6A]/20 flex items-center justify-center text-[#C89F6A]">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Estado del Sistema</p>
            <p className="text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Operativo
            </p>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {topMetrics.map((metric, i) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => metric.tab && (setActiveTab(metric.tab as any), setActiveSubTab((metric as any).subTab || 'list'))}
            className={`p-6 rounded-3xl bg-gradient-to-br ${metric.color} border border-white/5 ${metric.borderColor} transition-all text-left relative overflow-hidden shadow-2xl group ${metric.tab ? 'cursor-pointer hover:bg-white/5' : ''} ${metric.isAlert ? 'ring-1 ring-blue-500/40' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-black/40 rounded-lg group-hover:scale-110 transition-transform">
                {metric.icon}
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter ${metric.isAlert ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/10 text-white/60'}`}>
                {metric.label}
              </span>
            </div>

            <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] mb-1">{metric.title}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold tracking-tighter ${metric.isAlert ? 'text-blue-400' : 'text-white'}`}>
                {metric.value}
              </p>
              {metric.variation && (
                <span className={`text-[10px] font-bold ${metric.type === 'income' ? 'text-[#C89F6A]' : (stats.customerVariation >= 0 ? 'text-green-400' : 'text-red-400')}`}>
                  {metric.variation}
                </span>
              )}
            </div>

            {metric.type === 'income' && !isLoading && (
              <div className="mt-4 flex items-center gap-2">
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: stats.incomeMonth > 0 ? '100%' : '0%' }}
                    className="h-full bg-gradient-to-r from-[#C89F6A] to-orange-400"
                  />
                </div>
              </div>
            )}
            
            {(metric as any).isAlert && (
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl -mr-10 -mt-10" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/40 border border-white/5 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#C89F6A]/20" />
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h3 className="text-white font-light text-xl flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-[#C89F6A]" /> Tendencia de <span className="text-[#C89F6A] font-semibold">Reservas</span>
              </h3>
              <p className="text-white/30 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Últimos 6 meses</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C89F6A]" />
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Ingresos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Reservas</span>
              </div>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.monthlyTrend}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C89F6A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C89F6A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 'bold' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#ffffff40', fontSize: 10 }}
                  tickFormatter={(val) => `₡${(val / 1000)}k`}
                />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#090B10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#EFEAE2' }}
                  cursor={{ stroke: '#C89F6A', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="income" stroke="#C89F6A" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="reservations" stroke="#3b82f6" strokeWidth={2} fill="transparent" dot={{ r: 4, fill: '#3b82f6' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Terrace Popularity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/40 border border-white/5 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20" />
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-white font-light text-xl flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#C89F6A]" /> Popularidad de <span className="text-[#C89F6A] font-semibold">Terrazas</span>
              </h3>
              <p className="text-white/30 text-[10px] uppercase font-bold tracking-[0.2em] mt-1">Distribución histórica</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
            <div className="h-[240px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.terraceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {stats.terraceData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={[
                        '#C89F6A', '#D5B285', '#B68E56', '#947547', '#3b82f6'
                      ][index % 5]} stroke="transparent" />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: '#090B10', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none hidden md:block">
                <p className="text-2xl font-bold text-white">{stats.reservations}</p>
                <p className="text-[8px] text-white/40 uppercase font-bold tracking-widest">Total</p>
              </div>
            </div>

            <div className="space-y-4">
              {stats.terraceData.slice(0, 4).map((item, i) => (
                <div key={item.name} className="flex flex-col gap-1 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ['#C89F6A', '#D5B285', '#B68E56', '#947547'][i % 4] }} />
                      <span className="text-white/60 text-[11px] font-bold uppercase tracking-wider truncate w-32">{item.name}</span>
                    </div>
                    <span className="text-white font-bold text-xs">{item.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / (stats.reservations || 1)) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-[#C89F6A]"
                    />
                  </div>
                </div>
              ))}
              {stats.terraceData.length === 0 && <p className="text-white/20 text-xs text-center py-10">Sin datos de terrazas</p>}
              {stats.terraceData.length > 4 && <p className="text-[10px] text-white/30 italic text-right">+ {stats.terraceData.length - 4} más</p>}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-light text-white flex items-center gap-3">
              <CalendarCheck className="w-6 h-6 text-[#C89F6A]" /> Reservas <span className="text-[#C89F6A] font-semibold">Recientes</span>
            </h2>
            <button
              onClick={() => { setActiveTab('terrace_reservations'); setActiveSubTab('list'); }}
              className="text-xs text-[#C89F6A] hover:underline"
            >
              Ver todas
            </button>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                  <tr>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Terraza</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-6 py-4 h-16 bg-white/5"></td>
                      </tr>
                    ))
                  ) : recentReservations.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-white/30 italic">No hay reservas recientes.</td>
                    </tr>
                  ) : (
                    recentReservations.map((res: any) => {
                      const cfg = STATUS_CONFIG[res.status] ?? { label: res.status, className: 'bg-white/5 text-white/50 border-white/10' };
                      return (
                        <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-white font-medium text-sm">{res.customer_name}</p>
                            <p className="text-white/30 text-xs mt-0.5">{res.customer_phone}</p>
                          </td>
                          <td className="px-6 py-4 text-white/70 text-sm">{res.terraces?.title || 'Terraza'}</td>
                          <td className="px-6 py-4 text-[#C89F6A] font-bold text-xs">{res.reservation_date}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${cfg.className}`}>
                              {cfg.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions / Content Management */}
        <div className="space-y-6">
          <h2 className="text-2xl font-light text-white flex items-center gap-3">
             <ChefHat className="w-6 h-6 text-[#C89F6A]" /> Gestión <span className="text-[#C89F6A] font-semibold">Contenido</span>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "Menú Rincón", value: stats.menuItems, icon: <ChefHat className="w-5 h-5 text-[#C89F6A]" />, tab: "menu", subTab: "list", createLabel: "Nuevo Platillo" },
              { label: "Próximos Eventos", value: stats.upcomingEvents, icon: <Calendar className="w-5 h-5 text-blue-400" />, tab: "upcoming", subTab: "list", createLabel: "Anunciar" },
              { label: "Eventos Especiales", value: stats.specialEvents, icon: <Sparkles className="w-5 h-5 text-purple-400" />, tab: "special_events", subTab: "list", createLabel: "Crear" },
              { label: "Configuración", value: null, icon: <Store className="w-5 h-5 text-green-400" />, tab: "business_rules", subTab: "settings" }
            ].map((action, i) => (
              <motion.div
                key={action.label}
                whileHover={{ scale: 1.01 }}
                className="group p-4 bg-white/5 border border-white/5 hover:border-[#C89F6A]/20 rounded-3xl transition-all shadow-xl flex items-center justify-between gap-4"
              >
                 <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => { setActiveTab(action.tab as any); setActiveSubTab(action.subTab as any); }}>
                    <div className="p-3 bg-black/40 rounded-2xl group-hover:bg-[#C89F6A]/10 transition-colors">
                      {action.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-[#C89F6A] transition-colors">{action.label}</p>
                      {action.value !== null && (
                         <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{action.value} items registrados</p>
                      )}
                    </div>
                 </div>
                 
                 {action.createLabel && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveTab(action.tab as any); setActiveSubTab('create'); }}
                      className="p-2 h-10 px-4 bg-white/5 hover:bg-[#C89F6A] text-white hover:text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/10 hover:border-transparent flex items-center gap-2"
                    >
                      <Plus className="w-3 h-3" /> {action.createLabel}
                    </button>
                 )}
              </motion.div>
            ))}
          </div>

          {/* Tips / Info Section */}
          <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-[#C89F6A]/20 to-transparent border border-[#C89F6A]/20 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-[#C89F6A] font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <Store className="w-4 h-4" /> Tip de Admin
              </h4>
              <p className="text-white/60 text-sm leading-relaxed">
                El análisis mes a mes te ayuda a predecir épocas de alta demanda y ajustar el personal necesario.
              </p>
            </div>
            <ChefHat className="absolute -bottom-4 -right-4 w-24 h-24 text-[#C89F6A]/10 transform -rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
