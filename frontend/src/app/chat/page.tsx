import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ChatWindow from '@/components/chat/ChatWindow'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reservar terraza — Como Caído del Cielo',
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-primary-dark flex flex-col">
      {/* Header */}
      <header className="bg-primary-dark/95 border-b border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            href="/"
            className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-sm"
          >
            <ArrowLeft size={16} />
            Inicio
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-white font-serif font-bold text-lg">
              Como Caído del Cielo
            </h1>
            <p className="text-white/50 text-xs">Asistente de reservaciones</p>
          </div>
          {/* Status indicator */}
          <div className="flex items-center gap-1 text-xs text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            En línea
          </div>
        </div>
      </header>

      {/* Chat */}
      <main className="flex-1 flex flex-col max-w-2xl w-full mx-auto">
        <div className="flex-1 flex flex-col min-h-0">
          <ChatWindow />
        </div>
      </main>
    </div>
  )
}
