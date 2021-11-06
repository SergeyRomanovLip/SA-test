import React, { useEffect, useState } from 'react'
import { Message, Transition } from 'semantic-ui-react'
import { MessageCtx } from './../context/MessageCtx'

export const MessageC = (props) => {
  const [messageState, setMessageState] = useState()
  const [type, setType] = useState(false)
  const [visible, setVisible] = useState(false)
  const messageHandler = (data, type) => {
    if (!Array.isArray(data)) {
      data = [data]
    }
    setMessageState(data)
    setType(type)
    setTimeout(() => {
      setVisible(true)
    }, 10)
    setTimeout(() => {
      setMessageState(false)
    }, 3000)
    setTimeout(() => {
      setVisible(false)
    }, 2000)
  }

  return (
    <MessageCtx.Provider value={{ messageHandler }}>
      {messageState ? (
        <Transition.Group animation='fade down' duration={1000}>
          {visible && (
            <Message
              style={{ zIndex: 9999999 }}
              compact
              attached='top'
              visible
              error={type == 'error' ? true : false}
              success={type == 'success' ? true : false}
              warning={type ? false : true}
              header={type == 'error' ? 'Возникла ошибка' : 'Уведомление'}
              list={messageState && messageState}
            />
          )}
        </Transition.Group>
      ) : null}
      {props.children}
    </MessageCtx.Provider>
  )
}
