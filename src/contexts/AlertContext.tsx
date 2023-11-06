import { createContext, useState } from 'react'
import type { AlertData, AlertDataContextType } from '../typings/AlertData'

export const AlertContext = createContext<AlertDataContextType | null>(null)

const AlertContextProvider = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element => {
  const [alert, setAlert] = useState<AlertData>({
    open: false,
    type: 'info',
    message: '',
  })

  return (
    <AlertContext.Provider value={[alert, setAlert]}>
      {children}
    </AlertContext.Provider>
  )
}

export default AlertContextProvider
