import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-24 bg-cream-dark">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <span className="text-accent text-sm font-semibold uppercase tracking-widest">
          Es muy fácil
        </span>
        <h2 className="font-serif text-4xl font-bold text-primary-dark mt-2 mb-4">
          ¿Listo para reservar?
        </h2>
        <p className="text-gray-500 mb-8 text-lg">
          Habla con nuestro asistente virtual y en pocos minutos tendrás tu terraza
          confirmada. Sin formularios complicados.
        </p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-3 bg-primary hover:bg-primary-light text-white font-bold px-10 py-5 rounded-full transition-all hover:scale-105 shadow-xl shadow-primary/20 text-lg"
        >
          <MessageCircle size={22} />
          Iniciar reservación
        </Link>
      </div>
    </section>
  )
}
