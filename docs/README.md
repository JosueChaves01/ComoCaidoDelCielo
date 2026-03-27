# Como Caído del Cielo 🌿

Chatbot de reservaciones para una empresa de alquiler de terrazas. El agente conversacional guía al cliente desde el saludo hasta la confirmación de su cita, con verificación de disponibilidad en tiempo real y persistencia en PostgreSQL.

**API en producción:** `https://superb-bravery-production.up.railway.app`
**Documentación interactiva:** `https://superb-bravery-production.up.railway.app/docs`
**Frontend en producción:** _(pendiente — conectar repo en vercel.com/new)_

---

## Stack

| Capa | Tecnología |
|------|------------|
| API | FastAPI + Uvicorn |
| Flujo conversacional | LangGraph (FSM con estados definidos) |
| LLM | OpenRouter (`stepfun/step-3.5-flash:free`) |
| Base de datos | PostgreSQL (Railway) |
| ORM + migraciones | SQLAlchemy 2 + Alembic |
| Auth | JWT (python-jose) |
| Frontend | Next.js 14 + Tailwind CSS |
| Deploy backend | Railway (web + DB) |
| Deploy frontend | Vercel |

---

## Arquitectura

```
src/
├── api/
│   ├── main.py                  # FastAPI app, CORS, lifespan
│   ├── schemas.py               # Pydantic request/response
│   └── routes/
│       ├── chat.py              # POST /chat
│       ├── reservaciones.py     # GET/DELETE /reservaciones
│       └── disponibilidad.py    # GET /disponibilidad
├── chatbot/
│   ├── states.py                # TypedDict: ChatState, ReservationInfo
│   ├── nodes.py                 # Nodos LangGraph (greeting, collect, booking…)
│   ├── edges.py                 # Rutas condicionales entre estados
│   ├── graph.py                 # StateGraph compilado
│   └── session_store.py         # Sesiones en memoria (dict)
├── reservaciones/
│   ├── models.py                # ORM: Reservacion
│   ├── repository.py            # Queries + detección de conflictos
│   ├── service.py               # Lógica de negocio
│   └── schemas.py               # Pydantic schemas
├── terrazas/
│   ├── models.py                # ORM: Terraza
│   ├── repository.py            # Queries
│   └── schemas.py               # Pydantic schemas
└── shared/
    ├── config.py                # pydantic-settings
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
| `POST` | `/chat` | — | Enviar mensaje al chatbot |
| `GET` | `/reservaciones` | — | Listar todas las reservaciones |
| `DELETE` | `/reservaciones/{codigo}` | — | Cancelar una reservación |
| `GET` | `/disponibilidad` | — | Verificar disponibilidad de horario |
| `GET` | `/terrazas` | — | Listar terrazas activas (vista pública) |
| `POST` | `/auth/login` | — | Obtener JWT de administrador |
| `GET` | `/terrazas/admin` | JWT | Listar todas las terrazas (admin) |
| `POST` | `/terrazas` | JWT | Crear nueva terraza |
| `PUT` | `/terrazas/{id}` | JWT | Editar terraza |
| `GET` | `/admin/stats` | JWT | Stats del día/semana + ingresos |
| `GET` | `/health` | — | Estado del servicio |
| `GET` | `/docs` | — | Swagger UI |

---

## Quickstart local

```bash
# 1. Clonar e instalar dependencias
git clone <repo>
cd ComoCaidoDelCielo
pip install -r requirements.txt

# 2. Configurar variables
cp config/.env.example .env
# Editar .env con tus valores

# 3. Correr en desarrollo (usa SQLite automáticamente)
uvicorn src.api.main:app --reload

# 4. Abrir docs
open http://localhost:8000/docs
```

## Tests

```bash
pytest tests/          # 38 tests, SQLite en memoria, sin servicios externos
```

---

## Deploy (Railway)

```bash
railway login
railway init
railway add --database postgres
railway variables set OPENROUTER_API_KEY=sk-or-...
railway up
railway run python scripts/seed_terrazas.py
```

El archivo `railway.toml` ejecuta automáticamente `alembic upgrade head` antes de iniciar el servidor.

---

## Variables de entorno

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `DATABASE_URL` | Sí | Railway la inyecta automáticamente desde PostgreSQL |
| `OPENROUTER_API_KEY` | Sí | API key de [openrouter.ai](https://openrouter.ai) |
| `OPENROUTER_MODEL` | No | Modelo LLM (default: `stepfun/step-3.5-flash:free`) |
| `SECRET_KEY` | Sí | Clave secreta para la app |
| `ENVIRONMENT` | No | `development` / `production` |
| `ALLOWED_ORIGINS` | No | Orígenes CORS permitidos (separados por coma) |

---

## Terrazas disponibles

| ID | Nombre | Capacidad | Precio/hora |
|----|--------|-----------|-------------|
| 1 | Terraza Jardín | 30 personas | $800 |
| 2 | Terraza Vista al Mar | 50 personas | $1,500 |
| 3 | Terraza Privada VIP | 12 personas | $600 |

---

## Roadmap

### Fase 1 — Backend completo ✅
- [x] **FastAPI + LangGraph** — API REST con flujo FSM (GREETING → BOOKING → COMPLETED)
- [x] **PostgreSQL en Railway** — reservaciones persistentes con detección de conflictos de horario
- [x] **JWT auth + admin endpoints** — `POST /auth/login`, rutas protegidas con Bearer token
- [x] **CRUD de terrazas** — `GET/POST/PUT /terrazas`, incluyendo vista pública y admin
- [x] **Dashboard stats** — `GET /admin/stats` con reservaciones del día, semana e ingresos estimados
- [x] **38 tests** — SQLite en memoria, sin servicios externos

### Fase 2 — Frontend público ✅
- [x] **Landing page** — hero, grid de terrazas desde API real, sección de features, CTA
- [x] **Chatbot web** — `/chat` con burbujas, typing indicator, auto-scroll, sesión UUID
- [x] **Design system** — Tailwind con paleta personalizada (verde primario, dorado, crema)
- [x] **Deploy en Vercel** — `frontend/` como root, variable `NEXT_PUBLIC_API_URL` configurada

### Fase 3 — Panel de administración (siguiente)
- [ ] **Login page** — `/admin/login` con form → `POST /auth/login` → guarda JWT en cookie
- [ ] **Dashboard** — `/admin` con las stats del día (reservaciones, ingresos, ocupación)
- [ ] **Tabla de reservaciones** — `/admin/reservaciones` con filtros por fecha/terraza y botón cancelar
- [ ] **CRUD de terrazas UI** — `/admin/terrazas` para crear, editar y desactivar terrazas

### Fase 4 — Pulido y notificaciones
- [ ] **Confirmación por email** — enviar código de reservación al confirmar (Resend o SendGrid)
- [ ] **Recordatorio 24h antes** — Railway Cron que envía email al cliente
- [ ] **Burbuja flotante** — widget de chat embebible (botón esquina inferior derecha)
- [ ] **Vista de disponibilidad** — calendario visual por terraza antes de iniciar el chat

### Fase 5 — Robustez y escala
- [ ] **Memoria persistente de sesión** — reemplazar dict en memoria por Redis
- [ ] **Rate limiting** — limitar peticiones por IP en `/chat`
- [ ] **Webhook de pago** — depósito al confirmar via Stripe o MercadoPago
- [ ] **Monitoreo** — Sentry para errores + métricas de LLM (latencia, tasa de conversión)
- [ ] **Tests E2E** — flujo completo con LLM mockeado

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
