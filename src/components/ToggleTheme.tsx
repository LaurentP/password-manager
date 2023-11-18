import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
import { ThemeModeContext } from '../contexts/ThemeModeContext'
import useTypedContext from '../hooks/useTypedContext'
import type { ThemeModeContextType } from '../typings/ThemeMode'

const ToggleTheme = (): JSX.Element => {
  const [mode, setMode] =
    useTypedContext<ThemeModeContextType>(ThemeModeContext)

  const handleChangeTheme = (selectedMode: 'light' | 'dark'): void => {
    setMode(selectedMode)
    localStorage.setItem('theme', selectedMode)
  }

  return (
    <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
      {mode === 'light' ? (
        <Tooltip title="Switch to dark mode" placement="bottom-start">
          <IconButton
            onClick={() => {
              handleChangeTheme('dark')
            }}
          >
            <DarkModeIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Switch to light mode" placement="bottom-start">
          <IconButton
            onClick={() => {
              handleChangeTheme('light')
            }}
          >
            <LightModeIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  )
}

export default ToggleTheme
