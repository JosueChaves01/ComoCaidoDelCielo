# Migración Supabase: Reglas de Negocio y Ampliación de Capacidad

## Prompt para agente MCP de Supabase

> Ejecuta la siguiente migración SQL en el proyecto Supabase. 
> 1. Crea la tabla `business_rules` con los precios base y horarios del negocio (adultos 3500 y niños 2500). También inserta el registro por defecto ID = 1.
> 2. Agrega la columna `max_capacity` (int) a la tabla `terraces` existente, con un valor por defecto de 6.
> 3. Agrega la columna `total_amount` (numeric) a la tabla `terrace_reservations` existente, con un valor por defecto de 0.

## Script SQL

```sql
-- =============================================
-- TABLA: business_rules
-- =============================================
CREATE TABLE IF NOT EXISTS public.business_rules (
  id INTEGER PRIMARY KEY DEFAULT 1,
  adult_price NUMERIC NOT NULL DEFAULT 3500,
  child_price NUMERIC NOT NULL DEFAULT 2500,
  opening_time TIME NOT NULL DEFAULT '15:00:00',
  closing_time TIME NOT NULL DEFAULT '01:00:00',
  working_days TEXT[] NOT NULL DEFAULT ARRAY['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar que solo pueda haber una fila en business_rules (la de id=1)
ALTER TABLE public.business_rules ADD CONSTRAINT business_rules_single_row CHECK (id = 1);

-- Insertar la fila inicial (si no existe)
INSERT INTO public.business_rules (id, adult_price, child_price)
VALUES (1, 3500, 2500)
ON CONFLICT (id) DO NOTHING;

-- Habilitar RLS en business_rules
ALTER TABLE public.business_rules ENABLE ROW LEVEL SECURITY;

-- Cualquier usuario (incluso visitantes anónimos) puede ver los precios/horarios
CREATE POLICY "Lectura pública de reglas de negocio"
  ON public.business_rules
  FOR SELECT
  USING (true);

-- Solo el administrador autenticado puede modificarlos
CREATE POLICY "Modificación autenticada de reglas"
  ON public.business_rules
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- ALTERACIÓN: terrazas y reservaciones
-- =============================================

-- 1. Capacidad en las terrazas
ALTER TABLE public.terraces 
ADD COLUMN IF NOT EXISTS max_capacity INTEGER NOT NULL DEFAULT 6;

-- 2. Monto total congelado en las reservas (para que si el precio base cambia, el historial mantenga el precio original cobrado)
ALTER TABLE public.terrace_reservations
ADD COLUMN IF NOT EXISTS total_amount NUMERIC NOT NULL DEFAULT 0;
```
