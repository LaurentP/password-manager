import { Check as CheckIcon } from '@mui/icons-material'
import { Button, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountForm from '../components/AccountForm'
import Layout from '../components/Layout'
import { AlertContext } from '../contexts/AlertContext'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import loadData from '../services/load-data'
import saveData from '../services/save-data'
import type { AccountData } from '../typings/AccountData'
import type { AccountFormError } from '../typings/AccountFormError'
import type { AlertDataContextType } from '../typings/AlertData'
import type { SessionDataContextType } from '../typings/SessionData'

const NewAccount = (): JSX.Element => {
  const [, setAlert] = useTypedContext<AlertDataContextType>(AlertContext)
  const [sessionData] = useTypedContext<SessionDataContextType>(SessionContext)

  const navigate = useNavigate()

  const [accountData, setAccountData] = useState<AccountData>({
    id: crypto.randomUUID(),
    name: '',
    url: '',
    username: '',
    password: '',
    notes: '',
    usedAt: Date.now(),
  })
  const [formError, setFormError] = useState<AccountFormError>({
    name: { status: false, message: '' },
    username: { status: false, message: '' },
    password: { status: false, message: '' },
  })

  const handleChange = (e: React.BaseSyntheticEvent): void => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.BaseSyntheticEvent): void => {
    e.preventDefault()

    if (e.target.name.value.length === 0) {
      setFormError({
        name: {
          status: true,
          message: 'Account Name is required.',
        },
        username: { status: false, message: '' },
        password: { status: false, message: '' },
      })
      return
    }

    if (e.target.username.value.length === 0) {
      setFormError({
        name: { status: false, message: '' },
        username: {
          status: true,
          message: 'Username is required.',
        },
        password: { status: false, message: '' },
      })
      return
    }

    if (e.target.password.value.length === 0) {
      setFormError({
        name: { status: false, message: '' },
        username: { status: false, message: '' },
        password: {
          status: true,
          message: 'Password is required.',
        },
      })
      return
    }

    loadData(sessionData.userId, sessionData.aesKey)
      .then((database: AccountData[]) => {
        database.push(accountData)

        saveData(database, sessionData.userId, sessionData.aesKey)
          .then(() => {
            setAlert({
              open: true,
              type: 'success',
              message: 'The new account has been saved successfully.',
            })
            navigate('/', {
              state: { id: accountData.id },
            })
          })
          .catch(() => {})
      })
      .catch(() => {})
  }

  return (
    <Layout>
      <Typography variant="h5" mx={2} mt={2} mb={2}>
        New Account
      </Typography>

      <AccountForm
        accountData={accountData}
        formError={formError}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        formButtons={
          <Button
            type="submit"
            variant="contained"
            disableElevation
            startIcon={<CheckIcon />}
          >
            Save New Account
          </Button>
        }
      />
    </Layout>
  )
}

export default NewAccount
