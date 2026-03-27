export interface Terraza {
  id: number
  nombre: string
  capacidad: number
  precio_hora: string
  descripcion: string | null
  activa: boolean
  created_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  session_id: string
  response: string
  current_state: string
  intent: string | null
}

export interface Reservacion {
  id: number
  codigo: string
  nombre_cliente: string
  email_cliente: string | null
  terraza_id: number
  fecha: string
  hora_inicio: string
  hora_fin: string
  num_personas: number
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada'
  notas: string | null
  created_at: string
}

export interface OcupacionTerraza {
  terraza_id: number
  nombre: string
  total_reservaciones: number
}

export interface DashboardStats {
  reservaciones_hoy: number
  reservaciones_semana: number
  ingresos_estimados_semana: number
  ocupacion_por_terraza: OcupacionTerraza[]
}

export interface TokenResponse {
  access_token: string
  token_type: string
}
