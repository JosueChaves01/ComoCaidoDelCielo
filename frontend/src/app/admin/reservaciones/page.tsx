'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import { getReservaciones, cancelarReservacion } from '@/lib/api'
import type { Reservacion } from '@/lib/types'

const ESTADO_BADGE: Record<Reservacion['estado'], string> = {
  confirmada: 'bg-green-100 text-green-700',
  cancelada: 'bg-red-100 text-red-700',
  pendiente: 'bg-yellow-100 text-yellow-700',
  completada: 'bg-gray-100 text-gray-600',
}

export default function ReservacionesPage() {
  const { token } = useAdmin()
  const [reservaciones, setReservaciones] = useState<Reservacion[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState<string>('')
  const [busqueda, setBusqueda] = useState('')
  const [canceling, setCanceling] = useState<string | null>(null)

  async function load() {
    if (!token) return
    try {
      const data = await getReservaciones(token)
      setReservaciones(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function handleCancel(codigo: string) {
    if (!token) return
    setCanceling(codigo)
    try {
      await cancelarReservacion(codigo, token)
      await load()
    } finally {
      setCanceling(null)
    }
  }

  const filtered = useMemo(() => {
    return reservaciones.filter(r => {
      const matchEstado = !filtroEstado || r.estado === filtroEstado
      const q = busqueda.toLowerCase()
      const matchBusqueda = !q || r.nombre_cliente.toLowerCase().includes(q) || r.codigo.toLowerCase().includes(q)
      return matchEstado && matchBusqueda
    })
  }, [reservaciones, filtroEstado, busqueda])

  if (!token) return null

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Reservaciones</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-56"
          />
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los estados</option>
            <option value="confirmada">Confirmada</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelada">Cancelada</option>
            <option value="completada">Completada</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">Cargando...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Horario</th>
                <th className="px-4 py-3 text-left">Personas</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-400">Sin resultados</td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{r.codigo}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.nombre_cliente}</td>
                    <td className="px-4 py-3 text-gray-500">{r.email_cliente ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.fecha}</td>
                    <td className="px-4 py-3 text-gray-600">{r.hora_inicio}–{r.hora_fin}</td>
                    <td className="px-4 py-3 text-gray-600">{r.num_personas}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADO_BADGE[r.estado]}`}>
                        {r.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {(r.estado === 'confirmada' || r.estado === 'pendiente') && (
                        <button
                          onClick={() => handleCancel(r.codigo)}
                          disabled={canceling === r.codigo}
                          className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {canceling === r.codigo ? 'Cancelando...' : 'Cancelar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
