# Workflow n8n — ComoCaidoDelCielo

## Importar el workflow

1. Abre n8n (`http://localhost:5678`)
2. Ve a **Workflows → Import from file**
3. Selecciona `ComoCaidoDelCielo.workflow.json`
4. El workflow se importa en estado **inactivo** — no lo actives hasta configurar las credenciales

---

## Credenciales requeridas

Después de importar, abre cada nodo que lo pida y vincula la credencial correspondiente:

| Nodo | Tipo de credencial | Datos |
|------|--------------------|-------|
| `OpenRouter Chat Model` | OpenRouter API | API Key de [openrouter.ai](https://openrouter.ai) |
| `listar_terrazas`, `obtener_precios`, y todos los `*Tool` de Postgres | PostgreSQL | Host/puerto/usuario/contraseña de Supabase (modo directo o pooler) |
| `email_confirmacion_reserva`, `email_codigo_cancelacion`, `email_cancelada_simple`, `email_cancelada_reembolso` | SMTP | Host: `smtp.resend.com` · Puerto: `465` · Usuario: `resend` · Password: tu API Key de Resend |

### Obtener credenciales de Supabase
En el dashboard de Supabase → **Project Settings → Database**:
- Host: `db.<project-ref>.supabase.co`
- Puerto: `5432`
- Usuario: `postgres`
- Password: la que configuraste al crear el proyecto
- Base de datos: `postgres`

---

## Variables de entorno del frontend (`.env`)

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co/
VITE_SUPABASE_ANON_KEY=<anon-key>
VITE_N8N_CHAT_URL=/webhook/reservas
N8N_HOST_URL=http://localhost:5678
N8N_API_KEY=<tu-api-key-de-n8n>
```

El proxy de Vite redirige `/webhook/*` → `http://localhost:5678`, así que no hay CORS en desarrollo.

---

## Activar el workflow

1. Configura todas las credenciales
2. Activa el workflow con el toggle en la esquina superior derecha
3. El webhook queda disponible en `POST http://localhost:5678/webhook/reservas`
