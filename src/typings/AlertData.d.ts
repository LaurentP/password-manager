import type { AlertColor } from '@mui/material'

export type AlertData = {
  open: boolean
  type: AlertColor
  message: string
}

export type AlertDataContextType = [
  AlertData,
  React.Dispatch<React.SetStateAction<AlertData>>,
]
