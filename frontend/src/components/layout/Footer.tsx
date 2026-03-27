import Link from 'next/link'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer id="contacto" className="bg-primary-dark text-white/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-accent font-serif text-lg font-bold mb-3">
              Como Caído del Cielo
            </h3>
            <p className="text-sm leading-relaxed">
              Espacios únicos para momentos que no se olvidan. Terrazas exclusivas
              para tus eventos más especiales.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#terrazas" className="hover:text-accent transition-colors">Terrazas</Link></li>
              <li><Link href="/#nosotros" className="hover:text-accent transition-colors">Nosotros</Link></li>
              <li><Link href="/chat" className="hover:text-accent transition-colors">Hacer reservación</Link></li>
              <li><Link href="/admin/login" className="hover:text-accent transition-colors">Acceso admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin size={14} className="text-accent shrink-0" />
                <span>Ciudad, País</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-accent shrink-0" />
                <span>+1 (555) 000-0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-accent shrink-0" />
                <span>hola@comocaidodelcielo.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-xs">
          © {new Date().getFullYear()} Como Caído del Cielo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
