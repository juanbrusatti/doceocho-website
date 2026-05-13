'use client'

import { useEffect, useState } from 'react'
import { getContactMessages } from '@/actions/contact-messages'
import { ChevronDown, ChevronUp, Mail, Phone, Calendar, FileText, Download, Paperclip } from 'lucide-react'

interface Message {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  project_type: string | null
  message: string
  created_at: string
  file_urls: string[] | null
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMessages() {
      try {
        const result = await getContactMessages()
        if (result.success) {
          setMessages(result.messages)
        } else {
          setError(result.error || 'Failed to fetch messages')
        }
      } catch (err) {
        setError('An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-cream/60">Cargando mensajes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="bg-petroleum-light/20 border border-cream/10 rounded-lg p-6">
        <p className="text-cream/60 text-center">No hay mensajes todavía</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="bg-petroleum-light/20 border border-cream/10 rounded-lg overflow-hidden hover:border-gold/40 transition-colors duration-300"
        >
          <button
            onClick={() => setExpandedId(expandedId === message.id ? null : message.id)}
            className="w-full p-6 flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-gold" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-lg text-cream">
                  {message.last_name}, {message.first_name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-cream/60 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(message.created_at)}
                  </span>
                  {message.project_type && (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {message.project_type}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {expandedId === message.id ? (
              <ChevronUp className="w-5 h-5 text-gold" />
            ) : (
              <ChevronDown className="w-5 h-5 text-cream/60" />
            )}
          </button>

          {expandedId === message.id && (
            <div className="px-6 pb-6 pt-0 border-t border-cream/10">
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-cream/40 uppercase tracking-wider">Email</label>
                    <p className="text-cream mt-1">{message.email}</p>
                  </div>
                  {message.phone && (
                    <div>
                      <label className="text-xs text-cream/40 uppercase tracking-wider">Teléfono</label>
                      <p className="text-cream mt-1 flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {message.phone}
                      </p>
                    </div>
                  )}
                </div>
                {message.project_type && (
                  <div>
                    <label className="text-xs text-cream/40 uppercase tracking-wider">Tipo de Proyecto</label>
                    <p className="text-cream mt-1">{message.project_type}</p>
                  </div>
                )}
                {message.file_urls && message.file_urls.length > 0 && (
                  <div>
                    <label className="text-xs text-cream/40 uppercase tracking-wider flex items-center gap-2">
                      <Paperclip className="w-3 h-3" />
                      Archivos Adjuntos
                    </label>
                    <div className="mt-2 space-y-2">
                      {message.file_urls.map((url, index) => {
                        const fileName = url.split('/').pop() || `archivo-${index + 1}`
                        return (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-cream hover:text-gold transition-colors duration-300 text-sm"
                          >
                            <Download className="w-4 h-4" />
                            {fileName}
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs text-cream/40 uppercase tracking-wider">Mensaje</label>
                  <p className="text-cream mt-1 whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
