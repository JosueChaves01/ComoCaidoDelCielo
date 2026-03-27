'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-primary-dark/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-accent font-serif text-xl font-bold tracking-wide">
              Como Caído del Cielo
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#terrazas" className="text-white/80 hover:text-accent transition-colors text-sm">
              Terrazas
            </Link>
            <Link href="/#nosotros" className="text-white/80 hover:text-accent transition-colors text-sm">
              Nosotros
            </Link>
            <Link href="/#contacto" className="text-white/80 hover:text-accent transition-colors text-sm">
              Contacto
            </Link>
            <Link
              href="/chat"
              className="bg-accent hover:bg-accent-dark text-primary-dark font-semibold text-sm px-5 py-2 rounded-full transition-colors"
            >
              Reservar ahora
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-primary-dark border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          <Link href="/#terrazas" onClick={() => setOpen(false)} className="text-white/80 hover:text-accent">Terrazas</Link>
          <Link href="/#nosotros" onClick={() => setOpen(false)} className="text-white/80 hover:text-accent">Nosotros</Link>
          <Link href="/#contacto" onClick={() => setOpen(false)} className="text-white/80 hover:text-accent">Contacto</Link>
          <Link
            href="/chat"
            onClick={() => setOpen(false)}
            className="bg-accent text-primary-dark font-semibold px-5 py-2 rounded-full text-center"
          >
            Reservar ahora
          </Link>
        </div>
      )}
    </nav>
  )
}
