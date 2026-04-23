import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface VerifyInput {
  reservation_id: string;
  confirmation_code: string;
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

  let input: VerifyInput;
  try {
    input = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { reservation_id, confirmation_code } = input;

  if (!reservation_id || !confirmation_code) {
    return new Response(JSON.stringify({ error: "Missing reservation_id or confirmation_code" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── Validar formato UUID ───────────────────────────────────────────────────
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(reservation_id)) {
    return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // ── Obtener reserva ────────────────────────────────────────────────────────
  const { data: reservation, error: fetchError } = await serviceClient
    .from("terrace_reservations")
    .select("id, terrace_id, reservation_date, status, confirmation_code, confirmation_code_expires_at, customer_email, customer_name, total_amount")
    .eq("id", reservation_id)
    .maybeSingle();

  if (fetchError) {
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (!reservation) {
    return new Response(JSON.stringify({ error: "RESERVATION_NOT_FOUND" }), {
      status: 404,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── Verificar estado ───────────────────────────────────────────────────────
  if (reservation.status !== "sin_confirmar") {
    if (reservation.status === "pendiente_pago" || reservation.status === "pendiente_revision" || reservation.status === "aprobada" || reservation.status === "confirmed") {
      return new Response(JSON.stringify({
        error: "ALREADY_CONFIRMED",
        status: reservation.status,
      }), {
        status: 409,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "INVALID_STATUS", status: reservation.status }), {
      status: 409,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── Verificar código y expiración ─────────────────────────────────────────
  const now = new Date();
  const expiresAt = new Date(reservation.confirmation_code_expires_at);

  if (now > expiresAt) {
    return new Response(JSON.stringify({ error: "CODE_EXPIRED" }), {
      status: 410,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (reservation.confirmation_code !== confirmation_code) {
    return new Response(JSON.stringify({ error: "INVALID_CODE" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── Verificar conflicto de disponibilidad (otra reserva pudo haber ocupado la terraza) ──
  const { data: conflict, error: conflictError } = await serviceClient
    .from("terrace_reservations")
    .select("id")
    .eq("terrace_id", reservation.terrace_id)
    .eq("reservation_date", reservation.reservation_date)
    .not("status", "in", "('cancelled','rechazada','reembolsada','sin_confirmar')")
    .neq("id", reservation_id)
    .maybeSingle();

  if (conflictError) {
    console.error("Conflict check error:", conflictError);
  }

  if (conflict) {
    // La terraza fue tomada por otra persona → cancelar esta reserva
    await serviceClient
      .from("terrace_reservations")
      .update({ status: "cancelled", confirmation_code: null, confirmation_code_expires_at: null })
      .eq("id", reservation_id);

    return new Response(JSON.stringify({ error: "TERRACE_TAKEN" }), {
      status: 409,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── Confirmar reserva ─────────────────────────────────────────────────────
  const payment_deadline = new Date(Date.now() + 20 * 60 * 1000).toISOString();

  const { error: updateError } = await serviceClient
    .from("terrace_reservations")
    .update({
      status: "pendiente_pago",
      confirmation_code: null,
      confirmation_code_expires_at: null,
      payment_deadline,
    })
    .eq("id", reservation_id);

  if (updateError) {
    return new Response(JSON.stringify({ error: "Failed to confirm reservation" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      status: "pendiente_pago",
      customer_email: reservation.customer_email,
      customer_name: reservation.customer_name,
      total_amount: reservation.total_amount,
      payment_deadline,
    }),
    { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
  );
});
