import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface ReservationInput {
  terrace_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  adults_count: number;
  children_count: number;
  reservation_date: string;
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function formatDateForEmail(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return new Intl.DateTimeFormat("es-CR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  const masked = local.slice(0, 2) + "***";
  return `${masked}@${domain}`;
}

async function sendConfirmationEmail({
  to,
  customerName,
  code,
  reservationDate,
  totalAmount,
  reservationId,
}: {
  to: string;
  customerName: string;
  code: string;
  reservationDate: string;
  totalAmount: number;
  reservationId: string;
}): Promise<void> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY not configured");
  }

  const formattedDate = formatDateForEmail(reservationDate);
  const maskedTo = maskEmail(to);

  const html = `<html>
<body style="font-family:Georgia,serif;background:#FAF7F2;margin:0;padding:20px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
    <div style="background:#3B2A22;padding:28px;text-align:center">
      <h1 style="color:#fff;font-size:22px;margin:0">Como Caído <span style="color:#C89F6A">del Cielo</span></h1>
    </div>
    <div style="padding:28px">
      <p style="color:#2A2419">Hola, <strong>${customerName}</strong></p>
      <p style="color:#6B5744">Tu reserva para el <strong>${formattedDate}</strong> está casi lista. Ingresa este código en el sitio para confirmarla:</p>
      <div style="background:#3B2A22;border-radius:10px;padding:24px;text-align:center;margin:20px 0">
        <span style="color:#C89F6A;font-size:40px;font-weight:bold;letter-spacing:.3em;font-family:monospace">${code}</span>
      </div>
      <div style="background:#FFF8F0;border:1px solid #E8DED0;border-radius:8px;padding:14px">
        <p style="color:#9B8677;font-size:13px;margin:0">⏰ Código válido por <strong>20 minutos</strong>.</p>
      </div>
      <p style="color:#6B5744;margin-top:16px">Total: <strong>₡${totalAmount.toLocaleString("es-CR")}</strong></p>
      <hr style="border:none;border-top:1px solid #E8DED0;margin:20px 0">
      <p style="color:#9B8677;font-size:12px;margin:0">Si cierras el sitio y vuelves luego, usa este ID de reserva para continuar:</p>
      <p style="color:#3B2A22;font-size:13px;font-family:monospace;background:#F5EFE6;padding:8px 12px;border-radius:6px;margin:8px 0 0;letter-spacing:.05em">${reservationId}</p>
    </div>
    <div style="background:#3B2A22;padding:16px;text-align:center">
      <p style="color:rgba(255,255,255,.5);font-size:12px;margin:0">Como Caído del Cielo · Reservas</p>
    </div>
  </div>
</body>
</html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Como Caído del Cielo <reservas@resend.dev>",
      to: [to],
      subject: `Confirma tu reserva - Código: ${code}`,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }
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

  // ── Parsear body ─────────────────────────────────────────────────────────────
  let input: ReservationInput;
  try {
    input = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { terrace_id, customer_name, customer_phone, customer_email, adults_count, children_count, reservation_date } = input;

  // ── Validaciones básicas ────────────────────────────────────────────────────
  if (!terrace_id || !customer_name || !customer_phone || !customer_email || !adults_count || !reservation_date) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
    return new Response(JSON.stringify({ error: "Invalid email format" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const phoneRegex = /^(\d{4})[- ]?(\d{4})$|^\d{8}$/;
  if (!phoneRegex.test(customer_phone.trim())) {
    return new Response(JSON.stringify({ error: "Invalid phone format" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── Cliente service_role ────────────────────────────────────────────────────
  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // ── Verificar disponibilidad ───────────────────────────────────────────────
  const { data: existing, error: checkError } = await serviceClient
    .from("terrace_reservations")
    .select("id")
    .eq("terrace_id", terrace_id)
    .eq("reservation_date", reservation_date)
    .not("status", "in", "('cancelled','rechazada','reembolsada')")
    .maybeSingle();

  if (checkError) {
    return new Response(JSON.stringify({ error: "Database error checking availability" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  if (existing) {
    return new Response(JSON.stringify({ error: "TERRACE_ALREADY_BOOKED" }), {
      status: 409,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── Obtener precios y calcular total ───────────────────────────────────────
  const { data: rules, error: rulesError } = await serviceClient
    .from("business_rules")
    .select("adult_price, child_price")
    .eq("id", 1)
    .maybeSingle();

  if (rulesError || !rules) {
    return new Response(JSON.stringify({ error: "Could not fetch pricing rules" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const total_amount = (adults_count * rules.adult_price) + (children_count * rules.child_price);
  const confirmation_code = generateCode();
  const confirmation_code_expires_at = new Date(Date.now() + 20 * 60 * 1000).toISOString();

  // ── Crear reserva ───────────────────────────────────────────────────────────
  const { data: reservation, error: insertError } = await serviceClient
    .from("terrace_reservations")
    .insert({
      terrace_id,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email.trim().toLowerCase(),
      adults_count,
      children_count,
      reservation_date,
      total_amount,
      status: "sin_confirmar",
      confirmation_code,
      confirmation_code_expires_at,
    })
    .select("id, customer_name, customer_email, reservation_date, total_amount")
    .returns()
    .single();

  if (insertError) {
    console.error("Insert error:", insertError);
    return new Response(JSON.stringify({ error: "Failed to create reservation" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // ── Enviar email ────────────────────────────────────────────────────────────
  try {
    await sendConfirmationEmail({
      to: customer_email,
      customerName: customer_name,
      code: confirmation_code,
      reservationDate: reservation_date,
      totalAmount: total_amount,
      reservationId: reservation.id,
    });
  } catch (emailError: any) {
    // El email falló pero la reserva se creó — lo logueamos pero no revertimos
    console.error("Email send failed:", emailError.message);
    // No retornamos error al cliente para no dejarlo colgado
    // El cliente puede reenviar el código desde Mis Reservas
  }

  return new Response(
    JSON.stringify({
      reservation_id: reservation.id,
      customer_email: reservation.customer_email,
      reservation_date: reservation.reservation_date,
      total_amount: reservation.total_amount,
      confirmation_code_expires_at,
    }),
    { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
  );
});
