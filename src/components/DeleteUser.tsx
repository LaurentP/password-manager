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
import { BaseDirectory, exists, removeFile } from '@tauri-apps/api/fs'
import { useState } from 'react'
import { AlertContext } from '../contexts/AlertContext'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import getUsers from '../services/get-users'
import hashPassword from '../services/hash-password'
import saveUsers from '../services/save-users'
import type { AlertDataContextType } from '../typings/AlertData'
import type { SessionDataContextType } from '../typings/SessionData'
import type { UserData } from '../typings/UserData'
import PasswordInput from './PasswordInput'

type DeleteState = {
  dialog: boolean
  password: string
  passwordError: boolean
  passwordErrorText: string
}

const DeleteUser = (): JSX.Element => {
  const [, setAlert] = useTypedContext<AlertDataContextType>(AlertContext)
  const [sessionData, setSessionData] =
    useTypedContext<SessionDataContextType>(SessionContext)

  const [deleteState, setDeleteState] = useState<DeleteState>({
    dialog: false,
    password: '',
    passwordError: false,
    passwordErrorText: '',
  })
  const [attempts, setAttempts] = useState<number>(0)

  const openDeleteDialog = (): void => {
    setDeleteState({
      dialog: true,
      password: '',
      passwordError: false,
      passwordErrorText: '',
    })
  }

  const handleDelete = async (): Promise<void> => {
    if (deleteState.password.length === 0) {
      setDeleteState({
        ...deleteState,
        passwordError: true,
        passwordErrorText: 'Your password is required.',
      })
      return
    }

    const users = await getUsers()

    const foundUser = users.find(
      (item: UserData) => item.id === sessionData.userId,
    )
    if (foundUser === undefined) {
      return
    }

    const salt = foundUser.hash.slice(0, 32)

    const hash = await hashPassword(deleteState.password, salt)

    if (foundUser.hash !== hash) {
      setDeleteState({
        ...deleteState,
        passwordError: true,
        passwordErrorText: 'Wrong password. Please try again.',
      })
      setAttempts(attempts + 1)
      if (attempts === 5) {
        setSessionData({ ...sessionData, isAuth: false })
        setAlert({
          open: true,
          type: 'error',
          message: 'You have exceeded the maximum number of attempts.',
        })
      }
      return
    }

    const index = users.indexOf(foundUser)

    users.splice(index, 1)

    await saveUsers(users)

    const fileName = `data/data-${sessionData.userId}.bin`
    const options = { dir: BaseDirectory.Resource }

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
        onClick={openDeleteDialog}
      >
        Delete User
      </Button>
      <Dialog open={deleteState.dialog}>
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
              setDeleteState({ ...deleteState, password: e.target.value })
            }}
            error={deleteState.passwordError}
            helperText={deleteState.passwordErrorText}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            disableElevation
            startIcon={<CloseIcon />}
            onClick={() => {
              setDeleteState({ ...deleteState, dialog: false })
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
              handleDelete().catch(() => {})
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
