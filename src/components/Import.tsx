import { FileUpload as FileUploadIcon } from '@mui/icons-material'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { open as openFile } from '@tauri-apps/api/dialog'
import { readTextFile } from '@tauri-apps/api/fs'
import { AlertContext } from '../contexts/AlertContext'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import loadData from '../services/load-data'
import parseCSV from '../services/parse-csv'
import saveData from '../services/save-data'
import type { AccountData } from '../typings/AccountData'
import type { AlertData, AlertDataContextType } from '../typings/AlertData'
import type { SessionDataContextType } from '../typings/SessionData'

const Import = (): JSX.Element => {
  const [, setAlert] = useTypedContext<AlertDataContextType>(AlertContext)
  const [sessionData] = useTypedContext<SessionDataContextType>(SessionContext)

  const handleImport = async (): Promise<void> => {
    const filePath = await openFile({
      filters: [{ name: 'CSV File', extensions: ['csv'] }],
    })

    if (filePath === null) {
      return
    }

    const fileContents = (await readTextFile(filePath.toString(), {}))
      .trim()
      .split('\n')

    fileContents[0] = fileContents[0].trim()

    const findDelimiter = fileContents[0].match(/[,;\t\s|]/g)

    const errorState: AlertData = {
      open: true,
      type: 'error',
      message: 'The file is invalid or corrupted.',
    }

    if (findDelimiter === null) {
      setAlert(errorState)
      return
    }

    const delimiter = findDelimiter[0]

    if (
      fileContents[0] !==
      `name${delimiter}url${delimiter}username${delimiter}password${delimiter}notes`
    ) {
      setAlert(errorState)
      return
    }

    // Remove headers
    fileContents.splice(0, 1)

    const newData: AccountData[] = []

    fileContents.forEach((row: string) => {
      const rowItems = parseCSV(row, delimiter)

      const newDataItem: AccountData = {
        id: crypto.randomUUID(),
        name: rowItems[0],
        url: rowItems[1],
        username: rowItems[2],
        password: rowItems[3],
        notes: rowItems[4],
        usedAt: Date.now(),
      }
      newData.push(newDataItem)
    })

    loadData(sessionData.userId, sessionData.aesKey)
      .then((database: AccountData[]) => {
        database = database.concat(newData)

        saveData(database, sessionData.userId, sessionData.aesKey)
          .then(() => {
            setAlert({
              open: true,
              type: 'success',
              message: 'The new data has been imported.',
            })
          })
          .catch(() => {})
      })
      .catch(() => {})
  }

  return (
    <Grid item xs display="flex">
      <Stack direction="column" spacing={2} width="100%">
        <Typography variant="h6">Import Data</Typography>
        <Typography textAlign="justify">
          Before importing your data, please ensure your CSV file header matches
          the following as order : name, url, username, password, notes.
        </Typography>
        <Stack direction="row" alignItems="flex-end" flexGrow={1}>
          <Button
            variant="contained"
            disableElevation
            startIcon={<FileUploadIcon />}
            onClick={() => {
              handleImport().catch(() => {})
            }}
          >
            Import from CSV
          </Button>
        </Stack>
      </Stack>
    </Grid>
  )
}

export default Import
