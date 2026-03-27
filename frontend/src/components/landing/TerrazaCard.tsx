import Link from 'next/link'
import { Users, Clock, ArrowRight } from 'lucide-react'
import type { Terraza } from '@/lib/types'

export default function TerrazaCard({ terraza }: { terraza: Terraza }) {
  const gradients = [
    'from-emerald-900 to-emerald-700',
    'from-teal-900 to-teal-700',
    'from-green-900 to-green-700',
  ]
  const gradient = gradients[(terraza.id - 1) % gradients.length]

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Image placeholder */}
      <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
        <span className="text-white/20 font-serif text-5xl font-bold">
          {terraza.nombre.charAt(0)}
        </span>
        <div className="absolute top-3 right-3">
          <span className="bg-accent text-primary-dark text-xs font-bold px-3 py-1 rounded-full">
            Disponible
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-xl font-bold text-primary-dark mb-2">
          {terraza.nombre}
        </h3>
        <p className="text-gray-500 text-sm mb-4 flex-1 leading-relaxed">
          {terraza.descripcion ?? 'Espacio exclusivo para tus eventos.'}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
          <span className="flex items-center gap-1">
            <Users size={14} className="text-primary" />
            Hasta {terraza.capacidad} personas
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-primary" />
            ${Number(terraza.precio_hora).toLocaleString()}/hora
          </span>
        </div>

        <Link
          href="/chat"
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-xl transition-colors group-hover:bg-accent group-hover:text-primary-dark"
        >
          Reservar esta terraza
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  )
}
