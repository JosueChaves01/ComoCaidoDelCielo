# Migración Supabase: Eventos Especiales

## Prompt para agente MCP de Supabase

> Ejecuta la siguiente migración SQL en el proyecto Supabase. Esto creará la tabla `special_events` para almacenar los eventos especiales con sus menús, y el bucket de almacenamiento `special-events` para las imágenes.

## Script SQL

```sql
-- =============================================
-- TABLA: special_events
-- =============================================
CREATE TABLE IF NOT EXISTS public.special_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  date TEXT,
  description TEXT NOT NULL,
  menu TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.special_events ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública
CREATE POLICY "Lectura pública de eventos especiales"
  ON public.special_events
  FOR SELECT
  USING (true);

-- Política de escritura para usuarios autenticados
CREATE POLICY "Escritura autenticada de eventos especiales"
  ON public.special_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- =============================================
-- BUCKET DE ALMACENAMIENTO: special-events
-- =============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('special-events', 'special-events', true)
ON CONFLICT (id) DO NOTHING;

-- Política de lectura pública del bucket
CREATE POLICY "Lectura pública bucket special-events"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'special-events');

-- Política de subida para usuarios autenticados
CREATE POLICY "Subida autenticada bucket special-events"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'special-events');

-- Política de eliminación para usuarios autenticados
CREATE POLICY "Eliminación autenticada bucket special-events"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'special-events');
```
