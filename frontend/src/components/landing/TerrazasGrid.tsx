import TerrazaCard from './TerrazaCard'
import type { Terraza } from '@/lib/types'

export default function TerrazasGrid({ terrazas }: { terrazas: Terraza[] }) {
  return (
    <section id="terrazas" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            Nuestros espacios
          </span>
          <h2 className="font-serif text-4xl font-bold text-primary-dark mt-2">
            Terrazas disponibles
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Cada terraza está diseñada para crear experiencias inolvidables. Elige
            la que mejor se adapte a tu evento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {terrazas.map((t) => (
            <TerrazaCard key={t.id} terraza={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
