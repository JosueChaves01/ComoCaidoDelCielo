import { z } from "zod";

// Helper: campo URL opcional que también acepta string vacío
const optionalUrl = z.union([z.url(), z.literal(""), z.undefined()]);

// ── Eventos próximos ──────────────────────────────────────────────────────────
export const upcomingEventSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200).trim(),
  event_date: z.string().min(1, "La fecha es requerida"),
  poster_url: optionalUrl,
  description: z.string().max(1000).trim().optional(),
});

// ── Carrusel histórico ────────────────────────────────────────────────────────
export const carouselEventSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200).trim(),
  date: z.string().min(1, "La fecha es requerida"),
  description: z.string().max(1000).trim().optional(),
  poster_url: optionalUrl,
  gallery_urls: z.array(z.url()).optional(),
});

// ── Platillos del menú ────────────────────────────────────────────────────────
export const menuItemSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(150).trim(),
  description: z.string().max(500).trim().optional(),
  price: z.number({ error: "El precio debe ser un número" })
    .positive("El precio debe ser mayor a 0")
    .max(99999),
  category: z.string().min(1, "La categoría es requerida").max(100).trim(),
  sort_order: z.number().int().nonnegative().optional(),
  image_url: optionalUrl,
  is_available: z.boolean().optional(),
});

// ── Terrazas ─────────────────────────────────────────────────────────────────
export const terraceSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(150).trim(),
  description: z.string().max(1000).trim().optional(),
  highlight: z.string().max(200).trim().optional(),
  max_capacity: z.number({ error: "La capacidad debe ser un número" })
    .int()
    .positive()
    .max(500),
  image_url: optionalUrl,
  sort_order: z.number().int().nonnegative().optional(),
});

// ── Eventos especiales ────────────────────────────────────────────────────────
export const specialEventSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(200).trim(),
  description: z.string().max(1000).trim().optional(),
  event_date: z.string().optional(),
  image_url: optionalUrl,
  is_active: z.boolean().optional(),
});

// ── Gestión de administradores ────────────────────────────────────────────────
export const addAdminSchema = z.object({
  email: z.email("Correo electrónico inválido").toLowerCase().trim(),
});

// ── Login ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.email("Correo electrónico inválido").toLowerCase().trim(),
  password: z.string().min(6, "La contraseña es demasiado corta"),
});

export type UpcomingEventInput = z.infer<typeof upcomingEventSchema>;
export type CarouselEventInput = z.infer<typeof carouselEventSchema>;
export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type TerraceInput = z.infer<typeof terraceSchema>;
export type SpecialEventInput = z.infer<typeof specialEventSchema>;
export type AddAdminInput = z.infer<typeof addAdminSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
