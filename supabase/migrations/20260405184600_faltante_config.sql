-- ============================================================================
-- FUNCIONES RPC FALTANTES - wa-test
-- Las tablas ya existen. Solo ejecutar esto en el SQL Editor de Supabase.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- RLS policies para las tablas de orquestación (por si no se crearon)
-- ----------------------------------------------------------------------------

ALTER TABLE public.wa_workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_chat_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wa_message_locks ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wa_workers' AND policyname = 'Service role full access on wa_workers') THEN
    CREATE POLICY "Service role full access on wa_workers" ON public.wa_workers FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wa_chat_assignments' AND policyname = 'Service role full access on wa_chat_assignments') THEN
    CREATE POLICY "Service role full access on wa_chat_assignments" ON public.wa_chat_assignments FOR ALL USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'wa_message_locks' AND policyname = 'Service role full access on wa_message_locks') THEN
    CREATE POLICY "Service role full access on wa_message_locks" ON public.wa_message_locks FOR ALL USING (true);
  END IF;
END $$;

-- ----------------------------------------------------------------------------
-- worker_heartbeat
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.worker_heartbeat(
  p_worker_id TEXT,
  p_port INTEGER,
  p_bot_id TEXT DEFAULT 'default'
)
RETURNS BOOLEAN AS $$
BEGIN
  INSERT INTO public.wa_workers (bot_id, worker_id, port, status, last_heartbeat)
  VALUES (p_bot_id, p_worker_id, p_port, 'active', NOW())
  ON CONFLICT (bot_id, worker_id) DO UPDATE
    SET status = 'active',
        last_heartbeat = NOW(),
        port = p_port,
        updated_at = NOW();
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- try_claim_message
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.try_claim_message(
  p_message_id TEXT,
  p_phone TEXT,
  p_worker_id TEXT,
  p_bot_id TEXT DEFAULT 'default',
  p_allow_cross_worker BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
  v_assigned_worker TEXT;
  v_lock_exists BOOLEAN;
  v_should_process BOOLEAN := FALSE;
  v_is_cross_worker BOOLEAN := FALSE;
BEGIN
  -- 1. Verificar si el mensaje ya tiene lock
  SELECT EXISTS(
    SELECT 1 FROM public.wa_message_locks
    WHERE bot_id = p_bot_id
      AND message_id = p_message_id
      AND (processed = TRUE OR expires_at > NOW())
  ) INTO v_lock_exists;

  IF v_lock_exists THEN
    RETURN jsonb_build_object('should_process', FALSE, 'reason', 'message_already_locked');
  END IF;

  -- 2. Obtener worker asignado al chat
  SELECT worker_id INTO v_assigned_worker
  FROM public.wa_chat_assignments
  WHERE bot_id = p_bot_id AND phone = p_phone;

  -- 3. Sin asignación → asignar a este worker
  IF v_assigned_worker IS NULL THEN
    INSERT INTO public.wa_chat_assignments (bot_id, phone, worker_id, assigned_at, last_message_at)
    VALUES (p_bot_id, p_phone, p_worker_id, NOW(), NOW())
    ON CONFLICT (bot_id, phone) DO UPDATE
      SET worker_id = EXCLUDED.worker_id,
          assigned_at = NOW()
      WHERE public.wa_chat_assignments.worker_id IS NULL;

    UPDATE public.wa_workers
    SET assigned_chats_count = assigned_chats_count + 1,
        updated_at = NOW()
    WHERE bot_id = p_bot_id AND worker_id = p_worker_id;

    v_assigned_worker := p_worker_id;
    v_should_process := TRUE;

  -- 4. Este worker es el asignado
  ELSIF v_assigned_worker = p_worker_id THEN
    v_should_process := TRUE;

  -- 5. Cross-worker permitido
  ELSIF p_allow_cross_worker THEN
    v_should_process := TRUE;
    v_is_cross_worker := TRUE;

  ELSE
    RETURN jsonb_build_object(
      'should_process', FALSE,
      'reason', 'chat_assigned_to_other_worker',
      'assigned_worker', v_assigned_worker
    );
  END IF;

  -- 6. Crear lock
  IF v_should_process THEN
    INSERT INTO public.wa_message_locks (bot_id, message_id, phone, worker_id)
    VALUES (p_bot_id, p_message_id, p_phone, p_worker_id)
    ON CONFLICT (bot_id, message_id) DO NOTHING;

    IF NOT FOUND THEN
      RETURN jsonb_build_object('should_process', FALSE, 'reason', 'lock_race_lost');
    END IF;

    UPDATE public.wa_chat_assignments
    SET last_message_at = NOW(),
        message_count = message_count + 1
    WHERE bot_id = p_bot_id AND phone = p_phone;

    RETURN jsonb_build_object(
      'should_process', TRUE,
      'is_cross_worker', v_is_cross_worker,
      'assigned_worker', v_assigned_worker
    );
  END IF;

  RETURN jsonb_build_object('should_process', FALSE, 'reason', 'unknown');
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- mark_message_processed
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.mark_message_processed(
  p_message_id TEXT,
  p_worker_id TEXT,
  p_bot_id TEXT DEFAULT 'default'
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.wa_message_locks
  SET processed = TRUE,
      processed_at = NOW()
  WHERE bot_id = p_bot_id
    AND message_id = p_message_id
    AND worker_id = p_worker_id;

  UPDATE public.wa_workers
  SET total_messages_processed = total_messages_processed + 1,
      updated_at = NOW()
  WHERE bot_id = p_bot_id AND worker_id = p_worker_id;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- cleanup_old_data
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.cleanup_old_data(
  p_bot_id TEXT DEFAULT 'default'
)
RETURNS JSONB AS $$
DECLARE
  v_locks_deleted INTEGER;
  v_dead_workers INTEGER;
BEGIN
  -- Limpiar locks procesados de más de 1 hora
  DELETE FROM public.wa_message_locks
  WHERE bot_id = p_bot_id
    AND processed = TRUE
    AND processed_at < NOW() - INTERVAL '1 hour';
  GET DIAGNOSTICS v_locks_deleted = ROW_COUNT;

  -- Limpiar locks expirados sin procesar
  DELETE FROM public.wa_message_locks
  WHERE bot_id = p_bot_id
    AND processed = FALSE
    AND expires_at < NOW();

  -- Marcar workers muertos (sin heartbeat en 30s)
  UPDATE public.wa_workers
  SET status = 'dead', updated_at = NOW()
  WHERE bot_id = p_bot_id
    AND status = 'active'
    AND last_heartbeat < NOW() - INTERVAL '30 seconds';
  GET DIAGNOSTICS v_dead_workers = ROW_COUNT;

  RETURN jsonb_build_object(
    'locks_deleted', v_locks_deleted,
    'workers_marked_dead', v_dead_workers
  );
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- get_orchestration_stats
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_orchestration_stats(
  p_bot_id TEXT DEFAULT 'default'
)
RETURNS JSONB AS $$
DECLARE
  v_stats JSONB;
BEGIN
  SELECT jsonb_build_object(
    'workers', (
      SELECT jsonb_agg(jsonb_build_object(
        'worker_id', worker_id,
        'port', port,
        'status', status,
        'assigned_chats', assigned_chats_count,
        'messages_processed', total_messages_processed,
        'last_heartbeat', last_heartbeat
      ))
      FROM public.wa_workers
      WHERE bot_id = p_bot_id
    ),
    'total_active_workers', (SELECT COUNT(*) FROM public.wa_workers WHERE bot_id = p_bot_id AND status = 'active'),
    'total_chats', (SELECT COUNT(*) FROM public.wa_chat_assignments WHERE bot_id = p_bot_id),
    'pending_messages', (SELECT COUNT(*) FROM public.wa_message_locks WHERE bot_id = p_bot_id AND processed = FALSE AND expires_at > NOW()),
    'processed_today', (
      SELECT COUNT(*) FROM public.wa_message_locks
      WHERE bot_id = p_bot_id
        AND processed = TRUE
        AND processed_at >= CURRENT_DATE
    )
  ) INTO v_stats;

  RETURN v_stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Funciones RPC creadas: worker_heartbeat, try_claim_message, mark_message_processed, cleanup_old_data, get_orchestration_stats';
END $$;
