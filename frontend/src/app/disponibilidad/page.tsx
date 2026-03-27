'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle, XCircle, Calendar } from 'lucide-react'
import { getTerrazas, checkDisponibilidad } from '@/lib/api'
import type { Terraza, AvailabilityResponse } from '@/lib/types'

export default function DisponibilidadPage() {
  const [terrazas, setTerrazas] = useState<Terraza[]>([])
  const [terrazaId, setTerrazaId] = useState<number | null>(null)
  const [fecha, setFecha] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')
  const [resultado, setResultado] = useState<AvailabilityResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getTerrazas().then(setTerrazas).catch(() => {})
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!terrazaId) return
    setResultado(null)
    setError('')
    setLoading(true)
    try {
      const res = await checkDisponibilidad(terrazaId, fecha, horaInicio, horaFin)
      setResultado(res)
    } catch {
      setError('No se pudo verificar la disponibilidad. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-cream py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Calendar className="text-primary" size={24} />
          </div>
          <h1 className="font-serif text-3xl text-primary font-bold">Verificar disponibilidad</h1>
          <p className="text-gray-500 mt-2">Consulta si tu terraza preferida está libre antes de reservar</p>
        </div>

        {/* Terraza selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {terrazas.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTerrazaId(t.id)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                terrazaId === t.id
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-200 bg-white hover:border-primary/40'
              }`}
            >
              <p className={`font-semibold text-sm ${terrazaId === t.id ? 'text-white' : 'text-gray-800'}`}>
                {t.nombre}
              </p>
              <p className={`text-xs mt-1 ${terrazaId === t.id ? 'text-white/70' : 'text-gray-400'}`}>
                {t.capacidad} personas · ${t.precio_hora}/hr
              </p>
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              min={today}
              onChange={e => setFecha(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
              <input
                type="time"
                value={horaInicio}
                onChange={e => setHoraInicio(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin</label>
              <input
                type="time"
                value={horaFin}
                onChange={e => setHoraFin(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !terrazaId}
            className="w-full bg-primary text-white rounded-lg py-3 text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar disponibilidad'}
          </button>
        </form>

        {/* Resultado */}
        {resultado && (
          <div
            className={`mt-6 rounded-2xl p-6 flex items-start gap-4 ${
              resultado.disponible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            {resultado.disponible ? (
              <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={22} />
            ) : (
              <XCircle className="text-red-600 shrink-0 mt-0.5" size={22} />
            )}
            <div>
              <p className={`font-semibold ${resultado.disponible ? 'text-green-800' : 'text-red-800'}`}>
                {resultado.disponible ? 'Disponible' : 'No disponible'}
              </p>
              <p className={`text-sm mt-1 ${resultado.disponible ? 'text-green-700' : 'text-red-700'}`}>
                {resultado.mensaje}
              </p>
              {resultado.disponible && (
                <a
                  href="/chat"
                  className="inline-block mt-3 bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-light transition-colors"
                >
                  Reservar ahora →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
