import { Login as LoginIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import generateAesKey from '../services/generate-aes-key'
import getUsers from '../services/get-users'
import hashPassword from '../services/hash-password'
import type { FailedAttemptsData } from '../typings/FailedAttemptsData'
import type { SessionDataContextType } from '../typings/SessionData'
import type { UserData } from '../typings/UserData'

type AuthFormError = {
  username: { status: boolean; message: string }
  password: { status: boolean; message: string }
}

const Auth = (): JSX.Element => {
  const [sessionData, setSessionData] =
    useTypedContext<SessionDataContextType>(SessionContext)

  const [formError, setFormError] = useState<AuthFormError>({
    username: { status: false, message: '' },
    password: { status: false, message: '' },
  })
  const [failedAttemptsData, setFailedAttemptsData] =
    useState<FailedAttemptsData>({
      count: 0,
      startMilliseconds: 0,
      endMilliseconds: 0,
    })

  useEffect(() => {
    const getFailedAttemptsData = localStorage.getItem('failedAttemptsData')

    if (getFailedAttemptsData !== null) {
      setFailedAttemptsData(JSON.parse(getFailedAttemptsData))
    }
  }, [])

  useEffect(() => {
    if (failedAttemptsData.count === 5) {
      const remainingTime = failedAttemptsData.endMilliseconds - Date.now()

      const resetFailedAttemptsData = (): void => {
        const newFailedAttemptsData: FailedAttemptsData = {
          count: 0,
          startMilliseconds: 0,
          endMilliseconds: 0,
        }

        setFailedAttemptsData(newFailedAttemptsData)

        localStorage.setItem(
          'failedAttemptsData',
          JSON.stringify(newFailedAttemptsData),
        )
      }

      if (remainingTime > 0) {
        setTimeout(() => {
          resetFailedAttemptsData()
        }, remainingTime)
      } else {
        resetFailedAttemptsData()
      }
    }
  }, [failedAttemptsData])

  const handleFailedAttempts = (): void => {
    // 15 minutes from now in milliseconds
    const END_MILLISECONDS = Date.now() + 1000 * 60 * 15

    let newFailedAttemptsData: FailedAttemptsData = {
      count: failedAttemptsData.count + 1,
      startMilliseconds: Date.now(),
      endMilliseconds: END_MILLISECONDS,
    }

    if (failedAttemptsData.count > 0) {
      const getFailedAttemptsData = localStorage.getItem('failedAttemptsData')

      if (getFailedAttemptsData !== null) {
        newFailedAttemptsData = JSON.parse(getFailedAttemptsData)
        newFailedAttemptsData.count++
      }
    }

    const elapsedMinutes = Math.floor(
      (Date.now() - newFailedAttemptsData.startMilliseconds) / 1000 / 60,
    )

    if (elapsedMinutes > 15) {
      newFailedAttemptsData = {
        count: 1,
        startMilliseconds: Date.now(),
        endMilliseconds: END_MILLISECONDS,
      }
    }

    setFailedAttemptsData(newFailedAttemptsData)

    localStorage.setItem(
      'failedAttemptsData',
      JSON.stringify(newFailedAttemptsData),
    )
  }

  const handleSubmit = async (e: React.BaseSyntheticEvent): Promise<void> => {
    e.preventDefault()

    if (e.target.username.value.length === 0) {
      setFormError({
        username: {
          status: true,
          message: 'Your username is required.',
        },
        password: { status: false, message: '' },
      })
      return
    }

    if (e.target.password.value.length === 0) {
      setFormError({
        username: { status: false, message: '' },
        password: {
          status: true,
          message: 'Your password is required.',
        },
      })
      return
    }

    const users = await getUsers()

    const foundUser = users.find(
      (result: UserData) =>
        result.username.toUpperCase() === e.target.username.value.toUpperCase(),
    )

    if (foundUser === undefined) {
      setFormError({
        username: {
          status: true,
          message: 'Wrong username. Please try again.',
        },
        password: { status: false, message: '' },
      })

      handleFailedAttempts()

      return
    }

    const salt = foundUser.hash.slice(0, 32)

    const hash = await hashPassword(e.target.password.value, salt)

    if (hash !== foundUser.hash) {
      setFormError({
        username: { status: false, message: '' },
        password: {
          status: true,
          message: 'Wrong password. Please try again.',
        },
      })

      handleFailedAttempts()

      return
    }

    const aesKeyData = await generateAesKey(e.target.password.value, salt)

    setSessionData({
      isAuth: true,
      userId: foundUser.id,
      username: foundUser.username,
      aesKey: aesKeyData,
    })
  }

  if (failedAttemptsData.count >= 5) {
    return (
      <Stack height="100vh" justifyContent="center" alignItems="center">
        <Box sx={{ width: '350px', padding: 2, textAlign: 'center' }}>
          <Alert severity="error" sx={{ my: 2 }}>
            You have exceeded the maximum number of attempts. Please wait a few
            minutes before trying again.
          </Alert>
        </Box>
      </Stack>
    )
  }

  if (sessionData.isAuth) return <Navigate to="/" />

  return (
    <Stack height="100vh" justifyContent="center" alignItems="center">
      <Box sx={{ width: '350px', padding: 2, textAlign: 'center' }}>
        <Typography variant="h5">Login</Typography>

        <Typography component="p" my={2}>
          Please enter your username and password.
        </Typography>

        <Stack
          component="form"
          spacing={2}
          onSubmit={(e) => {
            handleSubmit(e).catch(() => {})
          }}
        >
          <TextField
            fullWidth
            variant="filled"
            label="Username"
            type="text"
            name="username"
            error={formError.username.status}
            helperText={formError.username.message}
            size="small"
            autoComplete="off"
          />

          <PasswordInput
            fullWidth={true}
            label="Password"
            name="password"
            value={null}
            onChange={null}
            error={formError.password.status}
            helperText={formError.password.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disableElevation
            startIcon={<LoginIcon />}
          >
            Login
          </Button>

          <div>
            or{' '}
            <MuiLink component={Link} to="/register">
              create an account
            </MuiLink>
          </div>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Auth
