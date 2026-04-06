-- ============================================================
-- FASE 1: Activar RLS en tablas sin protección
-- Proyecto: como-caido-del-cielo (vuayyxutwbdkzavjgrnz)
-- Fecha: 2026-04-06
-- Autor: Auditoría de Seguridad CAPEC
-- ============================================================
-- 
-- CONTEXTO:
-- Las tablas de contenido público necesitan:
--   SELECT: acceso libre (el sitio web las muestra)
--   INSERT/UPDATE/DELETE: solamente admin autenticado
--
-- Las tablas internas de bot (n8n/WhatsApp) deben:
--   Bloquear COMPLETAMENTE el acceso anon key
--   n8n usa credenciales directas de PostgreSQL (service_role)
--   service_role bypassa RLS automáticamente → los flujos NO se rompen
-- ============================================================

-- -------------------------------------------------------
-- [1A] TABLAS DE CONTENIDO PÚBLICO
-- -------------------------------------------------------

ALTER TABLE public.upcoming_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_events ENABLE ROW LEVEL SECURITY;

-- upcoming_events
DROP POLICY IF EXISTS "Public read upcoming_events"  ON public.upcoming_events;
DROP POLICY IF EXISTS "Admin write upcoming_events"  ON public.upcoming_events;

CREATE POLICY "Public read upcoming_events"
  ON public.upcoming_events
  FOR SELECT
  USING (true);

CREATE POLICY "Admin write upcoming_events"
  ON public.upcoming_events
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- carousel_events
DROP POLICY IF EXISTS "Public read carousel_events"  ON public.carousel_events;
DROP POLICY IF EXISTS "Admin write carousel_events"  ON public.carousel_events;

CREATE POLICY "Public read carousel_events"
  ON public.carousel_events
  FOR SELECT
  USING (true);

CREATE POLICY "Admin write carousel_events"
  ON public.carousel_events
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- terraces: tenía políticas pero RLS no estaba habilitado (bug confirmado por Supabase Advisor)
ALTER TABLE public.terraces ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Manage Terraces"  ON public.terraces;
DROP POLICY IF EXISTS "Public read terraces"    ON public.terraces;
DROP POLICY IF EXISTS "Admin write terraces"    ON public.terraces;

CREATE POLICY "Public read terraces"
  ON public.terraces
  FOR SELECT
  USING (true);

CREATE POLICY "Admin write terraces"
  ON public.terraces
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- -------------------------------------------------------
-- [1B] TABLAS INTERNAS DE BOT
-- Accedidas SOLO por n8n a través de credenciales directas 
-- de PostgreSQL (service_role). 
-- Sin políticas + RLS activo = bloqueo total para anon key.
-- service_role bypassa RLS automáticamente.
-- -------------------------------------------------------

ALTER TABLE public.wa_human_takeover               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_human_whitelist              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_chat_histories              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_chat_histories_whatsapp     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_conversation_state_whatsapp ENABLE ROW LEVEL SECURITY;

-- Verificación final
DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM pg_tables
  WHERE schemaname = 'public'
    AND tablename IN (
      'upcoming_events', 'carousel_events', 'terraces',
      'wa_human_takeover', 'wa_human_whitelist',
      'n8n_chat_histories', 'n8n_chat_histories_whatsapp',
      'n8n_conversation_state_whatsapp'
    )
    AND rowsecurity = false;

  IF v_count > 0 THEN
    RAISE EXCEPTION '❌ Fase 1 INCOMPLETA: % tabla(s) aún sin RLS activo.', v_count;
  ELSE
    RAISE NOTICE '✅ Fase 1 COMPLETA: RLS activado en 8 tablas correctamente.';
  END IF;
END $$;
