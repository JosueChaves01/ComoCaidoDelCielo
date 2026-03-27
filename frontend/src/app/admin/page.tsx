'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, CalendarCheck, DollarSign, Building2 } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import { getStats } from '@/lib/api'
import StatCard from '@/components/admin/StatCard'
import type { DashboardStats } from '@/lib/types'

export default function AdminDashboardPage() {
  const { token } = useAdmin()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    getStats(token)
      .then(setStats)
      .catch(() => setError('No se pudieron cargar las estadísticas'))
  }, [token])

  if (!token) return null

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Reservaciones hoy"
          value={stats?.reservaciones_hoy ?? '—'}
          icon={<CalendarDays size={22} />}
          color="text-primary"
        />
        <StatCard
          label="Reservaciones esta semana"
          value={stats?.reservaciones_semana ?? '—'}
          icon={<CalendarCheck size={22} />}
          color="text-primary-light"
        />
        <StatCard
          label="Ingresos est. (semana)"
          value={stats ? `$${Number(stats.ingresos_estimados_semana).toLocaleString('es-MX')}` : '—'}
          icon={<DollarSign size={22} />}
          color="text-accent"
        />
        <StatCard
          label="Terrazas activas"
          value={stats?.ocupacion_por_terraza.length ?? '—'}
          icon={<Building2 size={22} />}
          color="text-accent-dark"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">Ocupación por terraza</h2>
        </div>
        {stats && stats.ocupacion_por_terraza.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-6 py-3 text-left">Terraza</th>
                <th className="px-6 py-3 text-left">Reservaciones</th>
                <th className="px-6 py-3 text-left w-48">Ocupación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(() => {
                const max = Math.max(...stats.ocupacion_por_terraza.map(t => t.total_reservaciones), 1)
                return stats.ocupacion_por_terraza.map(t => (
                  <tr key={t.terraza_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{t.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{t.total_reservaciones}</td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(t.total_reservaciones / max) * 100}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              })()}
            </tbody>
          </table>
        ) : (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">
            {stats ? 'Sin datos de ocupación' : 'Cargando...'}
          </p>
        )}
      </div>
    </div>
  )
}
