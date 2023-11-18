import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import type { Theme } from '@mui/material'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createContext, useEffect, useState } from 'react'
import darkStyle from '../styles/dark.style'
import lightStyle from '../styles/light.style'
import type { ThemeMode, ThemeModeContextType } from '../typings/ThemeMode'

export const ThemeModeContext = createContext<ThemeModeContextType | null>(null)

const ThemeModeContextProvider = ({
  children,
}: {
  children: JSX.Element
}): JSX.Element => {
  const getMode = (): 'light' | 'dark' => {
    const getTheme = localStorage.getItem('theme')

    if (getTheme !== null && (getTheme === 'light' || getTheme === 'dark')) {
      return getTheme
    }

    return 'light'
  }

  const [mode, setMode] = useState<ThemeMode>(getMode)

  const getStyle = (): Theme => {
    return mode === 'dark' ? darkStyle : lightStyle
  }

  const [style, setStyle] = useState<Theme>(getStyle)

  useEffect(() => {
    setStyle(getStyle)
  }, [mode])

  return (
    <ThemeModeContext.Provider value={[mode, setMode]}>
      <ThemeProvider theme={style}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export default ThemeModeContextProvider
