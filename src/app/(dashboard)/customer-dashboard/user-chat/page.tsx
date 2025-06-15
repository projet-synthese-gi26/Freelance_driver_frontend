"use client";
import React, { useState } from "react";
import ChatSideBar from "@/components/customer/chat/ChatSideBar";
import ChatWindow from "@/components/customer/chat/ChatWindow";
import MessageInput from "@/components/customer/chat/MessageInput";
import ChatBox from "@/components/modal/chatModal";

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

const contacts: Contact[] = [
  { id: 1, name: "Alice", avatar: "/img/chauffeur_nouveau.png", lastMessage: "Hey there!", lastMessageTime: "10:30 AM" },
  { id: 2, name: "Bob", avatar: "/img/chauffeur_nouveau.png", lastMessage: "How are you?", lastMessageTime: "Yesterday" },
  { id: 3, name: "Charlie", avatar: "/img/chauffeur_nouveau.png", lastMessage: "See you soon!", lastMessageTime: "2 days ago" },
  { id: 4, name: "David", avatar: "/img/chauffeur_nouveau.png", lastMessage: "See you soon!", lastMessageTime: "2 days ago" },
  { id: 5, name: "Eve", avatar: "/img/chauffeur_nouveau.png", lastMessage: "See you soon!", lastMessageTime: "2 days ago" },
]

const initialMessages: Message[] = [
  { id: 1, senderId: 1, text: "Hey there!", timestamp: "2023-05-10T10:30:00" },
  { id: 2, senderId: 0, text: "Hi Alice! How are you?", timestamp: "2023-05-10T10:31:00" },
  { id: 3, senderId: 1, text: "I'm good, thanks! How about you?", timestamp: "2023-05-10T10:32:00" },
]

const Page = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isChatting, setIsChatting] = useState(false)
  const [searchResult,setSearchResult]=useState<string>('')

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact)
    setIsChatting(true)
    setSearchResult('')
  }
  const handleChatClick = () => {
    setIsChatting((prevIsChat) => !prevIsChat);
  };

  const handleSendMessage = (text: string) => {
    if (selectedContact) {
      const newMessage: Message = {
        id: messages.length + 1,
        senderId: 0, // Assuming 0 is the current user
        text,
        timestamp: new Date().toISOString(),
      }
      setMessages([...messages, newMessage])
    }
  }

  const handleBackToContacts = () => {
    setIsChatting(false)
  }

  return (
      <div className={`flex flex-col bg-white lg:flex-row ${contacts.length>6? ("lg:h-[40rem]"):("lg:h-full")} bg-gray-100 pb-20 mb-[15%]`}>
        <div className={`${isChatting ? "lg:block hidden" : ""}`}>
          <ChatSideBar contacts={contacts} onSelectContact={handleContactSelect} setSearchResult={setSearchResult} searchResult={searchResult} />
        </div>
        <div className="w-full">
          <ChatBox isChat={isChatting} handleChatClick={handleChatClick} driverName={selectedContact?.name}
                   driverId={selectedContact?.id.toString()} className={`h-full max-h-[100vh] w-[100%] bg-white rounded-md border shadow-lg ${
              isChatting ? "block top-[10px]" : "hidden"
          }`}
            profilePicture={selectedContact?.avatar || ""}
          />
          {/* <ChatWindow contact={selectedContact} messages={messages} onBackToContacts={handleBackToContacts} />
        <MessageInput onSendMessage={handleSendMessage} /> */}
        </div>
      </div>
  );
};

export default Page;