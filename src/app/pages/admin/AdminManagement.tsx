import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, UserPlus, Trash2, Loader2, AlertTriangle, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../../../lib/supabase";
import { addAdminSchema } from "../../../lib/adminSchemas";

const MANAGE_ADMIN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-admin`;

interface AdminUser {
  user_id: string;
  masked_email: string;
  assigned_by: string | null;
  created_at: string;
  is_self: boolean;
}

type ConfirmState = { target: AdminUser } | null;

async function callManageAdmin(action: string, payload: Record<string, unknown> = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("No autenticado");

  const res = await fetch(MANAGE_ADMIN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ action, ...payload }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? "Error desconocido");
  return json;
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<ConfirmState>(null);
  const [removing, setRemoving] = useState(false);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const data = await callManageAdmin("list");
      setAdmins(data.admins ?? []);
    } catch (err: any) {
      toast.error(`Error al cargar administradores: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = addAdminSchema.safeParse({ email: newEmail });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setAdding(true);
    try {
      // Primero resolver email para mostrar confirmación con email enmascarado
      const resolved = await callManageAdmin("resolve_email", { email: parsed.data.email });

      // Confirmar con el admin antes de agregar
      const confirmed = window.confirm(
        `¿Agregar a ${resolved.masked_email} como administrador?`
      );
      if (!confirmed) {
        setAdding(false);
        return;
      }

      await callManageAdmin("add", { email: parsed.data.email });
      toast.success(`Administrador agregado correctamente.`);
      setNewEmail("");
      await fetchAdmins();
    } catch (err: any) {
      const messages: Record<string, string> = {
        user_not_found: "No existe ningún usuario con ese correo.",
        already_admin: "Este usuario ya es administrador.",
        unauthorized: "No tienes permisos para esta acción.",
        invalid_email: "El correo electrónico no es válido.",
      };
      toast.error(messages[err.message] ?? err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleConfirmRemove = async () => {
    if (!confirmRemove) return;
    setRemoving(true);
    try {
      await callManageAdmin("remove", { target_user_id: confirmRemove.target.user_id });
      toast.success("Administrador eliminado.");
      setConfirmRemove(null);
      await fetchAdmins();
    } catch (err: any) {
      const messages: Record<string, string> = {
        cannot_remove_self: "No puedes eliminarte a ti mismo.",
        not_admin: "Este usuario ya no es administrador.",
        unauthorized: "No tienes permisos para esta acción.",
      };
      toast.error(messages[err.message] ?? err.message);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
          Gestión de <span className="text-[#C89F6A] font-semibold">Administradores</span>
        </h1>
        <p className="text-white/50 mt-2">
          Solo administradores existentes pueden agregar o eliminar accesos. Los cambios quedan registrados.
        </p>
      </div>

      {/* Formulario para agregar nuevo admin */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#C89F6A] mb-4 flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Agregar Administrador
        </h2>
        <form onSubmit={handleAddAdmin} className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40">
              <Mail className="h-4 w-4" />
            </div>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#C89F6A]/50 focus:border-[#C89F6A] transition-all text-sm"
              required
              disabled={adding}
            />
          </div>
          <button
            type="submit"
            disabled={adding || !newEmail.trim()}
            className="flex items-center gap-2 px-5 py-3 bg-[#C89F6A] hover:bg-[#D5B285] text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Agregar
          </button>
        </form>
        <p className="text-white/30 text-xs mt-3">
          El usuario debe tener una cuenta registrada en Supabase Auth antes de poder ser agregado como administrador.
        </p>
      </div>

      {/* Lista de administradores */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C89F6A]" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">
            Administradores Activos
          </h2>
          {!loading && (
            <span className="ml-auto text-xs text-white/30 bg-white/10 px-2 py-0.5 rounded-full">
              {admins.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#C89F6A] animate-spin" />
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <ShieldCheck className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No hay administradores registrados.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {admins.map((admin) => (
              <motion.li
                key={admin.user_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C89F6A]/20 border border-[#C89F6A]/30 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#C89F6A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/90">{admin.masked_email}</p>
                    <p className="text-xs text-white/30">
                      {admin.is_self ? (
                        <span className="text-[#C89F6A]/70">Tú</span>
                      ) : (
                        `Agregado ${new Date(admin.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}`
                      )}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setConfirmRemove({ target: admin })}
                  disabled={admin.is_self}
                  title={admin.is_self ? "No puedes eliminarte a ti mismo" : "Eliminar administrador"}
                  className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <AnimatePresence>
        {confirmRemove && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => !removing && setConfirmRemove(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0E1018] border border-white/10 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Eliminar Administrador</h3>
              </div>

              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                ¿Estás seguro de que deseas eliminar a{" "}
                <span className="text-white font-medium">{confirmRemove.target.masked_email}</span>{" "}
                como administrador? Esta acción es reversible pero inmediata.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmRemove(null)}
                  disabled={removing}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-all text-sm font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmRemove}
                  disabled={removing}
                  className="flex-1 py-3 rounded-xl bg-red-500/80 hover:bg-red-500 text-white transition-all text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
