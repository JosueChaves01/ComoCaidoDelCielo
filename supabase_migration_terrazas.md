# Prompt para Agente MCP de Supabase: Migración de Terrazas

**Instrucción para el usuario:** Copia el siguiente bloque de texto y envíaselo a cualquier asistente o agente que tenga acceso a tus herramientas/MCP de Supabase:

---

**Prompt para el Agente:**

Hola. Por favor, realiza la siguiente migración en mi proyecto actual de Supabase. Necesito que ejecutes el siguiente script SQL para crear la tabla `terraces`, crear un bucket en Storage y configurar sus políticas de seguridad (RLS). 

Utiliza tu herramienta de "Execute SQL" o equivalente (como `apply_migration` o `execute_sql`):

```sql
-- 1. Crear tabla de Terrazas
CREATE TABLE IF NOT EXISTS public.terraces (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  highlight text NOT NULL,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Habilitar RLS en la tabla
ALTER TABLE public.terraces ENABLE ROW LEVEL SECURITY;

-- 3. Crear Políticas para la tabla terraces
-- Permitir lectura a todos (público)
CREATE POLICY "Permitir lectura publica de terraces"
ON public.terraces
FOR SELECT
TO public
USING (true);

-- Permitir inserción, actualización y borrado solo a usuarios autenticados
CREATE POLICY "Permitir insercion autenticada en terraces"
ON public.terraces
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir actualizacion autenticada en terraces"
ON public.terraces
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Permitir borrado autenticado en terraces"
ON public.terraces
FOR DELETE
TO authenticated
USING (true);

-- 4. Crear el bucket en Storage para las imágenes de terrazas (si no existe)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('terraces', 'terraces', true)
ON CONFLICT (id) DO NOTHING;

-- 5. Habilitar y crear Políticas para el bucket "terraces" en Storage
CREATE POLICY "Permitir lectura publica de imagenes terraces"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'terraces');

CREATE POLICY "Permitir subida autenticada a terraces"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'terraces');

CREATE POLICY "Permitir actualizacion autenticada en terraces bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'terraces');

CREATE POLICY "Permitir borrado autenticado en terraces bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'terraces');
```

Por favor, confirma una vez ejecutado exitosamente. No necesitas responderme con más detalles mas que confirmar que la tabla `terraces` y el bucket `terraces` funcionan correctamente.
---
