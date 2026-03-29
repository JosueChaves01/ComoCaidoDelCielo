import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Las credenciales de Supabase no están configuradas en el archivo .env");
}

export const supabase = createClient(
  supabaseUrl || "https://dummy-url.supabase.co", // Dummy URL para que no crashee si no hay .env aún
  supabaseAnonKey || "dummy-key"
);
