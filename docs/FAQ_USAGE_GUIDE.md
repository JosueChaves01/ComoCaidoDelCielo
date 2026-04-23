# FAQ Tool - Usage Guide

**Quick Start Guide for Using the `consultar_faqs` Tool**

---

## Overview

The `consultar_faqs` tool allows the AI Agent to retrieve frequently asked questions from the `knowledge_base` PostgreSQL table and answer user queries in natural language.

---

## How Users Trigger FAQ Queries

Users simply ask questions about Como Caído del Cielo in Instagram DM:

### Category: Terrazas (Views, Capacity, Features)

| User Question | AI Extracts | Tool Call | Result |
|---|---|---|---|
| "¿Qué terrazas hay?" | "terrazas" | `consultar_faqs("terrazas")` | Top 2 terrace descriptions |
| "¿Cuántas personas caben?" | "capacidad personas" | `consultar_faqs("capacidad personas")` | Capacity info for each terrace |
| "¿Hay vistas al mar?" | "vistas mar" | `consultar_faqs("vistas mar")` | View descriptions |

### Category: Comida & Bebidas

| User Question | AI Extracts | Tool Call | Result |
|---|---|---|---|
| "¿Qué comida sirven?" | "comida" | `consultar_faqs("comida")` | Menu options |
| "¿Hay opciones vegetarianas?" | "vegetariano opciones" | `consultar_faqs("vegetariano")` | Vegetarian menu |
| "¿Qué bebidas tienen?" | "bebidas" | `consultar_faqs("bebidas")` | Drink menu |

### Category: Hospedaje (Accommodation)

| User Question | AI Extracts | Tool Call | Result |
|---|---|---|---|
| "¿Dónde me puedo quedar?" | "hospedaje alojamiento" | `consultar_faqs("hospedaje")` | Accommodation options |
| "¿Hay hoteles cerca?" | "hoteles cerca" | `consultar_faqs("hoteles")` | Nearby hotels |

### Category: Horarios (Hours)

| User Question | AI Extracts | Tool Call | Result |
|---|---|---|---|
| "¿Qué horarios tienen?" | "horarios atención" | `consultar_faqs("horarios")` | Operating hours |
| "¿Atienden los domingos?" | "domingos atención" | `consultar_faqs("domingos")` | Sunday hours |

### Category: Ubicación (Location)

| User Question | AI Extracts | Tool Call | Result |
|---|---|---|---|
| "¿Cómo llego?" | "ubicación dirección" | `consultar_faqs("ubicación")` | Directions |
| "¿Dónde queda?" | "ubicación localización" | `consultar_faqs("localización")` | Location info |

### Category: Eventos (Events)

| User Question | AI Extracts | Tool Call | Result |
|---|---|---|---|
| "¿Pueden hacer eventos?" | "eventos bodas" | `consultar_faqs("eventos")` | Event info |
| "¿Tienen paquetes para bodas?" | "bodas paquetes" | `consultar_faqs("bodas")` | Wedding packages |

---

## Expected Responses

### Database Returns Top 2 Results

```json
[
  {
    "section": "Terrazas",
    "question": "¿Qué terrazas hay?",
    "content": "Contamos con 3 terrazas exclusivas: La Vista del Cielo (10 personas, vistas al valle), Mirador Privado (8 personas, jacuzzi privado), Terraza Abierta (15 personas, área social)."
  },
  {
    "section": "Terrazas",
    "question": "¿Cuál es la capacidad máxima?",
    "content": "La capacidad máxima de nuestra terraza más grande es de 15 personas. Para grupos más grandes, podemos combinar terrazas."
  }
]
```

### AI Agent Formats for User

The AI Agent converts database results into natural language:

```
📍 Usuario: "¿Qué terrazas hay?"

🤖 Respuesta del AI Agent:
"Tenemos 3 terrazas increíbles: La Vista del Cielo (10 personas con vistas al valle), 
Mirador Privado (8 personas con jacuzzi), y Terraza Abierta (15 personas). 
¿Cuál te atrae más? 🌅"
```

---

## FAQ Database Schema

### knowledge_base Table

```sql
CREATE TABLE knowledge_base (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50),        -- Category: Terrazas, Comida, Hospedaje, Horarios, etc.
  question TEXT,              -- FAQ question
  content TEXT,               -- Detailed answer
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Sample Data

```sql
INSERT INTO knowledge_base (section, question, content) VALUES

-- Terrazas
('Terrazas', '¿Qué terrazas hay?', 
 'Contamos con 3 terrazas exclusivas: La Vista del Cielo (10 personas), Mirador Privado (8 personas), Terraza Abierta (15 personas).'),

('Terrazas', '¿Cuántos huéspedes caben?',
 'Máximo 15 personas por terraza. Para grupos más grandes, podemos combinar espacios.'),

('Terrazas', '¿Hay vistas?',
 'Sí, todas nuestras terrazas ofrecen vistas panorámicas del valle y cordillera.'),

-- Comida
('Comida', '¿Qué comida sirven?',
 'Cocina costarricense con toque gourmet. Ofrecemos menú fijo y opciones personalizadas.'),

('Comida', '¿Hay opciones vegetarianas?',
 'Sí, contamos con menú vegetariano completo. Avisanos con anticipación si hay alergias.'),

('Comida', '¿Incluye bebidas?',
 'Las bebidas se facturan aparte. Contamos con agua, refrescos naturales, vinos y cócteles.'),

-- Hospedaje
('Hospedaje', '¿Dónde puedo alojarme?',
 'Hay varias opciones en la zona: desde hospedajes económicos hasta resorts de lujo a 10-30 min.'),

-- Horarios
('Horarios', '¿Qué horarios tienen?',
 'Abiertos de miércoles a domingo, de 10:00 a 18:00. Consulta por eventos especiales.'),

('Horarios', '¿Atienden los lunes?',
 'No, estamos cerrados lunes y martes. Abiertos de miércoles a domingo.'),

-- Ubicación
('Ubicación', '¿Cómo llego?',
 'Estamos en las alturas de [UBICACIÓN]. Coordenadas GPS: [LAT, LONG]. Recibe instrucciones personalizadas al reservar.'),

-- Eventos
('Eventos', '¿Puedo hacer una boda?',
 'Sí, ofrecemos paquetes para bodas, cumpleaños y eventos corporativos. Consultanos para detalles.'),

('Eventos', '¿Qué capacidad tienen para eventos?',
 'Máximo 100 personas si combinamos todos los espacios. Servicio completo de catering disponible.');
```

---

## When FAQ Tool Is Triggered

### ✅ User Initiates FAQ

```
User input: "¿Cuál es el horario?"

Flow:
1. Message arrives at webhookStart
2. "Detect Message Type (IG Aware)" confirms it's TEXT
3. AI Agent analyzes: This is a FAQ question
4. Extracts keywords: "horario"
5. Calls: consultar_faqs("horario")
6. Receives: [{"section": "Horarios", "question": "¿Qué horarios..."}]
7. Formats response
8. Sends to Instagram
```

### ❌ FAQ Not Triggered (Still Uses AI Agent)

```
User input: "Quiero reservar para 4 personas el domingo"

This triggers RESERVATION FLOW, not FAQ:
1. AI Agent identifies: Reservation request
2. Asks for: Date confirmation, personal info
3. Executes: criar_reservacion, etc.
4. FAQ tool NOT used

Note: If user asks about hours DURING reservation, FAQ can be triggered
```

---

## AI Agent Behavior Rules

### Rule 1: When to Use FAQ Tool

The AI Agent automatically uses `consultar_faqs` when:
- User is NOT in middle of a reservation
- User asks general questions about Como Caído del Cielo
- No specific tool is needed (pricing, availability, booking)

### Rule 2: When NOT to Use FAQ Tool

The AI Agent uses other tools when:
- User is making/canceling a reservation
- User asks about pricing (uses `obtener_precios`)
- User asks about availability (uses `buscar_disponibilidad_rango`)
- User needs to confirm payment (uses `actualizar_comprobante`)

### Rule 3: Response Format

AI Agent always:
1. Gets results from `consultar_faqs`
2. Converts to natural language (NOT database format)
3. Adds context from Como Caído del Cielo knowledge
4. Keeps it to 3-4 lines max
5. Ends with relevant call-to-action

---

## Monitoring FAQ Usage

### Check n8n Execution Logs

To see when `consultar_faqs` is executed:

1. Go to n8n Workflow: "SobrePoxi - Instagram josue"
2. Click "Executions" tab
3. Filter for successful executions
4. Look for nodes executing `consultar_faqs`
5. Check Input/Output tabs for query and results

### Query Examples in Logs

```
Input:   {"query": "terrazas"}
Output:  [
  {"section": "Terrazas", "question": "¿Qué terrazas hay?", "content": "..."},
  {"section": "Terrazas", "question": "¿Cuál es la capacidad?", "content": "..."}
]
```

---

## Troubleshooting

### Problem: FAQ Tool Returns Empty Results

**Cause:** `knowledge_base` table has no matching entries

**Solution:**
1. Check `knowledge_base` table exists
2. Verify data is populated
3. Test with generic keywords: `consultar_faqs("terrazas")`
4. Populate missing Q&A entries

### Problem: AI Agent Not Using FAQ Tool

**Cause:** Prompt doesn't recognize FAQ question

**Solution:**
1. Check AI Agent prompt includes FAQ section
2. Verify keywords in user question match database
3. Review similarity() PostgreSQL function works correctly
4. Test tool directly in n8n UI

### Problem: Results Are Irrelevant

**Cause:** Poor similarity matching or wrong keywords

**Solution:**
1. Expand `knowledge_base` with more Q&A entries
2. Use broader keywords in tool description
3. Adjust query parameters
4. Provide training data to AI Agent about Como Caído del Cielo

---

## Best Practices

✅ **DO:**
- Keep FAQ answers concise (2-3 sentences)
- Use clear section categories (Terrazas, Comida, etc.)
- Maintain consistent terminology
- Update `knowledge_base` regularly
- Test queries before deploying changes

❌ **DON'T:**
- Don't use JSON in database responses
- Don't include personal data (phone numbers, emails)
- Don't store sensitive operational details
- Don't create duplicate Q&A entries
- Don't forget to escape special characters in SQL

---

## FAQ Tool Node Configuration Reference

**Tool Description (for AI Agent):**
```
Consulta la base de conocimientos de Como Caído del Cielo para responder 
preguntas frecuentes sobre el lugar (terrazas, comida, hospedaje, eventos, 
horarios, ubicación, etc.). Recibe: query (texto con palabras clave de la 
pregunta del usuario, ej: 'terrazas', 'hospedaje', 'eventos', 'comida', 'horarios').
```

**SQL Query:**
```sql
SELECT section, question, content FROM knowledge_base 
WHERE question ILIKE '%' || $1 || '%' 
   OR content ILIKE '%' || $1 || '%' 
ORDER BY similarity(question, $1) DESC 
LIMIT 2;
```

**Parameters:**
- Input: `$fromAI("query", "Palabras clave de la pregunta del usuario")`
- Output: Array of objects with `section`, `question`, `content`

---

**Ready to use! Users can now ask FAQ questions on Instagram DM! 🚀**
