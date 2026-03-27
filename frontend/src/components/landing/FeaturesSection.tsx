import { Sparkles, Clock, MessageCircle } from 'lucide-react'

const features = [
  {
    icon: MessageCircle,
    title: 'Reserva en minutos',
    description:
      'Nuestro asistente virtual te guía paso a paso para completar tu reservación sin complicaciones.',
  },
  {
    icon: Clock,
    title: 'Disponibilidad en tiempo real',
    description:
      'Consulta horarios disponibles al instante y confirma tu evento sin esperas ni llamadas.',
  },
  {
    icon: Sparkles,
    title: 'Experiencias exclusivas',
    description:
      'Espacios cuidadosamente diseñados para que cada celebración sea única e irrepetible.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="nosotros" className="py-24 bg-primary-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-accent text-sm font-semibold uppercase tracking-widest">
            Por qué elegirnos
          </span>
          <h2 className="font-serif text-4xl font-bold text-white mt-2">
            La experiencia más sencilla
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
            >
              <div className="bg-accent/20 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                <f.icon size={22} className="text-accent" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
