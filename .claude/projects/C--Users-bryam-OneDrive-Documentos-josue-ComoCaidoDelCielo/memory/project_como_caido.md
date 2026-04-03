---
name: Como Caido del Cielo - Project Context
description: Restaurant reservation system with chat widget, n8n orchestration, Supabase backend, and payment proof workflow
type: project
---

"Como Caído del Cielo" is a restaurant/terrace reservation system.

**Architecture:**
- Frontend: React (Vite) with floating ChatAssistant widget
- Orchestration: n8n workflows handle chat logic via webhooks
- Database: Supabase (PostgreSQL) — tables include `terrace_reservations`, `n8n_chat_histories`
- Storage: Supabase Storage bucket `payment-proofs` for comprobantes

**Chat flow:**
1. User sends message → POST to n8n webhook (`VITE_N8N_CHAT_URL`) with `{ chatInput, sessionId }`
2. n8n processes via AI agent, persists history in `n8n_chat_histories` (session_id + message JSONB)
3. Bot can embed commands: `[AWAIT_PROOF:{reservation_uuid}]` to request payment proof, `[PROOF_DONE]` when confirmed
4. Payment proofs uploaded to Supabase Storage, URL sent back to n8n as chat message

**Key table — n8n_chat_histories:**
- `id` serial PK
- `session_id` varchar(255) — matches client-generated session ID
- `message` jsonb — stores the conversation message data

**Why:** Understanding this flow is critical before modifying any chat, reservation, or payment proof feature.

**How to apply:** Any changes to ChatAssistant must account for the n8n webhook contract and the command parsing protocol.
