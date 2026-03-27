import type { ChatResponse, Terraza, Reservacion, DashboardStats, TokenResponse, AvailabilityResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(error.detail ?? 'Error de red')
  }
  return res.json()
}

export async function getTerrazas(): Promise<Terraza[]> {
  return request<Terraza[]>('/terrazas')
}

export async function sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
  return request<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, message }),
  })
}

export async function login(username: string, password: string): Promise<TokenResponse> {
  return request<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function getReservaciones(token: string): Promise<Reservacion[]> {
  return request<Reservacion[]>('/reservaciones', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function cancelarReservacion(codigo: string, token: string): Promise<Reservacion> {
  return request<Reservacion>(`/reservaciones/${codigo}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getStats(token: string): Promise<DashboardStats> {
  return request<DashboardStats>('/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getTerrazasAdmin(token: string): Promise<Terraza[]> {
  return request<Terraza[]>('/terrazas/admin', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function createTerraza(data: object, token: string): Promise<Terraza> {
  return request<Terraza>('/terrazas', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function updateTerraza(id: number, data: object, token: string): Promise<Terraza> {
  return request<Terraza>(`/terrazas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function checkDisponibilidad(
  terrazaId: number,
  fecha: string,
  horaInicio: string,
  horaFin: string,
): Promise<AvailabilityResponse> {
  const params = new URLSearchParams({
    terraza_id: String(terrazaId),
    fecha,
    hora_inicio: horaInicio,
    hora_fin: horaFin,
  })
  return request<AvailabilityResponse>(`/disponibilidad?${params}`)
}
