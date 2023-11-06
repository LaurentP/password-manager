import { createContext, useState } from 'react'
import type {
  SessionData,
  SessionDataContextType,
} from '../typings/SessionData'

export const SessionContext = createContext<SessionDataContextType | null>(null)

const SessionContextProvider = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element => {
  const [sessionData, setSessionData] = useState<SessionData>({
    isAuth: false,
    userId: '',
    username: '',
    aesKey: Object.create(CryptoKey),
  })

  return (
    <SessionContext.Provider value={[sessionData, setSessionData]}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionContextProvider
