# Migración Supabase: Reservaciones de Terrazas

## Prompt para agente MCP de Supabase

> Ejecuta la siguiente migración SQL en el proyecto Supabase. Esto creará la tabla `terrace_reservations` para gestionar las reservas por día completo de las diferentes terrazas por parte de los clientes.

## Script SQL

```sql
-- =============================================
-- TABLA: terrace_reservations
-- =============================================
CREATE TABLE IF NOT EXISTS public.terrace_reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  terrace_id UUID NOT NULL REFERENCES public.terraces(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  adults_count INTEGER NOT NULL DEFAULT 1,
  children_count INTEGER DEFAULT 0,
  reservation_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar que una terraza no se reserve dos veces el mismo día, a menos que esté cancelada.
CREATE UNIQUE INDEX unique_active_reservation 
  ON public.terrace_reservations (terrace_id, reservation_date) 
  WHERE status != 'cancelled';

-- Habilitar RLS
ALTER TABLE public.terrace_reservations ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (necesaria para ver fechas reservadas "disponibilidad" en el modal)
-- Permite que cualquiera pueda listar las fechas reservadas de cada terraza.
CREATE POLICY "Lectura pública de reservaciones"
  ON public.terrace_reservations
  FOR SELECT
  USING (true);

-- Política de escritura para cualquier usuario (las reservas se hacen sin registro/login)
CREATE POLICY "Inserción pública de reservaciones"
  ON public.terrace_reservations
  FOR INSERT
  WITH CHECK (true);

-- Política de actualización/eliminación exclusiva para usuarios autenticados (admin dashboard)
CREATE POLICY "Modificación/Eliminación autenticada"
  ON public.terrace_reservations
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```
