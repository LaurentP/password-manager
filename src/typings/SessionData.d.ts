export type SessionData = {
  isAuth: boolean
  userId: string
  username: string
  aesKey: CryptoKey
}

export type SessionDataContextType = [
  SessionData,
  React.Dispatch<React.SetStateAction<SessionData>>,
]
