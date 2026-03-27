# Como Caído del Cielo

Plataforma completa de reservaciones para terrazas. Un agente conversacional guía al cliente desde el saludo hasta la confirmación, con verificación de disponibilidad en tiempo real, pagos con Stripe, notificaciones por email y panel de administración.

**API:** `https://superb-bravery-production.up.railway.app`
**Docs:** `https://superb-bravery-production.up.railway.app/docs`
**Frontend:** `https://como-caido-del-cielo.vercel.app`
**Admin:** `https://como-caido-del-cielo.vercel.app/admin`

---

## Stack

| Capa | Tecnología |
|------|------------|
| API | FastAPI + Uvicorn |
| Flujo conversacional | LangGraph (FSM) |
| LLM | OpenRouter (`stepfun/step-3.5-flash:free`) |
| Base de datos | PostgreSQL (Railway) |
| Caché de sesiones | Redis (Railway) |
| ORM + migraciones | SQLAlchemy 2 + Alembic |
| Auth | JWT (python-jose) |
| Email | Resend |
| Pagos | Stripe Checkout |
| Monitoreo | Sentry |
| Frontend | Next.js 14 + Tailwind CSS |
| Deploy backend | Railway |
| Deploy frontend | Vercel |

---

## Arquitectura

```
src/
├── api/
│   ├── main.py                  # FastAPI app, CORS, Sentry, rate limiting
│   ├── limiter.py               # slowapi Limiter (20 req/min en /chat)
│   ├── schemas.py               # Pydantic request/response
│   └── routes/
│       ├── chat.py              # POST /chat (rate limited)
│       ├── reservaciones.py     # GET/DELETE /reservaciones
│       ├── disponibilidad.py    # GET /disponibilidad
│       ├── terrazas.py          # GET/POST/PUT /terrazas
│       ├── auth.py              # POST /auth/login
│       ├── admin_stats.py       # GET /admin/stats
│       ├── cron.py              # POST /cron/recordatorios
│       └── pagos.py             # POST /pagos/checkout + /pagos/webhook
├── chatbot/
│   ├── states.py                # TypedDict: ChatState, ReservationInfo
│   ├── nodes.py                 # Nodos LangGraph
│   ├── edges.py                 # Rutas condicionales
│   ├── graph.py                 # StateGraph compilado
│   └── session_store.py         # Redis + fallback in-memory, TTL 24h
├── notifications/
│   └── email.py                 # Resend: confirmación + recordatorio
├── reservaciones/
│   ├── models.py                # ORM: Reservacion
│   ├── repository.py            # Queries, conflictos, recordatorios pendientes
│   ├── service.py               # Lógica de negocio + dispara email
│   └── schemas.py               # Pydantic schemas
├── terrazas/
│   ├── models.py                # ORM: Terraza
│   ├── repository.py            # Queries
│   └── schemas.py               # Pydantic schemas
├── auth/
│   ├── service.py               # Validación de credenciales + JWT
│   └── dependencies.py          # Dependency: get_current_admin
└── shared/
    ├── config.py                # pydantic-settings (todas las variables)
    ├── database.py              # Engine + SessionLocal + get_db()
    └── llm.py                   # ChatOpenAI factory (OpenRouter)
```

### Flujo LangGraph

```
GREETING → COLLECTING_INFO → CHECKING_AVAILABILITY → CONFIRMING → BOOKING → COMPLETED
    │                               │
    └──→ CANCELLATION           ERROR → COLLECTING_INFO
```

---

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| `POST` | `/chat` | — | Enviar mensaje al chatbot (20 req/min) |
| `GET` | `/reservaciones` | JWT | Listar reservaciones |
| `DELETE` | `/reservaciones/{codigo}` | JWT | Cancelar reservación |
| `GET` | `/disponibilidad` | — | Verificar disponibilidad de horario |
| `GET` | `/terrazas` | — | Terrazas activas (pública) |
| `POST` | `/auth/login` | — | Obtener JWT |
| `GET` | `/terrazas/admin` | JWT | Todas las terrazas (admin) |
| `POST` | `/terrazas` | JWT | Crear terraza |
| `PUT` | `/terrazas/{id}` | JWT | Editar terraza |
| `GET` | `/admin/stats` | JWT | Stats del día/semana + ingresos |
| `POST` | `/pagos/checkout` | — | Crear Stripe Checkout Session |
| `POST` | `/pagos/webhook` | Stripe | Confirmar reservación al pago |
| `POST` | `/cron/recordatorios` | Secret | Enviar recordatorios 24h antes |
| `GET` | `/health` | — | Estado del servicio |
| `GET` | `/docs` | — | Swagger UI |

---

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | Sí | Railway la inyecta desde PostgreSQL |
| `OPENROUTER_API_KEY` | Sí | API key de openrouter.ai |
| `OPENROUTER_MODEL` | No | Modelo LLM (default: `stepfun/step-3.5-flash:free`) |
| `SECRET_KEY` | Sí | Clave secreta JWT |
| `ADMIN_USERNAME` | Sí | Usuario del panel admin |
| `ADMIN_PASSWORD` | Sí | Contraseña del panel admin |
| `ALLOWED_ORIGINS` | Sí | Orígenes CORS separados por coma |
| `REDIS_URL` | No | Redis para sesiones persistentes |
| `RESEND_API_KEY` | No | API key de resend.com para emails |
| `RESEND_FROM_EMAIL` | No | Dirección remitente |
| `CRON_SECRET` | No | Secret para el endpoint `/cron/recordatorios` |
| `STRIPE_SECRET_KEY` | No | API key de Stripe |
| `STRIPE_WEBHOOK_SECRET` | No | Signing secret del webhook de Stripe |
| `FRONTEND_URL` | No | URL del frontend (para redirects de Stripe) |
| `SENTRY_DSN` | No | DSN de Sentry para monitoreo de errores |

---

## Quickstart local

```bash
# 1. Clonar e instalar
git clone <repo>
cd ComoCaidoDelCielo
pip install -r requirements.txt

# 2. Variables mínimas para dev
echo "OPENROUTER_API_KEY=sk-or-..." > .env
echo "SECRET_KEY=dev-secret" >> .env
echo "ADMIN_USERNAME=admin" >> .env
echo "ADMIN_PASSWORD=admin" >> .env

# 3. Correr (SQLite automático en dev)
uvicorn src.api.main:app --reload

# 4. Frontend
cd frontend && npm install && npm run dev
```

## Tests

```bash
pytest tests/          # 41 tests, SQLite en memoria, sin servicios externos
```

---

## Deploy

El archivo `railway.toml` ejecuta `alembic upgrade head` automáticamente antes de iniciar el servidor. El frontend se despliega en Vercel con `frontend/` como root directory y `NEXT_PUBLIC_API_URL` apuntando a Railway.

---

## Terrazas

| Nombre | Capacidad | Precio/hora |
|--------|-----------|-------------|
| Terraza Jardín | 30 personas | $800 |
| Terraza Vista al Mar | 50 personas | $1,500 |
| Terraza Privada VIP | 12 personas | $600 |

---

## Roadmap

### Fase 1 — Backend completo ✅
- [x] FastAPI + LangGraph — flujo FSM con 7 estados
- [x] PostgreSQL en Railway — reservaciones persistentes con detección de conflictos
- [x] JWT auth + endpoints admin
- [x] CRUD de terrazas
- [x] Dashboard stats (día, semana, ingresos estimados)
- [x] 38 tests unitarios

### Fase 2 — Frontend público ✅
- [x] Landing page — hero, grid de terrazas desde API real, features, CTA
- [x] Chatbot web — burbujas, typing indicator, auto-scroll, sesión UUID
- [x] Design system — Tailwind con paleta personalizada
- [x] Deploy en Vercel

### Fase 3 — Panel de administración ✅
- [x] Login — JWT en localStorage, guard de rutas
- [x] Dashboard — 4 stats + tabla de ocupación con barras de progreso
- [x] Tabla de reservaciones — filtro por estado, búsqueda, cancelación inline
- [x] CRUD de terrazas — modal crear/editar, toggle activa/inactiva

### Fase 4 — Notificaciones y disponibilidad ✅
- [x] Email de confirmación — Resend, HTML, fire-and-forget
- [x] Recordatorio 24h antes — cron endpoint + columna `recordatorio_enviado`
- [x] Vista de disponibilidad — `/disponibilidad` con selector visual y CTA al chat

### Fase 5 — Robustez y escala ✅
- [x] Redis — sesiones persistentes con fallback in-memory, TTL 24h
- [x] Rate limiting — slowapi 20 req/min por IP en `/chat`
- [x] Stripe — checkout + webhook para confirmar reservaciones al pago
- [x] Sentry — monitoreo de errores en producción
- [x] Tests E2E — booking completo, conflicto y cancelación con LLM mockeado (41 tests)

---

## Próximas mejoras — Fase 6

### Inteligencia del asistente
- [ ] **Memoria de preferencias** — el agente recuerda terraza y horario favorito del cliente por email
- [ ] **Consulta de reservación activa** — el cliente puede preguntar "¿cuál es mi reservación?" y el agente la busca por email o código
- [ ] **Sugerencia inteligente de horarios** — si el slot está ocupado, el agente propone el siguiente disponible automáticamente
- [ ] **Manejo de ambigüedad** — si el cliente dice "el sábado a las 7" sin especificar terraza, el agente propone opciones según disponibilidad real
- [ ] **Flujo de modificación** — el cliente puede cambiar fecha u horario de una reservación existente sin cancelar y volver a reservar
- [ ] **Contexto multiturno mejorado** — el agente no olvida datos entre sesiones para el mismo email

### Experiencia de usuario
- [ ] **Widget embebible** — botón flotante de chat para incrustar en cualquier sitio web con un `<script>`
- [ ] **Página de confirmación** — `/reservacion/{codigo}` pública con QR y detalles, útil para mostrar en entrada
- [ ] **Selector de horarios visual** — timeline por terraza en `/disponibilidad` que muestre slots ocupados/libres del día
- [ ] **WhatsApp Business** — mismo agente LangGraph conectado a la API de WhatsApp Cloud

### Operaciones
- [ ] **Panel de métricas del LLM** — latencia promedio, tasa de conversión (GREETING → COMPLETED), abandono por estado
- [ ] **Exportar reservaciones** — botón en admin para descargar CSV del rango de fechas seleccionado
- [ ] **Multi-negocio** — soporte para múltiples restaurantes con su propia BD, admin y subdomain
- [ ] **Notificación al admin** — email o Slack cuando llega una reservación nueva

---

## Ejemplo de conversación

```
Usuario:  quiero reservar una terraza para el sábado
Agente:   ¡Hola! Con gusto. Tenemos 3 terrazas disponibles...
          ¿Cuál te interesa y para cuántas personas?

Usuario:  la terraza jardín para 15 personas, de 6pm a 9pm
Agente:   Perfecto. ¿Me das tu nombre y correo para la reservación?

Usuario:  Ana García, ana@gmail.com
Agente:   Resumen: Terraza Jardín · 2026-04-05 · 18:00–21:00 · 15 personas
          ¿Confirmamos?

Usuario:  sí
Agente:   ¡Reservación confirmada! Tu código es RES-00002.
          Guárdalo para futuras referencias.
```
