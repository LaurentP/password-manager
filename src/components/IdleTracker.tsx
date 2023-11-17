import { useEffect } from 'react'
import { AlertContext } from '../contexts/AlertContext'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import type { AlertDataContextType } from '../typings/AlertData'
import type { SessionDataContextType } from '../typings/SessionData'

const IdleTracker = (): JSX.Element => {
  const [, setAlert] = useTypedContext<AlertDataContextType>(AlertContext)
  const [sessionData, setSessionData] =
    useTypedContext<SessionDataContextType>(SessionContext)

  // 15 minutes in milliseconds
  const DELAY_IN_MILLISECONDS = 1000 * 60 * 15

  let timeout: number

  const handleLogout = (): void => {
    setSessionData({ ...sessionData, isAuth: false })

    setAlert({
      open: true,
      type: 'info',
      message: 'Your session has expired due to prolonged inactivity.',
    })
  }

  const resetTimer = (): void => {
    clearTimeout(timeout)

    timeout = window.setTimeout(() => {
      handleLogout()
    }, DELAY_IN_MILLISECONDS)
  }

  useEffect(() => {
    if (sessionData.isAuth) {
      window.addEventListener('click', resetTimer)
      window.addEventListener('mousemove', resetTimer)
      window.addEventListener('keydown', resetTimer)

      resetTimer()

      return () => {
        window.removeEventListener('click', resetTimer)
        window.removeEventListener('mousemove', resetTimer)
        window.removeEventListener('keydown', resetTimer)

        clearTimeout(timeout)
      }
    }
  }, [sessionData.isAuth])

  return <></>
}

export default IdleTracker
