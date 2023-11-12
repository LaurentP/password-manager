import { FileDownload as FileDownloadIcon } from '@mui/icons-material'
import { Button, Grid, Stack, Typography } from '@mui/material'
import { save as saveFile } from '@tauri-apps/api/dialog'
import { exists, removeFile, writeTextFile } from '@tauri-apps/api/fs'
import { AlertContext } from '../contexts/AlertContext'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import loadData from '../services/load-data'
import type { AccountData } from '../typings/AccountData'
import type { AlertDataContextType } from '../typings/AlertData'
import type { SessionDataContextType } from '../typings/SessionData'

const Export = (): JSX.Element => {
  const [, setAlert] = useTypedContext<AlertDataContextType>(AlertContext)
  const [sessionData] = useTypedContext<SessionDataContextType>(SessionContext)

  const formatCSV = (data: string): string => {
    data = data.replace(/"/g, '""')

    if (/[,"]/g.test(data)) {
      return `"${data}"`
    }

    return data
  }

  const handleExport = async (): Promise<void> => {
    const csvData: string[] = []

    csvData.push('name,url,username,password,notes')

    const dataToExport: AccountData[] = await loadData(
      sessionData.userId,
      sessionData.aesKey,
    )

    dataToExport.forEach((item: AccountData) => {
      Reflect.deleteProperty(item, 'id')
      Reflect.deleteProperty(item, 'usedAt')

      // To prevent issue at import
      item.notes = item.notes.replace(/[\r\n]/g, ' ')

      // To escape double quotes and commas for CSV
      item.name = formatCSV(item.name)
      item.url = formatCSV(item.url)
      item.username = formatCSV(item.username)
      item.password = formatCSV(item.password)
      item.notes = formatCSV(item.notes)

      const csvRow = Object.values(item).toString()

      csvData.push(csvRow)
    })

    const csvFileContent = csvData.join('\n')

    const filePath = await saveFile({
      filters: [{ name: 'CSV File', extensions: ['csv'] }],
    })

    if (filePath === null) {
      return
    }

    if (await exists(filePath)) {
      await removeFile(filePath)
    }
    writeTextFile(filePath.toString(), csvFileContent)
      .then(() => {
        setAlert({
          open: true,
          type: 'success',
          message: 'Your data has been exported.',
        })
      })
      .catch(() => {})
  }

  return (
    <Grid item xs display="flex">
      <Stack direction="column" spacing={2} width="100%">
        <Typography variant="h6">Export Data</Typography>
        <Typography textAlign="justify">
          Back up all your raw data by saving it in a CSV file, store it on a
          secure storage device or import it to another device.
        </Typography>
        <Stack direction="row" alignItems="flex-end" flexGrow={1}>
          <Button
            variant="contained"
            disableElevation
            startIcon={<FileDownloadIcon />}
            onClick={() => {
              handleExport().catch(() => {})
            }}
          >
            Export to CSV
          </Button>
        </Stack>
      </Stack>
    </Grid>
  )
}

export default Export
