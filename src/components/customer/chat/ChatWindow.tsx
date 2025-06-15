import React from 'react'
import Image from 'next/image'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'

interface Contact {
  id: number
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
}

interface Message {
  id: number
  senderId: number
  text: string
  timestamp: string
}

interface ChatWindowProps {
  contact: Contact | null
  messages: Message[]
  onBackToContacts: () => void
}

const ChatWindow: React.FC<ChatWindowProps> = ({ contact, messages, onBackToContacts }) => {
  if (!contact) return null

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="p-4 border-b flex items-center">
        <button onClick={onBackToContacts} className="mr-4">
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <Image
          src={contact.avatar}
          alt={contact.name}
          width={40}
          height={40}
          className="rounded-full mr-3"
        />
        <h2 className="font-semibold">{contact.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.senderId === 0 ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.senderId === 0
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatWindow