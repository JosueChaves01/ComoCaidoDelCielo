import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

interface AdminGuardState {
  isAdmin: boolean;
  loading: boolean;
  user: User | null;
}

export function useAdminGuard(): AdminGuardState {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function checkAdminRole(sessionUser: User | null) {
      if (!sessionUser) {
        if (mounted) {
          setUser(null);
          setIsAdmin(false);
          setLoading(false);
          navigate("/admin", { replace: true });
        }
        return;
      }

      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", sessionUser.id)
        .maybeSingle();

      if (!mounted) return;

      if (!adminRow) {
        // Sesión válida pero no es admin: cerrar sesión y redirigir
        // Usamos sessionStorage porque signOut() dispara onAuthStateChange(SIGNED_OUT)
        // que sobreescribiría el navigation state antes de que AdminLogin lo lea.
        sessionStorage.setItem("adminRedirectReason", "unauthorized");
        await supabase.auth.signOut();
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        navigate("/admin", { replace: true });
        return;
      }

      setUser(sessionUser);
      setIsAdmin(true);
      setLoading(false);
    }

    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        checkAdminRole(session?.user ?? null);
      }
    });

    // Escuchar cambios de sesión en tiempo real (expiración de token, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        checkAdminRole(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return { isAdmin, loading, user };
}
