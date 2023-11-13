import { PersonAdd as PersonAddIcon } from '@mui/icons-material'
import { Box, Button, Link, Stack, TextField, Typography } from '@mui/material'
import { createDir } from '@tauri-apps/api/fs'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import PasswordIndicator from '../components/PasswordIndicator'
import PasswordInput from '../components/PasswordInput'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import generateAesKey from '../services/generate-aes-key'
import generateSalt from '../services/generate-salt'
import getDataDirectory from '../services/get-data-directory'
import getUsers from '../services/get-users'
import hashPassword from '../services/hash-password'
import saveUsers from '../services/save-users'
import type { SessionDataContextType } from '../typings/SessionData'
import type { UserData } from '../typings/UserData'

type RegistrationFormError = {
  username: {
    status: boolean
    message: string
  }
  password: {
    status: boolean
    message: string
  }
  passwordConfirm: {
    status: boolean
    message: string
  }
}

const Register = (): JSX.Element => {
  const [sessionData, setSessionData] =
    useTypedContext<SessionDataContextType>(SessionContext)

  const [formError, setFormError] = useState<RegistrationFormError>({
    username: {
      status: false,
      message: '',
    },
    password: {
      status: false,
      message: '',
    },
    passwordConfirm: {
      status: false,
      message: '',
    },
  })
  const [password, setPassword] = useState<string>('')

  const handleChangePassword = (e: React.BaseSyntheticEvent): void => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: React.BaseSyntheticEvent): Promise<void> => {
    e.preventDefault()

    if (e.target.username.value.length === 0) {
      setFormError({
        username: {
          status: true,
          message: 'Please choose an username.',
        },
        password: {
          status: false,
          message: '',
        },
        passwordConfirm: {
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
          message: 'Please choose a password.',
        },
        passwordConfirm: {
          status: false,
          message: '',
        },
      })
      return
    }

    const users = await getUsers()

    // Find if the entered username is already exists
    const foundUser = users.filter(
      (result: UserData) =>
        result.username.toUpperCase() === e.target.username.value.toUpperCase(),
    )[0]

    if (foundUser !== undefined) {
      setFormError({
        username: {
          status: true,
          message: 'This username is already exists. Please try again.',
        },
        password: {
          status: false,
          message: '',
        },
        passwordConfirm: {
          status: false,
          message: '',
        },
      })
      return
    }

    if (e.target.password.value.length === 0) {
      return
    }

    if (e.target.password.value !== e.target.passwordConfirm.value) {
      setFormError({
        username: {
          status: false,
          message: '',
        },
        password: {
          status: false,
          message: '',
        },
        passwordConfirm: {
          status: true,
          message: 'Passwords does not match. Please try again.',
        },
      })
      return
    }

    const userIdData = crypto.randomUUID()

    const salt = generateSalt()

    const hashData = await hashPassword(e.target.password.value, salt)

    users.push({
      id: userIdData,
      username: e.target.username.value,
      hash: hashData,
    })

    // Check if data directory exists, then create it if it does not exists

    await createDir('data', { dir: getDataDirectory(), recursive: true })

    await saveUsers(users)

    // Create derived key
    const aesKeyData = await generateAesKey(e.target.password.value, salt)

    setSessionData({
      isAuth: true,
      userId: userIdData,
      username: e.target.username.value,
      aesKey: aesKeyData,
    })
  }

  if (sessionData.isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Stack height="100vh" justifyContent="center" alignItems="center">
      <Box sx={{ width: '350px', padding: 2, textAlign: 'center' }}>
        <Typography variant="h5">Registration</Typography>

        <Typography component="p" my={2}>
          Please create your account.
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
            inputProps={{ maxLength: 100 }}
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
            onChange={handleChangePassword}
            error={formError.password.status}
            helperText={formError.password.message}
          />

          {password.length !== 0 && <PasswordIndicator password={password} />}

          <TextField
            fullWidth
            variant="filled"
            label="Confirm Password"
            type="password"
            name="passwordConfirm"
            inputProps={{ maxLength: 100 }}
            error={formError.passwordConfirm.status}
            helperText={formError.passwordConfirm.message}
            size="small"
            sx={{
              '& ::-ms-reveal': {
                display: 'none',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disableElevation
            startIcon={<PersonAddIcon />}
          >
            Register
          </Button>

          <div>
            or <Link href="/auth">login to your account</Link>
          </div>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Register
