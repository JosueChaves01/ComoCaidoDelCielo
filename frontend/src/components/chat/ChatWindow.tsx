'use client'

import { useState, useRef, useEffect } from 'react'
import MessageBubble, { TypingIndicator } from './MessageBubble'
import ChatInput from './ChatInput'
import { sendMessage } from '@/lib/api'
import type { ChatMessage } from '@/lib/types'

const WELCOME: ChatMessage = {
  role: 'assistant',
  content:
    '¡Hola! Soy el asistente de Como Caído del Cielo. 🌿\n\n¿Te gustaría reservar una terraza, cancelar una reservación o tienes alguna consulta?',
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [sessionId] = useState(() => crypto.randomUUID())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text: string) => {
    setError(null)
    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await sendMessage(sessionId, text)
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }])
    } catch {
      setError('No se pudo conectar con el servidor. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && <TypingIndicator />}
        {error && (
          <div className="text-center text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3 border border-red-100">
            {error}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={handleSend} disabled={loading} />
    </div>
  )
}
