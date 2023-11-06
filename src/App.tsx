import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import AlertToast from './components/AlertToast'
import IdleTracker from './components/IdleTracker'
import AlertContextProvider from './contexts/AlertContext'
import SessionContextProvider from './contexts/SessionContext'
import Router from './routes/Router'
import styles from './styles'

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={styles}>
      <CssBaseline />
      <AlertContextProvider>
        <>
          <SessionContextProvider>
            <>
              <IdleTracker />
              <Router />
            </>
          </SessionContextProvider>
          <AlertToast />
        </>
      </AlertContextProvider>
    </ThemeProvider>
  )
}

export default App
