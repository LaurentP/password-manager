import {
  Close as CloseIcon,
  PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'
import { exists, removeFile } from '@tauri-apps/api/fs'
import { useState } from 'react'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import getDataDirectory from '../services/get-data-directory'
import getUsers from '../services/get-users'
import hashPassword from '../services/hash-password'
import saveUsers from '../services/save-users'
import type { FailedAttemptsData } from '../typings/FailedAttemptsData'
import type { SessionDataContextType } from '../typings/SessionData'
import type { UserData } from '../typings/UserData'
import PasswordInput from './PasswordInput'

type DeleteUserState = {
  dialog: boolean
  password: string
  passwordError: boolean
  passwordErrorText: string
}

const DeleteUser = (): JSX.Element => {
  const [sessionData, setSessionData] =
    useTypedContext<SessionDataContextType>(SessionContext)

  const [deleteUserState, setDeleteUserState] = useState<DeleteUserState>({
    dialog: false,
    password: '',
    passwordError: false,
    passwordErrorText: '',
  })
  const [failedAttempts, setFailedAttempts] = useState<number>(0)

  const openDeleteUserDialog = (): void => {
    setDeleteUserState({
      dialog: true,
      password: '',
      passwordError: false,
      passwordErrorText: '',
    })
  }

  const handleDeleteUser = async (): Promise<void> => {
    if (deleteUserState.password.length === 0) {
      setDeleteUserState({
        ...deleteUserState,
        passwordError: true,
        passwordErrorText: 'Your password is required.',
      })
      return
    }

    const users = await getUsers()

    const foundUser = users.find(
      (item: UserData) => item.id === sessionData.userId,
    )
    if (foundUser === undefined) return

    const salt = foundUser.hash.slice(0, 32)

    const hash = await hashPassword(deleteUserState.password, salt)

    if (foundUser.hash !== hash) {
      setDeleteUserState({
        ...deleteUserState,
        passwordError: true,
        passwordErrorText: 'Wrong password. Please try again.',
      })

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

    const index = users.indexOf(foundUser)

    users.splice(index, 1)

    await saveUsers(users)

    const fileName = `data/data-${sessionData.userId}.bin`
    const options = { dir: getDataDirectory() }

    if (await exists(fileName, options)) {
      await removeFile(fileName, options)
    }

    setSessionData({ ...sessionData, isAuth: false })
  }

  return (
    <>
      <Button
        variant="contained"
        disableElevation
        startIcon={<PersonRemoveIcon />}
        color="error"
        onClick={openDeleteUserDialog}
      >
        Delete User
      </Button>
      <Dialog open={deleteUserState.dialog}>
        <DialogTitle>Delete user</DialogTitle>
        <DialogContent>
          <DialogContentText mb={2}>
            Be sure you want to delete your user account and all associated
            data. Your password is required if you confirm your user account
            deletion.
          </DialogContentText>
          <PasswordInput
            fullWidth={true}
            label="Password"
            name="deleteConfirmPassword"
            value={null}
            onChange={(e: React.BaseSyntheticEvent) => {
              setDeleteUserState({
                ...deleteUserState,
                password: e.target.value,
              })
            }}
            error={deleteUserState.passwordError}
            helperText={deleteUserState.passwordErrorText}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            disableElevation
            startIcon={<CloseIcon />}
            onClick={() => {
              setDeleteUserState({ ...deleteUserState, dialog: false })
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            disableElevation
            startIcon={<PersonRemoveIcon />}
            onClick={() => {
              handleDeleteUser().catch(() => {})
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DeleteUser
