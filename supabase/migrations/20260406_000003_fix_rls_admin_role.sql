-- ============================================================
-- FASE 4: Reemplazar auth.uid() IS NOT NULL por is_admin()
-- Proyecto: como-caido-del-cielo (vuayyxutwbdkzavjgrnz)
-- Fecha: 2026-04-06
-- Depende de: 20260406_000002_admin_role_system.sql
-- ============================================================

-- [4A] Función helper is_admin()
-- SECURITY DEFINER: se ejecuta con permisos del creador (postgres),
-- evitando que la RLS de admin_users genere recursión infinita.
-- STABLE: Postgres puede cachearla por transacción.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

-- [4B] upcoming_events
DROP POLICY IF EXISTS "Admin write upcoming_events" ON public.upcoming_events;
CREATE POLICY "Admin write upcoming_events"
  ON public.upcoming_events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- [4C] carousel_events
DROP POLICY IF EXISTS "Admin write carousel_events" ON public.carousel_events;
CREATE POLICY "Admin write carousel_events"
  ON public.carousel_events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- [4D] terraces
DROP POLICY IF EXISTS "Admin write terraces" ON public.terraces;
CREATE POLICY "Admin write terraces"
  ON public.terraces FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- [4E] menu_items
DROP POLICY IF EXISTS "Admin manage menu_items" ON public.menu_items;
CREATE POLICY "Admin manage menu_items"
  ON public.menu_items FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- [4F] special_events
DROP POLICY IF EXISTS "Admin write special_events" ON public.special_events;
CREATE POLICY "Admin write special_events"
  ON public.special_events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- [4G] business_rules
DROP POLICY IF EXISTS "Admin update business_rules" ON public.business_rules;
CREATE POLICY "Admin update business_rules"
  ON public.business_rules FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- [4H] terrace_reservations: reemplazar las 3 policies de admin
DROP POLICY IF EXISTS "Admin update reservations"   ON public.terrace_reservations;
DROP POLICY IF EXISTS "Admin delete reservations"   ON public.terrace_reservations;
DROP POLICY IF EXISTS "Users view own reservations" ON public.terrace_reservations;

-- Admins ven todo, usuarios solo ven sus propias reservaciones
CREATE POLICY "Read reservations"
  ON public.terrace_reservations FOR SELECT
  USING (
    public.is_admin()
    OR auth.jwt() ->> 'email' = customer_email
  );

CREATE POLICY "Admin update reservations"
  ON public.terrace_reservations FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete reservations"
  ON public.terrace_reservations FOR DELETE
  USING (public.is_admin());

-- Verificación: no deben quedar policies con auth.uid() IS NOT NULL en escritura
DO $$
DECLARE v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND cmd IN ('INSERT', 'UPDATE', 'DELETE', 'ALL')
    AND (qual LIKE '%uid() IS NOT NULL%' OR with_check LIKE '%uid() IS NOT NULL%');

  IF v_count > 0 THEN
    RAISE NOTICE '⚠️  Quedan % políticas con auth.uid() IS NOT NULL sin migrar.', v_count;
  ELSE
    RAISE NOTICE '✅ Fase 4 COMPLETA: Todas las políticas de escritura usan is_admin().';
  END IF;
END $$;
