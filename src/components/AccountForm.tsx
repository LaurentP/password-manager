import {
  Close as CloseIcon,
  ContentCopy as ContentCopyIcon,
  Launch as LaunchIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material'
import { open as openUrl } from '@tauri-apps/api/shell'
import { useState } from 'react'
import PasswordGenerator from '../components/PasswordGenerator'
import PasswordIndicator from '../components/PasswordIndicator'
import PasswordInput from '../components/PasswordInput'
import { AlertContext } from '../contexts/AlertContext'
import useTypedContext from '../hooks/useTypedContext'
import type { AccountData } from '../typings/AccountData'
import type { AccountFormError } from '../typings/AccountFormError'
import type { AlertDataContextType } from '../typings/AlertData'

const AccountForm = ({
  accountData,
  formError,
  handleChange,
  handleSubmit,
  formButtons,
}: {
  accountData: AccountData
  formError: AccountFormError
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  handleSubmit: React.FormEventHandler<HTMLFormElement>
  formButtons: JSX.Element
}): JSX.Element => {
  const [, setAlert] = useTypedContext<AlertDataContextType>(AlertContext)

  const [generatePasswordState, setGeneratePasswordState] =
    useState<boolean>(false)

  const handleCopy = (type: string): void => {
    if (type !== 'url' && type !== 'username' && type !== 'password') return

    const typeString = {
      url: 'website URL',
      username: 'username or email',
      password: 'password',
    }

    if (accountData[type].length === 0) {
      setAlert({
        open: true,
        type: 'warning',
        message: `There is no ${typeString[type]} to copy.`,
      })
      return
    }

    const capitalizedTypeString =
      typeString[type].charAt(0).toLocaleUpperCase() + typeString[type].slice(1)

    navigator.clipboard
      .writeText(accountData[type])
      .then(() => {
        setAlert({
          open: true,
          type: 'info',
          message: `${capitalizedTypeString} copied to clipboard.`,
        })
      })
      .catch(() => {})
  }

  const handleOpenUrl = (): void => {
    let url = accountData.url

    if (!/^(https?:\/\/\w+).+/g.test(url)) {
      url = 'http://' + accountData.url
    }

    openUrl(url).catch(() => {
      setAlert({
        open: true,
        type: 'warning',
        message: 'URL is missing or invalid.',
      })
    })
  }

  return (
    <>
      <Stack
        component="form"
        spacing={2}
        mx={2}
        mb={2}
        onSubmit={handleSubmit}
        height="100%"
      >
        <TextField
          fullWidth
          variant="filled"
          label="Account Name"
          type="text"
          name="name"
          inputProps={{ maxLength: 100 }}
          value={accountData.name}
          onChange={handleChange}
          error={formError.name.status}
          helperText={formError.name.message}
          size="small"
          autoComplete="off"
        />

        <Stack direction="row" alignItems="center" spacing={2}>
          <TextField
            fullWidth
            variant="filled"
            label="Website URL"
            type="text"
            name="url"
            inputProps={{ maxLength: 100 }}
            value={accountData.url}
            onChange={handleChange}
            size="small"
          />

          <Tooltip title="Open website URL" placement="bottom-start">
            <IconButton onClick={handleOpenUrl}>
              <LaunchIcon color="action" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Copy website URL" placement="bottom-start">
            <IconButton
              onClick={() => {
                handleCopy('url')
              }}
            >
              <ContentCopyIcon color="action" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <TextField
            fullWidth
            variant="filled"
            label="Username or Email"
            type="text"
            name="username"
            inputProps={{ maxLength: 100 }}
            value={accountData.username}
            onChange={handleChange}
            error={formError.username.status}
            helperText={formError.username.message}
            size="small"
            autoComplete="off"
          />

          <Tooltip title="Copy username or email" placement="bottom-start">
            <IconButton
              onClick={() => {
                handleCopy('username')
              }}
            >
              <ContentCopyIcon color="action" />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Stack flexGrow={1}>
            <PasswordInput
              fullWidth={true}
              label="Password"
              name="password"
              value={accountData.password}
              onChange={handleChange}
              error={formError.password.status}
              helperText={formError.password.message}
            />
            <PasswordIndicator password={accountData.password} />
          </Stack>

          <Stack direction="row" spacing={2} pt={0.5}>
            <Tooltip title="Generate password" placement="bottom-start">
              <IconButton
                onClick={() => {
                  setGeneratePasswordState(true)
                }}
              >
                <RefreshIcon color="action" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Copy password" placement="bottom-start">
              <IconButton
                onClick={() => {
                  handleCopy('password')
                }}
              >
                <ContentCopyIcon color="action" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <TextField
          fullWidth
          variant="filled"
          label="Notes"
          name="notes"
          multiline
          inputProps={{
            maxLength: 500,
          }}
          value={accountData.notes}
          onChange={handleChange}
          size="small"
          sx={{
            flexGrow: 1,
            maxHeight: '250px',
            '& .MuiInputBase-root': {
              height: '100%',
            },
            '& .MuiInputBase-input': {
              height: '100% !important',
              overflowY: 'auto !important',
            },
          }}
        />

        <Stack direction="row" spacing={2}>
          {formButtons}
        </Stack>
      </Stack>

      <Dialog open={generatePasswordState}>
        <DialogTitle>Password Generator</DialogTitle>
        <DialogContent>
          <PasswordGenerator />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            disableElevation
            startIcon={<CloseIcon />}
            onClick={() => {
              setGeneratePasswordState(false)
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AccountForm
