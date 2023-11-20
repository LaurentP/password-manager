import { PersonAdd as PersonAddIcon } from '@mui/icons-material'
import {
  Box,
  Button,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { createDir } from '@tauri-apps/api/fs'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
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
import type { FormError } from '../typings/FormError'
import type { SessionDataContextType } from '../typings/SessionData'
import type { UserData } from '../typings/UserData'

const Register = (): JSX.Element => {
  const [sessionData, setSessionData] =
    useTypedContext<SessionDataContextType>(SessionContext)

  const [formError, setFormError] = useState<FormError>({
    fieldName: '',
    message: '',
  })
  const [password, setPassword] = useState<string>('')

  const handleChangePassword = (e: React.BaseSyntheticEvent): void => {
    setPassword(e.target.value)
  }

  const createFormError = (fieldName: string, message: string): void => {
    setFormError({ fieldName, message })
  }

  const handleSubmit = async (e: React.BaseSyntheticEvent): Promise<void> => {
    e.preventDefault()

    if (e.target.username.value.length === 0) {
      createFormError('username', 'Please choose an username.')
      return
    }

    if (e.target.password.value.length === 0) {
      createFormError('password', 'Please choose a password.')
      return
    }

    const users = await getUsers()

    const foundUser = users.find(
      (result: UserData) =>
        result.username.toUpperCase() === e.target.username.value.toUpperCase(),
    )

    if (foundUser !== undefined) {
      createFormError(
        'username',
        'This username is already exists. Please try again.',
      )
      return
    }

    if (e.target.password.value.length === 0) return

    if (e.target.password.value !== e.target.passwordConfirm.value) {
      createFormError(
        'passwordConfirm',
        'Passwords does not match. Please try again.',
      )
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

    await createDir('data', { dir: getDataDirectory(), recursive: true })

    await saveUsers(users)

    const aesKeyData = await generateAesKey(e.target.password.value, salt)

    setSessionData({
      isAuth: true,
      userId: userIdData,
      username: e.target.username.value,
      aesKey: aesKeyData,
    })
  }

  if (sessionData.isAuth) return <Navigate to="/" />

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
            error={formError.fieldName === 'username'}
            helperText={
              formError.fieldName === 'username' ? formError.message : ''
            }
            size="small"
            autoComplete="off"
          />

          <PasswordInput
            fullWidth={true}
            label="Password"
            name="password"
            value={null}
            onChange={handleChangePassword}
            error={formError.fieldName === 'password'}
            helperText={
              formError.fieldName === 'password' ? formError.message : ''
            }
          />

          {password.length !== 0 && <PasswordIndicator password={password} />}

          <TextField
            fullWidth
            variant="filled"
            label="Confirm Password"
            type="password"
            name="passwordConfirm"
            inputProps={{ maxLength: 100 }}
            error={formError.fieldName === 'passwordConfirm'}
            helperText={
              formError.fieldName === 'passwordConfirm' ? formError.message : ''
            }
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
            or{' '}
            <MuiLink component={Link} to="/auth">
              login to your account
            </MuiLink>
          </div>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Register
