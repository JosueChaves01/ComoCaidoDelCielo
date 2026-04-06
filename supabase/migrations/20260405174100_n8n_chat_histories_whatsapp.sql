create table public.n8n_chat_histories_whatsapp (
  id serial not null,
  session_id character varying(255) not null,
  nombre character varying(255) null,
  email character varying(255) null,
  empresa character varying(255) null,
  phone character varying(50) null,
  wa_phone character varying(50) null,
  intent character varying(50) null default 'nuevo'::character varying,
  estado_flujo character varying(50) null default 'inicial'::character varying,
  fecha_solicitada text null,
  hora_solicitada text null,
  tipo_reunion character varying(100) null,
  ultima_cita_id character varying(255) null,
  ultima_cita_fecha timestamp with time zone null,
  ultima_cita_meet_link character varying(500) null,
  mensajes_count integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  last_user_message text null,
  last_call_summary text null,
  constraint n8n_chat_histories_whatsapp_pkey primary key (id),
  constraint n8n_chat_histories_whatsapp_session_id_key unique (session_id)
) TABLESPACE pg_default;

create index IF not exists idx_n8n_chat_histories_whatsapp_session_id
on public.n8n_chat_histories_whatsapp
using btree (session_id)
TABLESPACE pg_default;

create trigger n8n_chat_histories_whatsapp_updated_at
before update on public.n8n_chat_histories_whatsapp
for each row
execute function update_updated_at_column();
