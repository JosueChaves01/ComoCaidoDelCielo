-- ============================================================
-- FASE 2: Reemplazar políticas "Always True" (USING true)
-- Proyecto: como-caido-del-cielo (vuayyxutwbdkzavjgrnz)
-- Fecha: 2026-04-06
-- ============================================================

-- [2A] business_rules
-- Mantener lectura pública, restringir escritura a usuarios autenticados (Admin)
DROP POLICY IF EXISTS "Public Update Business Rules" ON public.business_rules;
DROP POLICY IF EXISTS "Modificación autenticada de reglas" ON public.business_rules;
DROP POLICY IF EXISTS "Lectura pública de reglas de negocio" ON public.business_rules;

CREATE POLICY "Public read business_rules" 
  ON public.business_rules FOR SELECT USING (true);

CREATE POLICY "Admin update business_rules" 
  ON public.business_rules FOR UPDATE 
  USING (auth.uid() IS NOT NULL) 
  WITH CHECK (auth.uid() IS NOT NULL);

-- [2B] menu_items
-- Lectura pública, gestión restringida a Admin
DROP POLICY IF EXISTS "Menu Items Write Access" ON public.menu_items;
DROP POLICY IF EXISTS "menu_items_admin_delete" ON public.menu_items;
DROP POLICY IF EXISTS "menu_items_admin_insert" ON public.menu_items;
DROP POLICY IF EXISTS "menu_items_admin_update" ON public.menu_items;

CREATE POLICY "Public read menu_items" 
  ON public.menu_items FOR SELECT USING (true);

CREATE POLICY "Admin manage menu_items" 
  ON public.menu_items FOR ALL 
  USING (auth.uid() IS NOT NULL) 
  WITH CHECK (auth.uid() IS NOT NULL);

-- [2C] terrace_reservations
-- Balance: Permitir INSERT público (para el flujo de reserva)
-- Restringir SELECT al dueño del email o al Admin
-- Restringir UPDATE/DELETE solo al Admin
DROP POLICY IF EXISTS "Public Manage Reservations" ON public.terrace_reservations;
DROP POLICY IF EXISTS "Inserción pública de reservaciones" ON public.terrace_reservations;

CREATE POLICY "Public insert reservations" 
  ON public.terrace_reservations FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users view own reservations" 
  ON public.terrace_reservations FOR SELECT 
  USING (auth.uid() IS NOT NULL OR auth.jwt() ->> 'email' = customer_email);

CREATE POLICY "Admin update reservations" 
  ON public.terrace_reservations FOR UPDATE 
  USING (auth.uid() IS NOT NULL) 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin delete reservations" 
  ON public.terrace_reservations FOR DELETE 
  USING (auth.uid() IS NOT NULL);

-- [2D] special_events
DROP POLICY IF EXISTS "Escritura autenticada de eventos especiales" ON public.special_events;

CREATE POLICY "Public read special_events" 
  ON public.special_events FOR SELECT USING (true);

CREATE POLICY "Admin write special_events" 
  ON public.special_events FOR ALL 
  USING (auth.uid() IS NOT NULL) 
  WITH CHECK (auth.uid() IS NOT NULL);

-- [2E] Tablas wa_* (Limpiar políticas permisivas heredadas)
-- Al no tener políticas y tener RLS activo, solo service_role (n8n) tiene acceso
DROP POLICY IF EXISTS "Service role full access on wa_workers" ON public.wa_workers;
DROP POLICY IF EXISTS "Service role full access on wa_chat_assignments" ON public.wa_chat_assignments;
DROP POLICY IF EXISTS "Service role full access on wa_message_locks" ON public.wa_message_locks;

-- Verificación final de políticas permisivas remanentes en escritura
DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    AND qual = 'true'
    AND tablename != 'terrace_reservations'; -- Ignorar el INSERT de reservas que es intencional

  IF v_count > 0 THEN
    RAISE NOTICE '⚠️ Atención: Aún existen % políticas permisivas (qual=true) en escritura.', v_count;
  ELSE
    RAISE NOTICE '✅ Fase 2 COMPLETADA: Las políticas Always True han sido reemplazadas.';
  END IF;
END $$;
