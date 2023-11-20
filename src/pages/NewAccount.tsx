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
import type { AlertDataContextType } from '../typings/AlertData'
import type { FormError } from '../typings/FormError'
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
  const [formError, setFormError] = useState<FormError>({
    fieldName: '',
    message: '',
  })

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
