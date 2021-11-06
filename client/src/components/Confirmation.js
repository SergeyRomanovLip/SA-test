import React, { useState } from 'react'
import { Confirm } from 'semantic-ui-react'
import { ConfirmCtx } from './../context/ConfirmCtx'

export const Confirmation = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [foo, setFoo] = useState()

  const confirmHandler = (fun) => {
    setFoo(fun)
    setOpen(true)
  }

  return (
    <ConfirmCtx.Provider value={{ confirmHandler }}>
      <Confirm
        open={open}
        onCancel={() => {
          setOpen(false)
        }}
        onConfirm={() => {
          if (foo) {
            try {
              foo()
            } catch (e) {
              throw e
            }
            setFoo(null)
            setOpen(false)
          }
        }}
      />
      {children}
    </ConfirmCtx.Provider>
  )
}
