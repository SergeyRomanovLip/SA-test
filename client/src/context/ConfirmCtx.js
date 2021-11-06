import { createContext } from 'react'
function noop() {}
export const ConfirmCtx = createContext({
  messageHandler: noop
})
