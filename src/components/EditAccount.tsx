import {
  Check as CheckIcon,
  Close as CloseIcon,
  DeleteForever as DeleteForeverIcon,
} from '@mui/icons-material'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { AlertContext } from '../contexts/AlertContext'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import loadData from '../services/load-data'
import saveData from '../services/save-data'
import type { AccountData } from '../typings/AccountData'
import type { AlertDataContextType } from '../typings/AlertData'
import type { FormError } from '../typings/FormError'
import type { SessionDataContextType } from '../typings/SessionData'
import AccountForm from './AccountForm'

type DeleteState = { dialog: boolean; status: boolean }

const EditAccount = ({
  id,
  listView,
  resetListView,
  resetSelectedId,
}: {
  id: AccountData['id']
  listView: AccountData[]
  resetListView: CallableFunction
  resetSelectedId: CallableFunction
}): JSX.Element => {
  const [, setAlert] = useTypedContext<AlertDataContextType>(AlertContext)
  const [sessionData] = useTypedContext<SessionDataContextType>(SessionContext)

  const [database, setDatabase] = useState<AccountData[]>([])
  const [accountData, setAccountData] = useState<AccountData>({
    id: '',
    name: '',
    url: '',
    username: '',
    password: '',
    notes: '',
    usedAt: Date.now(),
  })
  const [title, setTitle] = useState<string>('')
  const [formError, setFormError] = useState<FormError>({
    fieldName: '',
    message: '',
  })
  const [deleteState, setDeleteState] = useState<DeleteState>({
    dialog: false,
    status: false,
  })

  useEffect(() => {
    loadData(sessionData.userId, sessionData.aesKey)
      .then((result: AccountData[]) => {
        setDatabase(result)

        const foundData = result.find((item: AccountData) => item.id === id)

        if (foundData !== undefined) {
          setAccountData(foundData)

          setTitle(foundData.name)

          // Update usedAt
          const index = result.findIndex((res: AccountData) => res.id === id)

          const data = { ...foundData, usedAt: Date.now() }

          result.splice(index, 1, data)

          saveData(result, sessionData.userId, sessionData.aesKey).catch(
            () => {},
          )
        }
      })
      .catch(() => {})
  }, [id])

  useEffect(() => {
    if (deleteState.status) {
      setDeleteState({ dialog: false, status: false })

      const accountItem = database.find(
        (item: AccountData) => item.id === accountData.id,
      )
      if (accountItem === undefined) return

      const index = database.indexOf(accountItem)

      database.splice(index, 1)

      setDatabase([...database])

      saveData(database, sessionData.userId, sessionData.aesKey)
        .then(() => {
          const listViewIndex = listView.findIndex(
            (item: AccountData) => item.id === accountItem.id,
          )

          listView.splice(listViewIndex, 1)

          resetSelectedId()
        })
        .catch(() => {})
    }
  }, [deleteState])

  const handleChange = (e: React.BaseSyntheticEvent): void => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value })
  }

  const createFormError = (fieldName: string, message: string): void => {
    setFormError({ fieldName, message })
  }

  const handleSubmit = (e: React.BaseSyntheticEvent): void => {
    e.preventDefault()

    if (e.target.name.value.length === 0) {
      createFormError('name', 'Account Name is required.')
      return
    }

    if (e.target.username.value.length === 0) {
      createFormError('username', 'Username is required.')
      return
    }

    if (e.target.password.value.length === 0) {
      createFormError('password', 'Password is required.')
      return
    }

    const accountItem = database.find(
      (item: AccountData) => item.id === accountData.id,
    )
    if (accountItem === undefined) return

    const index = database.indexOf(accountItem)

    database.splice(index, 1, accountData)

    saveData(database, sessionData.userId, sessionData.aesKey)
      .then(() => {
        setAlert({
          open: true,
          type: 'success',
          message: 'Account changes have been saved.',
        })

        // The new value not display immediately with accountItem.name
        setTitle(accountData.name)

        const listViewIndex = listView.findIndex(
          (item: AccountData) => item.id === accountItem.id,
        )

        listView.splice(listViewIndex, 1, accountData)

        resetListView(listView)
      })
      .catch(() => {})

    setFormError({ fieldName: '', message: '' })
  }

  const handleDelete = (): void => {
    setDeleteState({ ...deleteState, dialog: true })
  }

  return (
    <>
      <Typography variant="h5" mx={2} mb={2}>
        {title}
      </Typography>

      <AccountForm
        accountData={accountData}
        formError={formError}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formButtons={
          <>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              startIcon={<CheckIcon />}
            >
              Save Account
            </Button>
            <Button
              variant="contained"
              color="error"
              disableElevation
              startIcon={<DeleteForeverIcon />}
              onClick={handleDelete}
            >
              Delete Account
            </Button>
          </>
        }
      />

      <Dialog open={deleteState.dialog}>
        <DialogTitle>Delete account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Be sure you want to delete this account:{' '}
            <strong>{accountData.name}</strong>
          </DialogContentText>
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
            startIcon={<DeleteForeverIcon />}
            onClick={() => {
              setDeleteState({ ...deleteState, status: true })
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EditAccount
