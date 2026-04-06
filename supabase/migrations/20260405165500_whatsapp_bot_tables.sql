-- wa_human_takeover
create table public.wa_human_takeover (
  bot_id text not null,
  chat_id text not null,
  taken_by text not null default 'owner'::text,
  taken_at timestamp with time zone not null default now(),
  last_owner_message_at timestamp with time zone not null default now(),
  is_active boolean not null default true,
  released_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint wa_human_takeover_pkey primary key (bot_id, chat_id),
  constraint wa_human_takeover_taken_by_check check (
    (
      taken_by = any (array['owner'::text, 'supervisor_endpoint'::text])
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_wa_human_takeover_bot_active on public.wa_human_takeover using btree (bot_id, is_active) TABLESPACE pg_default;

-- wa_human_whitelist
create table public.wa_human_whitelist (
  id bigserial not null,
  bot_id text not null default 'default'::text,
  chat_id text not null,
  is_active boolean not null default true,
  source text not null default 'manual'::text,
  notes text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint wa_human_whitelist_pkey primary key (id),
  constraint wa_human_whitelist_bot_chat_unique unique (bot_id, chat_id),
  constraint wa_human_whitelist_chat_format check ((chat_id ~ '^\+[0-9]{6,20}$'::text))
) TABLESPACE pg_default;

create index IF not exists idx_wa_human_whitelist_bot_active on public.wa_human_whitelist using btree (bot_id, is_active) TABLESPACE pg_default;

-- wa_workers
create table public.wa_workers (
  worker_id text not null,
  port integer not null,
  status text null default 'active'::text,
  last_heartbeat timestamp with time zone null default now(),
  assigned_chats_count integer null default 0,
  total_messages_processed integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  bot_id text not null default 'greenplanet'::text,
  constraint wa_workers_pkey primary key (bot_id, worker_id),
  constraint wa_workers_status_check check (
    (
      status = any (
        array['active'::text, 'inactive'::text, 'dead'::text]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_workers_bot_status on public.wa_workers using btree (bot_id, status) TABLESPACE pg_default;

-- wa_message_locks
create table public.wa_message_locks (
  message_id text not null,
  phone text not null,
  worker_id text not null,
  claimed_at timestamp with time zone null default now(),
  processed boolean null default false,
  processed_at timestamp with time zone null,
  expires_at timestamp with time zone null default (now() + '00:05:00'::interval),
  bot_id text not null default 'greenplanet'::text,
  constraint wa_message_locks_pkey primary key (bot_id, message_id)
) TABLESPACE pg_default;

create index IF not exists idx_message_locks_bot_expires on public.wa_message_locks using btree (bot_id, expires_at) TABLESPACE pg_default;

create index IF not exists idx_message_locks_bot_phone on public.wa_message_locks using btree (bot_id, phone) TABLESPACE pg_default;

-- wa_chat_assignments
create table public.wa_chat_assignments (
  phone text not null,
  worker_id text not null,
  assigned_at timestamp with time zone null default now(),
  last_message_at timestamp with time zone null default now(),
  message_count integer null default 0,
  is_active boolean null default true,
  bot_id text not null default 'greenplanet'::text,
  constraint wa_chat_assignments_pkey primary key (bot_id, phone)
) TABLESPACE pg_default;

create index IF not exists idx_chat_assignments_bot_worker on public.wa_chat_assignments using btree (bot_id, worker_id) TABLESPACE pg_default;

create index IF not exists idx_chat_assignments_bot_last_message on public.wa_chat_assignments using btree (bot_id, last_message_at) TABLESPACE pg_default;
