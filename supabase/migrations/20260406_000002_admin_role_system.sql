-- ============================================================
-- FASE 3: Sistema de roles de administrador
-- Proyecto: como-caido-del-cielo (vuayyxutwbdkzavjgrnz)
-- Fecha: 2026-04-06
-- ============================================================

-- [3A] Tabla admin_users
-- Registra qué usuarios autenticados tienen rol de administrador.
-- INSERT/DELETE solo ocurren vía Edge Function con service_role.
-- Ninguna policy permite escritura desde el cliente (anon/authenticated).
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id)
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Solo admins existentes pueden VER la lista (no hay recursión: la subquery
-- referencia la tabla directamente, no llama a is_admin() que aún no existe)
CREATE POLICY "Admins can read admin_users"
  ON public.admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.user_id = auth.uid()
    )
  );

-- No hay policies de INSERT/UPDATE/DELETE → solo service_role puede escribir

-- [3B] Tabla login_attempts (brute force tracking por IP)
-- Registra cada intento de login (exitoso o fallido) con su IP.
-- Sin policies: solo service_role (Edge Function) puede acceder.
CREATE TABLE IF NOT EXISTS public.login_attempts (
  id           BIGSERIAL PRIMARY KEY,
  ip_address   TEXT        NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  succeeded    BOOLEAN     NOT NULL DEFAULT false
);

ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

-- [3C] Tabla blocked_ips
-- IPs bloqueadas temporalmente por demasiados intentos fallidos.
-- Sin policies: solo service_role (Edge Function) puede acceder.
CREATE TABLE IF NOT EXISTS public.blocked_ips (
  ip_address    TEXT        PRIMARY KEY,
  blocked_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  blocked_until TIMESTAMPTZ NOT NULL,
  reason        TEXT        NOT NULL DEFAULT 'too_many_failed_attempts'
);

ALTER TABLE public.blocked_ips ENABLE ROW LEVEL SECURITY;

-- [3D] Índices para performance en queries frecuentes
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time
  ON public.login_attempts(ip_address, attempted_at DESC);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_until
  ON public.blocked_ips(blocked_until);

-- ============================================================
-- INSTRUCCIONES PARA SEED DEL PRIMER ADMIN (ejecutar manual):
--
-- 1. Ve al SQL Editor del Dashboard de Supabase
-- 2. Busca el UUID del owner en Authentication > Users
-- 3. Ejecuta UNA SOLA VEZ:
--
--    INSERT INTO public.admin_users (user_id, assigned_by)
--    VALUES ('<UUID_DEL_OWNER>', NULL);
--
-- ============================================================

-- Verificación
DO $$
DECLARE v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('admin_users', 'login_attempts', 'blocked_ips');

  IF v_count = 3 THEN
    RAISE NOTICE '✅ Fase 3 COMPLETA: Tablas admin_users, login_attempts y blocked_ips creadas.';
  ELSE
    RAISE EXCEPTION '❌ Fase 3 INCOMPLETA: Solo % de 3 tablas creadas.', v_count;
  END IF;
END $$;
