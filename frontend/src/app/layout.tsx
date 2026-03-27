import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Como Caído del Cielo — Terrazas para Eventos',
  description:
    'Alquila terrazas exclusivas para tus eventos. Jardín, Vista al Mar y Privada VIP. Reserva en minutos con nuestro asistente virtual.',
  openGraph: {
    title: 'Como Caído del Cielo',
    description: 'Terrazas exclusivas para eventos únicos.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
