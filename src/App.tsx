import { useEffect } from 'react'
import AlertToast from './components/AlertToast'
import IdleTracker from './components/IdleTracker'
import ToggleTheme from './components/ToggleTheme'
import AlertContextProvider from './contexts/AlertContext'
import SessionContextProvider from './contexts/SessionContext'
import ThemeModeContextProvider from './contexts/ThemeModeContext'
import Router from './routes/Router'

const App = (): JSX.Element => {
  useEffect(() => {
    if (import.meta.env.VITE_MODE === 'prod') {
      window.addEventListener('contextmenu', (e: MouseEvent) => {
        if (
          (e.target instanceof HTMLInputElement &&
            e.target.type !== 'checkbox') ||
          e.target instanceof HTMLAreaElement
        ) {
          return
        }
        e.preventDefault()
      })
    }
  }, [])

  return (
    <ThemeModeContextProvider>
      <AlertContextProvider>
        <>
          <SessionContextProvider>
            <>
              <IdleTracker />
              <Router />
              <ToggleTheme />
            </>
          </SessionContextProvider>
          <AlertToast />
        </>
      </AlertContextProvider>
    </ThemeModeContextProvider>
  )
}

export default App
