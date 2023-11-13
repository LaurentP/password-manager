import { Login as LoginIcon } from '@mui/icons-material'
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material'
import { exists } from '@tauri-apps/api/fs'
import { exit } from '@tauri-apps/api/process'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import generateAesKey from '../services/generate-aes-key'
import getDataDirectory from '../services/get-data-directory'
import getUsers from '../services/get-users'
import hashPassword from '../services/hash-password'
import type { SessionDataContextType } from '../typings/SessionData'
import type { UserData } from '../typings/UserData'

type AuthFormError = {
  username: {
    status: boolean
    message: string
  }
  password: {
    status: boolean
    message: string
  }
}

const Auth = (): JSX.Element => {
  const [sessionData, setSessionData] =
    useTypedContext<SessionDataContextType>(SessionContext)

  const [formError, setFormError] = useState<AuthFormError>({
    username: {
      status: false,
      message: '',
    },
    password: {
      status: false,
      message: '',
    },
  })
  const [attempts, setAttempts] = useState<number>(0)

  useEffect(() => {
    const checkUsersFile = async (): Promise<void> => {
      if (!(await exists('data/users.json', { dir: getDataDirectory() }))) {
        window.location.replace('/register')
      }
    }
    checkUsersFile().catch(() => {})
  }, [])

  const handleSubmit = async (e: React.BaseSyntheticEvent): Promise<void> => {
    e.preventDefault()

    if (e.target.username.value.length === 0) {
      setFormError({
        username: {
          status: true,
          message: 'Your username is required.',
        },
        password: {
          status: false,
          message: '',
        },
      })
      return
    }

    if (e.target.password.value.length === 0) {
      setFormError({
        username: {
          status: false,
          message: '',
        },
        password: {
          status: true,
          message: 'Your password is required.',
        },
      })
      return
    }

    const users = await getUsers()

    // Find user
    const foundUser = users.filter(
      (result: UserData) =>
        result.username.toUpperCase() === e.target.username.value.toUpperCase(),
    )[0]

    if (foundUser === undefined) {
      setFormError({
        username: {
          status: true,
          message: 'Wrong username. Please try again.',
        },
        password: {
          status: false,
          message: '',
        },
      })
      setAttempts(attempts + 1)
      return
    }

    const salt = foundUser.hash.slice(0, 32)

    const hash = await hashPassword(e.target.password.value, salt)

    if (hash !== foundUser.hash) {
      setFormError({
        username: {
          status: false,
          message: '',
        },
        password: {
          status: true,
          message: 'Wrong password. Please try again.',
        },
      })
      setAttempts(attempts + 1)
      if (attempts === 5) {
        await exit(0)
      }
      return
    }

    // Create derived key
    const aesKeyData = await generateAesKey(e.target.password.value, salt)

    setSessionData({
      isAuth: true,
      userId: foundUser.id,
      username: foundUser.username,
      aesKey: aesKeyData,
    })
  }

  if (sessionData.isAuth) {
    return <Navigate to="/" />
  }

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
            or <Link href="/register">create an account</Link>
          </div>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Auth
