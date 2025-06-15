import React, { Dispatch, SetStateAction, useState } from 'react'
import Image from 'next/image'

interface Contact {
  id: number
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
}

interface SidebarProps {
  contacts: Contact[]
  onSelectContact: (contact: Contact) => void;
  searchResult:string;
  setSearchResult:Dispatch<SetStateAction<string>>
}

const ChatSideBar: React.FC<SidebarProps> = ({ contacts, onSelectContact,searchResult,setSearchResult }) => {
  
  const filter=contacts.filter(contact => contact.name.toLowerCase().includes(searchResult.toLowerCase()))
  return (
    <div className="w-full  bg-white border-r text flex flex-col h-full ">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">Contacts</h2>
        <input 
          type="search" 
          name="contact" 
          id="contact" 
          className='border focus:border-primary-500 focus:outline-none rounded-full w-full px-4 py-2' 
          placeholder='Search contact...'
          value={searchResult} 
          onChange={(e)=>setSearchResult(e.target.value)}
        />
      </div>
      <ul className='flex-grow overflow-y-auto'>
        {contacts.length<=0? (
          <div className='flex items-center justify-center py-20'>
            <p>No contact</p>
          </div>
        ):(
          <div>
            {searchResult.length!=0?(
              <div className='flex items-center p-4 flex-col space-y-1'>
                  {filter.map(item=>(
                  <li key={item.id} className='border-b cursor-pointer hover:bg-[var(--bg-1)] border-dashed px-4 py-2 flex justify-center items-center font-medium space-x-10 w-full'
                  onClick={() => onSelectContact(item)}>
                    <Image src={item.avatar} width={50} height={50} alt='image' className='rounded-full'/>
                    <div>{item.name}</div>
                  </li>
                  ))}
              </div>
            ):(
              <div>
              {contacts.map((contact) => (
              <li
                key={contact.id}
                className="flex items-center p-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => onSelectContact(contact)}
              >
                <div className="w-10 h-10 relative mr-3 flex-shrink-0">
                  <Image
                    src={contact.avatar}
                    alt={contact.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{contact.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                </div>
                <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{contact.lastMessageTime}</span>
              </li>
            ))}
            </div>
            )}
            
          </div>
        )}
        
      </ul>
      <div className='p-4'>
        <button className='bg-primary text-white font-bold py-2 px-4 rounded w-full'>
          + Add new contact
        </button>
      </div>
    </div>
  )
}

export default ChatSideBar