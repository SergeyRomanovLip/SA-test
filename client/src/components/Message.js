import React, { useEffect, useState } from 'react'
import { MessageCtx } from '../context/MessageCtx'
import { MessageComp } from './MessageComp'

export const MessageC = ({ children }) => {
  const [messagesArray, setMessagesArray] = useState([])
  const messageHandler = (text, type) => {
    if (!Array.isArray(text)) {
      text = [text]
    }
    let id = Date.now()
    let msg = {
      id,
      text,
      type
    }
    setMessagesArray((prev) => {
      return [...prev, msg]
    })
    setTimeout(() => {
      setMessagesArray((prev) => {
        console.log()
        return [...prev.filter((msg) => msg.id !== id)]
      })
    }, 4500)
  }

  return (
    <MessageCtx.Provider value={{ messageHandler }}>
      <div className='messageContainer'>
        {messagesArray?.length > 0 &&
          messagesArray.map((msg) => {
            return <MessageComp key={msg.id} msg={msg} />
          })}
      </div>
      {children}
    </MessageCtx.Provider>
  )
}
