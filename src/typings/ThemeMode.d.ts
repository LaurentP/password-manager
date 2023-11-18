export type ThemeMode = 'light' | 'dark'

export type ThemeModeContextType = [
  ThemeMode,
  React.Dispatch<React.SetStateAction<ThemeMode>>,
]
