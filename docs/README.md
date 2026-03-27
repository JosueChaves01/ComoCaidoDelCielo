# Como Caído del Cielo 🌿

Chatbot de reservaciones para una empresa de alquiler de terrazas. El agente conversacional guía al cliente desde el saludo hasta la confirmación de su cita, con verificación de disponibilidad en tiempo real y persistencia en PostgreSQL.

**API en producción:** `https://superb-bravery-production.up.railway.app`
**Documentación interactiva:** `https://superb-bravery-production.up.railway.app/docs`

---

## Stack

| Capa | Tecnología |
|------|------------|
| API | FastAPI + Uvicorn |
| Flujo conversacional | LangGraph (FSM con estados definidos) |
| LLM | OpenRouter (`stepfun/step-3.5-flash:free`) |
| Base de datos | PostgreSQL (Railway) |
| ORM + migraciones | SQLAlchemy 2 + Alembic |
| Deploy | Railway (web + DB en un solo proveedor) |

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

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/chat` | Enviar mensaje al chatbot |
| `GET` | `/reservaciones` | Listar todas las reservaciones |
| `DELETE` | `/reservaciones/{codigo}` | Cancelar una reservación |
| `GET` | `/disponibilidad` | Verificar disponibilidad de horario |
| `GET` | `/health` | Estado del servicio |
| `GET` | `/docs` | Swagger UI |

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
pytest tests/          # 23 tests, SQLite en memoria, sin servicios externos
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

### Frontend web (prioridad alta)
- [ ] **Widget de chat embebible** — componente React/Vue que se integra en cualquier sitio web con una sola línea de código (`<script src="...">`)
- [ ] **Página de reservaciones standalone** — interfaz completa con el chatbot, calendario visual de disponibilidad y confirmación animada
- [ ] **Burbuja flotante** — botón de chat en esquina inferior derecha, estilo Intercom/Zendesk, con contador de mensajes no leídos
- [ ] **Vista de disponibilidad tipo calendario** — grid mensual que muestra horarios libres/ocupados por terraza antes de iniciar conversación

### Experiencia conversacional
- [ ] **Memoria persistente de sesión** — reemplazar el dict en memoria por Redis para que las conversaciones sobrevivan reinicios del servidor
- [ ] **Reconocimiento de fechas en lenguaje natural** — interpretar "este sábado", "el próximo viernes a las 3" sin requerir formato ISO
- [ ] **Flujo de modificación de reservación** — permitir cambiar fecha/hora de una reservación existente (actualmente solo se puede cancelar)
- [ ] **Confirmación por email** — enviar correo con código de reservación y detalles al confirmar (usando Resend o SendGrid)
- [ ] **Recordatorio 24h antes** — tarea programada (Railway Cron) que envía recordatorio al email del cliente

### Administración
- [ ] **Panel de administración** — dashboard web para el dueño del negocio: ver todas las reservaciones, bloquear horarios, gestionar terrazas
- [ ] **Autenticación de admin** — JWT para proteger endpoints de gestión (`POST /terrazas`, `PUT /reservaciones/{id}`, etc.)
- [ ] **API para gestionar terrazas** — endpoints para crear, editar y desactivar terrazas sin tocar la base de datos directamente
- [ ] **Reportes de ocupación** — gráficas de reservaciones por terraza, hora pico, ingresos estimados por período

### Robustez y escala
- [ ] **Rate limiting** — limitar peticiones por IP en `/chat` para evitar abuso del LLM
- [ ] **Webhook de pago** — integrar Stripe o MercadoPago para cobrar un depósito al confirmar la reservación
- [ ] **Multi-idioma** — detectar idioma del usuario y responder en español o inglés automáticamente
- [ ] **Monitoreo** — integrar Sentry para errores y un dashboard de métricas (tiempo de respuesta del LLM, tasa de reservaciones completadas)
- [ ] **Tests E2E** — flujo completo con LLM mockeado: desde saludo hasta reservación en base de datos

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
