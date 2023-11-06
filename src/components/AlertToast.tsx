import { Close as CloseIcon } from '@mui/icons-material'
import { Alert, IconButton, Snackbar } from '@mui/material'
import { AlertContext } from '../contexts/AlertContext'
import useTypedContext from '../hooks/useTypedContext'
import type { AlertDataContextType } from '../typings/AlertData'

const AlertToast = (): JSX.Element => {
  const [alert, setAlert] = useTypedContext<AlertDataContextType>(AlertContext)

  const closeAlertButton = (
    <IconButton
      size="small"
      color="inherit"
      onClick={() => {
        setAlert({ ...alert, open: false })
      }}
    >
      <CloseIcon fontSize="small" />
    </IconButton>
  )

  const handleAlertClose = (): void => {
    setAlert({ ...alert, open: false })
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={alert.open}
      autoHideDuration={6000}
      onClose={handleAlertClose}
    >
      <Alert severity={alert.type} elevation={3} action={closeAlertButton}>
        {alert.message}
      </Alert>
    </Snackbar>
  )
}

export default AlertToast
