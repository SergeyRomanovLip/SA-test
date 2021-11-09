import React, { useEffect, useState } from 'react'
import { Message, Transition } from 'semantic-ui-react'
import { MessageCtx } from '../context/MessageCtx'

export const MessageComp = ({ msg }) => {
  const [text, setText] = useState()
  const [type, setType] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setText(msg.text)
    setType(msg.type)
    setTimeout(() => {
      setVisible(true)
    }, 10)
    setTimeout(() => {
      setVisible(false)
    }, 2000)
    setTimeout(() => {
      setText(false)
    }, 3000)
  }, [])

  return (
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
          list={text || ''}
        />
      )}
    </Transition.Group>
  )
}
