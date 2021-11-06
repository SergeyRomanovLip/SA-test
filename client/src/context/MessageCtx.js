import { createContext } from 'react'
function noop() {}
export const MessageCtx = createContext({
  messageHandler: noop
})
