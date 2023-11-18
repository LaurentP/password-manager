import {
  ContentCopy as ContentCopyIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import {
  Button,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  Slider,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { AlertContext } from '../contexts/AlertContext'
import useTypedContext from '../hooks/useTypedContext'
import type { AlertDataContextType } from '../typings/AlertData'
import PasswordIndicator from './PasswordIndicator'

type Params = {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

const PasswordGenerator = (): JSX.Element => {
  const [, setAlert] = useTypedContext<AlertDataContextType>(AlertContext)

  const [params, setParams] = useState<Params>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  })
  const [password, setPassword] = useState<string>('')

  useEffect(() => {
    generatePassword()
  }, [params])

  const generatePassword = (): void => {
    let chars = ''
    let newPassword = ''

    if (params.uppercase) {
      chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }

    if (params.lowercase) {
      chars += 'abcdefghijklmnopqrstuvwxyz'
    }

    if (params.numbers) {
      chars += '0123456789'
    }

    if (params.symbols) {
      chars += '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
    }

    for (let i = 0; i < params.length; i++) {
      const index = Math.floor(Math.random() * chars.length)

      newPassword += chars[index]
    }

    setPassword(newPassword)
  }

  const handleSliderChange = (_: Event, value: number | number[]): void => {
    setParams({ ...params, length: value as number })
  }

  const handleSwitchChange = (e: React.BaseSyntheticEvent): void => {
    if (document.querySelectorAll('.MuiSwitch-input:checked').length === 0) {
      // The onClick event is required to use preventDefault() on switches
      e.preventDefault()
      return
    }
    setParams({ ...params, [e.target.name]: e.target.checked })
  }

  const handleCopy = (): void => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        setAlert({
          open: true,
          type: 'info',
          message: 'Password copied to clipboard.',
        })
      })
      .catch(() => {})
  }

  return (
    <Stack spacing={2}>
      <Stack
        justifyContent="center"
        alignItems="center"
        height={100}
        sx={{
          position: 'relative',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? '#4b4b4b' : '#eee',
          borderRadius: '4px',
        }}
      >
        <Typography variant={password.length < 23 ? 'h4' : 'h6'}>
          {password}
        </Typography>

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ position: 'absolute', bottom: '-80px', right: 0 }}
        >
          <Tooltip title="Regenerate password">
            <IconButton onClick={generatePassword}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            disableElevation
            startIcon={<ContentCopyIcon />}
            onClick={handleCopy}
          >
            Copy Password
          </Button>
        </Stack>
      </Stack>

      <PasswordIndicator password={password} />

      <Stack flexDirection="row" alignItems="center" pt={2}>
        Length
        <Slider
          name="length"
          min={4}
          max={40}
          value={params.length}
          sx={{ m: 2 }}
          onChange={handleSliderChange}
        />
        <Chip label={params.length} sx={{ fontSize: 'inherit' }} />
      </Stack>

      <Grid container rowGap={2}>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                name="uppercase"
                defaultChecked
                onClick={handleSwitchChange}
              />
            }
            label="Uppercase (A-Z)"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                name="lowercase"
                defaultChecked
                onClick={handleSwitchChange}
              />
            }
            label="Lowercase (a-z)"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                name="numbers"
                defaultChecked
                onClick={handleSwitchChange}
              />
            }
            label="Numbers (0-9)"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            control={
              <Switch
                name="symbols"
                defaultChecked
                onClick={handleSwitchChange}
              />
            }
            label="Symbols (!$&?@~)"
          />
        </Grid>
      </Grid>
    </Stack>
  )
}

export default PasswordGenerator
