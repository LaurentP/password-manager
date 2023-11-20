import { Check as CheckIcon } from '@mui/icons-material'
import { Button, Grid, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import PasswordIndicator from '../components/PasswordIndicator'
import { AlertContext } from '../contexts/AlertContext'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import generateAesKey from '../services/generate-aes-key'
import generateSalt from '../services/generate-salt'
import getUsers from '../services/get-users'
import hashPassword from '../services/hash-password'
import loadData from '../services/load-data'
import saveData from '../services/save-data'
import saveUsers from '../services/save-users'
import type { AccountData } from '../typings/AccountData'
import type { AlertDataContextType } from '../typings/AlertData'
import type { FailedAttemptsData } from '../typings/FailedAttemptsData'
import type { FormError } from '../typings/FormError'
import type { SessionDataContextType } from '../typings/SessionData'
import type { UserData } from '../typings/UserData'
import DeleteUser from './DeleteUser'
import PasswordInput from './PasswordInput'

const UserSettings = (): JSX.Element => {
  const [, setAlert] = useTypedContext<AlertDataContextType>(AlertContext)
  const [sessionData, setSessionData] =
    useTypedContext<SessionDataContextType>(SessionContext)

  const [formError, setFormError] = useState<FormError>({
    fieldName: '',
    message: '',
  })
  const [failedAttempts, setFailedAttempts] = useState<number>(0)
  const [newPassword, setNewPassword] = useState<string>('')

  const handleChangePassword = (e: React.BaseSyntheticEvent): void => {
    setNewPassword(e.target.value)
  }

  const createFormError = (fieldName: string, message: string): void => {
    setFormError({ fieldName, message })
  }

  const handleSubmit = async (e: React.BaseSyntheticEvent): Promise<void> => {
    e.preventDefault()

    if (e.target.currentPassword.value.length === 0) {
      createFormError('currentPassword', 'Your current password is required.')
      return
    }

    const users = await getUsers()

    const foundUser = users.find(
      (item: UserData) => item.id === sessionData.userId,
    )
    if (foundUser === undefined) return

    const salt = foundUser.hash.slice(0, 32)

    const hash = await hashPassword(e.target.currentPassword.value, salt)

    if (hash !== foundUser.hash) {
      createFormError('currentPassword', 'Wrong password. Please try again.')

      setFailedAttempts(failedAttempts + 1)

      if (failedAttempts === 5) {
        const failedAttemptsData: FailedAttemptsData = {
          count: failedAttempts,
          startMilliseconds: Date.now(),
          endMilliseconds: Date.now() + 1000 * 60 * 15,
        }

        localStorage.setItem(
          'failedAttemptsData',
          JSON.stringify(failedAttemptsData),
        )

        setSessionData({ ...sessionData, isAuth: false })
      }
      return
    }

    const foundUserName = users.find(
      (result: UserData) => result.username === e.target.username.value,
    )

    if (foundUserName !== undefined && foundUser !== foundUserName) {
      createFormError(
        'username',
        'This username is already exists. Please try again.',
      )
      return
    }

    let newData: UserData = {
      id: sessionData.userId,
      username: e.target.username.value,
      hash: foundUser.hash,
    }

    if (e.target.username.value.length === 0) {
      console.log('keep username')
      newData = { ...newData, username: sessionData.username }
    }

    let aesKeyData = sessionData.aesKey

    if (e.target.newPassword.value.length !== 0) {
      if (e.target.newPassword.value !== e.target.newPasswordConfirm.value) {
        createFormError(
          'newPassword',
          'Passwords does not match. Please try again.',
        )
        return
      }

      const newSalt = generateSalt()

      const hashData = await hashPassword(e.target.newPassword.value, newSalt)

      newData = { ...newData, hash: hashData }

      aesKeyData = await generateAesKey(e.target.newPassword.value, newSalt)
    }

    const index = users.indexOf(foundUser)

    users.splice(index, 1, newData)

    await saveUsers(users)

    setSessionData({
      ...sessionData,
      username: newData.username,
      aesKey: aesKeyData,
    })

    loadData(sessionData.userId, sessionData.aesKey)
      .then((database: AccountData[]) => {
        saveData(database, sessionData.userId, aesKeyData)
          .then(() => {
            setAlert({
              open: true,
              type: 'success',
              message: 'Your settings have been saved.',
            })
          })
          .catch(() => {})
      })
      .catch(() => {})

    setFormError({ fieldName: '', message: '' })
  }

  return (
    <>
      <Typography variant="h6" mb={2}>
        User Information
      </Typography>
      <Stack
        component="form"
        spacing={2}
        onSubmit={(e) => {
          handleSubmit(e).catch(() => {})
        }}
      >
        <div>The following field is required for security reasons.</div>

        <PasswordInput
          fullWidth={true}
          label="Current Password"
          name="currentPassword"
          value={null}
          onChange={null}
          error={formError.fieldName === 'currentPassword'}
          helperText={
            formError.fieldName === 'currentPassword' ? formError.message : ''
          }
        />

        <div>You can leave empty the fields you don&apos;t want to update.</div>

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
          defaultValue={sessionData.username}
          autoComplete="off"
        />
        <Grid container columnGap={2}>
          <Grid item xs>
            <PasswordInput
              fullWidth={true}
              label="New Password"
              name="newPassword"
              value={null}
              onChange={handleChangePassword}
              error={false}
              helperText=""
            />
            <PasswordIndicator password={newPassword} />
          </Grid>
          <Grid item xs>
            <TextField
              fullWidth
              variant="filled"
              label="Confirm New Password"
              type="password"
              name="newPasswordConfirm"
              inputProps={{ maxLength: 100 }}
              error={formError.fieldName === 'newPasswordConfirm'}
              helperText={
                formError.fieldName === 'newPasswordConfirm'
                  ? formError.message
                  : ''
              }
              size="small"
              sx={{
                '& ::-ms-reveal': {
                  display: 'none',
                },
              }}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            startIcon={<CheckIcon />}
          >
            Save Information
          </Button>
          <DeleteUser />
        </Stack>
      </Stack>
    </>
  )
}

export default UserSettings
