-- Eliminar las políticas anteriores de la tabla business_rules
DROP POLICY IF EXISTS "Modificación autenticada de reglas" ON public.business_rules;
DROP POLICY IF EXISTS "Lectura pública de reglas de negocio" ON public.business_rules;

-- Recrear la política de lectura: cualquier persona puede leer (esencial para la carga del modal)
CREATE POLICY "Lectura pública de reglas de negocio"
  ON public.business_rules
  FOR SELECT
  USING (true);

-- Recrear la política de modificación usando auth.uid() en lugar de auth.role() 
-- Esto suele arreglar problemas donde el UPDATE silenciosamente falla (204 No content sin actualizar dato)
CREATE POLICY "Modificación autenticada de reglas"
  ON public.business_rules
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
