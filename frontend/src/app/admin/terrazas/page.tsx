'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import { getTerrazasAdmin, createTerraza, updateTerraza } from '@/lib/api'
import type { Terraza } from '@/lib/types'

interface TerrazaForm {
  nombre: string
  capacidad: string
  precio_hora: string
  descripcion: string
  activa: boolean
}

const EMPTY_FORM: TerrazaForm = {
  nombre: '',
  capacidad: '',
  precio_hora: '',
  descripcion: '',
  activa: true,
}

export default function TerrazasPage() {
  const { token } = useAdmin()
  const [terrazas, setTerrazas] = useState<Terraza[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Terraza | null>(null)
  const [form, setForm] = useState<TerrazaForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    if (!token) return
    try {
      const data = await getTerrazasAdmin(token)
      setTerrazas(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setModalOpen(true)
  }

  function openEdit(t: Terraza) {
    setEditing(t)
    setForm({
      nombre: t.nombre,
      capacidad: String(t.capacidad),
      precio_hora: t.precio_hora,
      descripcion: t.descripcion ?? '',
      activa: t.activa,
    })
    setError('')
    setModalOpen(true)
  }

  async function handleToggleActiva(t: Terraza) {
    if (!token) return
    await updateTerraza(t.id, { activa: !t.activa }, token)
    await load()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setError('')
    try {
      const payload = {
        nombre: form.nombre,
        capacidad: Number(form.capacidad),
        precio_hora: form.precio_hora,
        descripcion: form.descripcion || null,
        activa: form.activa,
      }
      if (editing) {
        await updateTerraza(editing.id, payload, token)
      } else {
        await createTerraza(payload, token)
      }
      setModalOpen(false)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (!token) return null

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Terrazas</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary-light transition-colors"
        >
          <Plus size={16} />
          Nueva terraza
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="px-6 py-8 text-gray-400 text-sm text-center">Cargando...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-100">
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Capacidad</th>
                <th className="px-6 py-3 text-left">Precio/hr</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {terrazas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">Sin terrazas</td>
                </tr>
              ) : (
                terrazas.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{t.nombre}</td>
                    <td className="px-6 py-4 text-gray-600">{t.capacidad} personas</td>
                    <td className="px-6 py-4 text-gray-600">${t.precio_hora}/hr</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActiva(t)}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          t.activa
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {t.activa ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEdit(t)}
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary-light"
                      >
                        <Pencil size={13} />
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-5">
              {editing ? 'Editar terraza' : 'Nueva terraza'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad</label>
                  <input
                    type="number"
                    min={1}
                    value={form.capacidad}
                    onChange={e => setForm(f => ({ ...f, capacidad: e.target.value }))}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio/hr</label>
                  <input
                    type="text"
                    value={form.precio_hora}
                    onChange={e => setForm(f => ({ ...f, precio_hora: e.target.value }))}
                    required
                    placeholder="500.00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activa"
                  checked={form.activa}
                  onChange={e => setForm(f => ({ ...f, activa: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="activa" className="text-sm text-gray-700">Terraza activa</label>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary text-white rounded-lg py-2 text-sm font-medium hover:bg-primary-light transition-colors disabled:opacity-60"
                >
                  {saving ? 'Guardando...' : editing ? 'Guardar cambios' : 'Crear terraza'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
