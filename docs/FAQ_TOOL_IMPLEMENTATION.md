# FAQ Tool Implementation - Instagram Workflow

**Fecha:** 2025-01-30  
**Workflow:** SobrePoxi - Instagram josue (ID: sNNzmEamKtPVMXDJ)  
**Estado:** ✅ DEPLOYED

---

## Resumen

Se ha añadido el tool **`consultar_faqs`** al workflow de Instagram para permitir que el AI Agent responda preguntas frecuentes sobre Como Caído del Cielo sin necesidad de intervención manual.

---

## Cambios Implementados

### 1. Nodo: `consultar_faqs` (PostgreSQL Tool)

**Ubicación:** n8n workflow > nodos

**Tipo:** `n8n-nodes-base.postgresTool`  
**ID del nodo:** `faq-tool-instagram-001`  
**Posición en canvas:** [1936, 800]

**Configuración:**
```sql
SELECT section, question, content 
FROM knowledge_base 
WHERE question ILIKE '%' || $1 || '%' 
   OR content ILIKE '%' || $1 || '%' 
ORDER BY similarity(question, $1) DESC 
LIMIT 2;
```

**Parámetro:**
- Acepta `query` del AI Agent (palabras clave de la pregunta del usuario)
- Ejemplo: `"terrazas"`, `"comida bebidas"`, `"hospedaje"`, `"horarios"`

**Base de datos:**
- Tabla: `knowledge_base`
- Columnas: `section`, `question`, `content`
- Credenciales: Postgres account (ID: `vTnDtof0aB7x04sZ`)

**Retorno:**
- Top 2 resultados ordenados por relevancia (similarity score)
- Formato: Array de objetos con `section`, `question`, `content`

---

### 2. Conexión: AI Agent ↔ consultar_faqs

**Tipo de conexión:** `ai_tool`

**Nodos conectados:**
- `AI Agent` (principal)
- `AI Agent1` (agente alterno)
- `AI Agent2` (agente backup)

**Configuración en JSON:**
```json
"consultar_faqs": {
  "ai_tool": [
    [
      {"node": "AI Agent", "type": "ai_tool", "index": 0},
      {"node": "AI Agent1", "type": "ai_tool", "index": 0},
      {"node": "AI Agent2", "type": "ai_tool", "index": 0}
    ]
  ]
}
```

---

### 3. Actualización: Prompt del AI Agent

**Campo:** `systemMessage` en nodo AI Agent

**Cambios:**

#### ✅ A. Tool registrado en lista
```
=====================
TOOLS DISPONIBLES
=====================
listar_terrazas
obtener_precios
buscar_terraza_disponible
buscar_disponibilidad_rango
consultar_disponibilidad
+ consultar_faqs          ← NUEVO
crear_reservacion
[...]
```

#### ✅ B. Nuevo flujo: PREGUNTAS FRECUENTES

```
=====================
FLUJO: PREGUNTAS FRECUENTES
=====================
Si el usuario pregunta sobre:
- Terrazas (características, vistas, capacidad)
- Comidas/bebidas disponibles
- Hospedaje en la zona
- Eventos especiales
- Horarios de atención
- Ubicación/cómo llegar

Ejecutar consultar_faqs(query) con palabras clave de la pregunta.
Ejemplos:
- "¿Qué terrazas hay?" → consultar_faqs("terrazas")
- "¿Qué comida sirven?" → consultar_faqs("comida bebidas")
- "¿Hay hospedaje?" → consultar_faqs("hospedaje alojamiento")
- "¿Qué horarios?" → consultar_faqs("horarios atención")

Si el usuario NO está reservando y hace una pregunta general: ofrecer siempre ejecutar consultar_faqs primero.
Si hay resultados: presentarlos en texto natural, NO repitas la estructura de base datos.
Si no hay resultados: responder con lo que sabes de Como Caído del Cielo.
```

---

## Casos de Uso

### Caso 1: Pregunta sobre Terrazas
```
Usuario: "¿Cuáles son las terrazas disponibles?"

→ AI Agent ejecuta: consultar_faqs("terrazas")
→ Base de datos retorna: Información sobre cada terraza
→ AI Agent responde en texto natural

Respuesta: "Tenemos 3 terrazas principales: La Vista del Cielo (10 personas), 
Mirador Privado (8 personas) y Terraza Abierta (15 personas). ¿Cuál te interesa?"
```

### Caso 2: Pregunta sobre Comida
```
Usuario: "¿Qué tipo de comida sirven?"

→ AI Agent ejecuta: consultar_faqs("comida bebidas")
→ Retorna: Menú disponible, opciones, horarios
→ AI Agent responde en texto natural

Respuesta: "Ofrecemos cocina costarricense con opciones vegetarianas, 
bebidas refrescantes y cócteles. ¿Te gustaría una reservación?"
```

### Caso 3: Pregunta sobre Hospedaje
```
Usuario: "¿Hay dónde dormir cerca?"

→ AI Agent ejecuta: consultar_faqs("hospedaje alojamiento")
→ Retorna: Opciones de hospedaje en la zona
→ AI Agent responde en texto natural

Respuesta: "La zona tiene opciones de hospedaje desde económico hasta premium.
Te recomiendo preguntarme sobre disponibilidad de terrazas primero 😊"
```

---

## Precondiciones

✅ **Base de datos:** La tabla `knowledge_base` debe existir en Postgres  
✅ **Datos:** Debe haber registros en `knowledge_base` con Q&A de Como Caído del Cielo  
✅ **Credenciales:** Postgres está configurada con el ID `vTnDtof0aB7x04sZ`

---

## Verificación Post-Deploy

```
✅ Nodo consultar_faqs existe en el workflow
✅ Tipo: n8n-nodes-base.postgresTool (correcto)
✅ Conexión ai_tool desde AI Agent (activa)
✅ Prompt incluye tool en lista de disponibles
✅ Instrucciones de flujo FAQ en systemMessage
✅ Workflow activo: sNNzmEamKtPVMXDJ
```

---

## Diferencias vs ComoCaidoDelCieloCopia

| Aspecto | ComoCaidoDelCieloCopia | Instagram (Actualizado) |
|--------|----------------------|--------------------------|
| Nodo FAQ | ✅ Sí | ✅ Sí (nuevo) |
| Node ID | `faq-tool-mirador-001` | `faq-tool-instagram-001` |
| Conexión AI | ✅ Configurada | ✅ Configurada |
| Prompt FAQ | ✅ Sí | ✅ Sí (nuevo) |
| AI Agents | 1 | 3 (AI Agent, AI Agent1, AI Agent2) |

---

## Próximos Pasos

1. **Validar base de datos:** Verificar que `knowledge_base` contiene preguntas sobre Como Caído del Cielo
2. **Prueba end-to-end:** Enviar mensaje por Instagram con pregunta FAQ
3. **Monitoreo:** Revisar logs para asegurar que consultar_faqs se ejecuta correctamente
4. **Ajuste de prompts:** Si los resultados no son claros, refinar la descripción del tool en el prompt

---

## Deployment Record

**Fecha:** 2025-01-30  
**Método:** n8n MCP API (PUT /api/v1/workflows/{id})  
**Payload size:** ~77 KB  
**Response:** ✅ Success  
**Time:** ~2s  

**Archivo local:** `C:\Users\Salaz\Documents\ComoCaidoDelCielo\n8n\SobrePoxi  - Instagram josue.json`
