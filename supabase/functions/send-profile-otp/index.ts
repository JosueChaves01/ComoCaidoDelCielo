import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const { full_name, whatsapp_number } = await req.json();

  if (!full_name || !whatsapp_number) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const serviceClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Save verification request
  const { error: dbError } = await serviceClient
    .from("profile_verifications")
    .insert({
      user_id: user.id,
      whatsapp_number,
      code,
      expires_at: expiresAt,
    });

  if (dbError) {
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Send email via Resend
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Como Caído del Cielo <verificacion@resend.dev>",
      to: [user.email],
      subject: `Verifica tu perfil - Código: ${code}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>Hola, ${full_name}</h2>
          <p>Para completar la verificación de tu perfil y vincular tu número de WhatsApp <strong>${whatsapp_number}</strong>, ingresa el siguiente código:</p>
          <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 8px; letter-spacing: 5px;">
            ${code}
          </div>
          <p>Este código expira en 10 minutos.</p>
        </div>
      `,
    }),
  });

  if (!emailRes.ok) {
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
});
