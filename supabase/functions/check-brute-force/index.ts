import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;
const BLOCK_HOURS = 1;

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

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Extraer IP: Cloudflare > Vercel > x-forwarded-for > fallback
  const ip =
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  let body: { action: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { action } = body;

  if (!["check", "record_failure", "record_success"].includes(action)) {
    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── CHECK ───────────────────────────────────────────────────────────────────
  if (action === "check") {
    // 1. ¿Está la IP actualmente bloqueada?
    const { data: block } = await supabase
      .from("blocked_ips")
      .select("blocked_until")
      .eq("ip_address", ip)
      .gt("blocked_until", new Date().toISOString())
      .maybeSingle();

    if (block) {
      const minutesRemaining = Math.ceil(
        (new Date(block.blocked_until).getTime() - Date.now()) / 60_000,
      );
      return new Response(
        JSON.stringify({
          blocked: true,
          minutesRemaining,
          message: `Demasiados intentos fallidos. Intenta de nuevo en ${minutesRemaining} minuto${minutesRemaining !== 1 ? "s" : ""}.`,
        }),
        { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    // 2. Contar intentos fallidos en la ventana de tiempo
    const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
    const { count } = await supabase
      .from("login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip_address", ip)
      .eq("succeeded", false)
      .gte("attempted_at", windowStart);

    // 3. Si alcanzó el límite, bloquear la IP
    if ((count ?? 0) >= MAX_ATTEMPTS) {
      const blockedUntil = new Date(Date.now() + BLOCK_HOURS * 3_600_000).toISOString();
      await supabase.from("blocked_ips").upsert({
        ip_address: ip,
        blocked_at: new Date().toISOString(),
        blocked_until: blockedUntil,
        reason: "too_many_failed_attempts",
      });

      return new Response(
        JSON.stringify({
          blocked: true,
          minutesRemaining: BLOCK_HOURS * 60,
          message: `Demasiados intentos fallidos. Intenta de nuevo en ${BLOCK_HOURS} hora.`,
        }),
        { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ blocked: false }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  // ── RECORD_FAILURE ───────────────────────────────────────────────────────────
  if (action === "record_failure") {
    await supabase.from("login_attempts").insert({
      ip_address: ip,
      succeeded: false,
    });

    // Limpieza: eliminar registros mayores a 24h para esta IP
    const cutoff = new Date(Date.now() - 24 * 3_600_000).toISOString();
    await supabase
      .from("login_attempts")
      .delete()
      .eq("ip_address", ip)
      .lt("attempted_at", cutoff);

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  // ── RECORD_SUCCESS ───────────────────────────────────────────────────────────
  if (action === "record_success") {
    await supabase.from("login_attempts").insert({
      ip_address: ip,
      succeeded: true,
    });

    // Levantar el bloqueo activo para esta IP (si existía)
    await supabase.from("blocked_ips").delete().eq("ip_address", ip);

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ error: "Unhandled action" }), {
    status: 500,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
