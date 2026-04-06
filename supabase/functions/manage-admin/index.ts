import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type Action = "list" | "resolve_email" | "add" | "remove";

interface RequestBody {
  action: Action;
  email?: string;
  target_user_id?: string;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const masked = local.slice(0, 2) + "***";
  return `${masked}@${domain}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── Verificar JWT del caller ─────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }
  const callerJwt = authHeader.slice(7);

  // Cliente con service_role para operaciones privilegiadas
  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Cliente con anon key para validar el JWT del caller
  const anonClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { auth: { persistSession: false } },
  );

  const { data: { user: callerUser }, error: authError } =
    await anonClient.auth.getUser(callerJwt);

  if (authError || !callerUser) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Verificar que el caller es administrador
  const { data: callerAdmin } = await serviceClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", callerUser.id)
    .maybeSingle();

  if (!callerAdmin) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 403,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── Parsear body ─────────────────────────────────────────────────────────────
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { action } = body;

  // ── LIST ─────────────────────────────────────────────────────────────────────
  if (action === "list") {
    const { data: admins, error } = await serviceClient
      .from("admin_users")
      .select("user_id, assigned_by, created_at")
      .order("created_at", { ascending: true });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Resolver emails de auth.users via admin API
    const enriched = await Promise.all(
      (admins ?? []).map(async (admin) => {
        const { data } = await serviceClient.auth.admin.getUserById(admin.user_id);
        return {
          user_id: admin.user_id,
          masked_email: data.user?.email ? maskEmail(data.user.email) : "***",
          assigned_by: admin.assigned_by,
          created_at: admin.created_at,
          is_self: admin.user_id === callerUser.id,
        };
      }),
    );

    return new Response(JSON.stringify({ admins: enriched }), {
      status: 200,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── RESOLVE_EMAIL ────────────────────────────────────────────────────────────
  if (action === "resolve_email") {
    const email = body.email?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "invalid_email" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const { data } = await serviceClient.auth.admin.listUsers();
    const targetUser = data?.users?.find((u) => u.email === email);

    if (!targetUser) {
      return new Response(JSON.stringify({ error: "user_not_found" }), {
        status: 404,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ user_id: targetUser.id, masked_email: maskEmail(email) }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  // ── ADD ──────────────────────────────────────────────────────────────────────
  if (action === "add") {
    const email = body.email?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "invalid_email" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Resolver email → user_id (jamás aceptamos user_id directamente del cliente)
    const { data: usersData } = await serviceClient.auth.admin.listUsers();
    const targetUser = usersData?.users?.find((u) => u.email === email);

    if (!targetUser) {
      return new Response(JSON.stringify({ error: "user_not_found" }), {
        status: 404,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // ¿Ya es admin?
    const { data: existing } = await serviceClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", targetUser.id)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ error: "already_admin" }), {
        status: 409,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const { error: insertError } = await serviceClient.from("admin_users").insert({
      user_id: targetUser.id,
      assigned_by: callerUser.id,
    });

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ ok: true, user_id: targetUser.id }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  // ── REMOVE ───────────────────────────────────────────────────────────────────
  if (action === "remove") {
    const { target_user_id } = body;

    if (!target_user_id) {
      return new Response(JSON.stringify({ error: "target_user_id required" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Impedir auto-eliminación
    if (target_user_id === callerUser.id) {
      return new Response(JSON.stringify({ error: "cannot_remove_self" }), {
        status: 400,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const { data: targetAdmin } = await serviceClient
      .from("admin_users")
      .select("user_id")
      .eq("user_id", target_user_id)
      .maybeSingle();

    if (!targetAdmin) {
      return new Response(JSON.stringify({ error: "not_admin" }), {
        status: 404,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const { error: deleteError } = await serviceClient
      .from("admin_users")
      .delete()
      .eq("user_id", target_user_id);

    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ error: "Invalid action" }), {
    status: 400,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
