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

  // 15 minutes
  const seconds = 1000 * 60 * 15

  let timer: number

  const handleLogout = (): void => {
    setSessionData({ ...sessionData, isAuth: false })

    setAlert({
      open: true,
      type: 'info',
      message: 'Your session has expired due to prolonged inactivity.',
    })
  }

  const resetTimer = (): void => {
    clearTimeout(timer)

    timer = setTimeout(() => {
      handleLogout()
    }, seconds)
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

        clearTimeout(timer)
      }
    }
  }, [sessionData.isAuth])

  return <></>
}

export default IdleTracker
