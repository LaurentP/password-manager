import { Clear as ClearIcon, Search as SearchIcon } from '@mui/icons-material'
import {
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import EditAccount from '../components/EditAccount'
import Layout from '../components/Layout'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import loadData from '../services/load-data'
import sortData from '../services/sort-data'
import type { AccountData } from '../typings/AccountData'
import type { SessionDataContextType } from '../typings/SessionData'

const Accounts = (): JSX.Element => {
  const [sessionData] = useTypedContext<SessionDataContextType>(SessionContext)

  const [database, setDatabase] = useState<AccountData[]>([])
  const [listView, setListView] = useState<AccountData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedId, setSelectedId] = useState<AccountData['id'] | null>(null)
  const [searchValue, setSearchValue] = useState<string>('')

  const location = useLocation()

  useEffect(() => {
    loadData(sessionData.userId, sessionData.aesKey)
      .then((result: AccountData[]) => {
        setLoading(false)

        if (result.length === 0) return

        setDatabase(result)

        const list = result.sort(sortData)

        setListView([...list])
      })
      .catch(() => {})

    if (location.state?.id !== undefined) {
      setSelectedId(location.state.id)
    }
  }, [])

  useEffect(() => {
    const value = searchValue.toUpperCase()

    setListView(
      database.filter(
        (result: AccountData) =>
          result.name.toUpperCase().includes(value) ||
          result.username.toUpperCase().includes(value),
      ),
    )
  }, [searchValue])

  const resetListView = (data: AccountData[]): void => {
    setListView([...data])
  }

  const resetSelectedId = (): void => {
    setSelectedId(null)
  }

  const handleSearchChange = (e: React.BaseSyntheticEvent): void => {
    setSearchValue(e.target.value)
  }

  const handleClick = (id: AccountData['id']): void => {
    setSelectedId(id)
  }

  return (
    <Layout>
      <Typography variant="h5" mx={2} mt={2}>
        Accounts
      </Typography>

      <Grid container flexGrow={1}>
        <Grid
          item
          xs={5}
          xl={4}
          height="calc(100vh - 70px)"
          borderRight="1px solid"
          borderColor={(theme) => theme.palette.divider}
        >
          <TextField
            fullWidth
            variant="standard"
            type="search"
            placeholder="Search account..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchValue !== '' && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setSearchValue('')
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                p: 1,
                '& ::-webkit-search-cancel-button': {
                  display: 'none', // "WebkitAppearance: 'none'" does not hide the default cancel button on Ubuntu 22.04 LTS
                },
                '& input': {
                  WebkitAppearance: 'none', // Hide the default border on Ubuntu 22.04 LTS
                },
              },
            }}
            value={searchValue}
            onChange={(e) => {
              handleSearchChange(e)
            }}
          />

          {loading ? (
            <Stack
              justifyContent="center"
              alignItems="center"
              height="calc(100% - 70px)"
            >
              <CircularProgress disableShrink />
              <br />
              Loading...
            </Stack>
          ) : (
            <TableContainer
              sx={{
                maxHeight: 'calc(100% - 50px)',
              }}
            >
              <Table>
                <TableBody>
                  {listView.map((accountData: AccountData) => (
                    <TableRow
                      key={accountData.id}
                      hover
                      selected={accountData.id === selectedId}
                      onClick={() => {
                        handleClick(accountData.id)
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <strong>{accountData.name}</strong>
                        <br />
                        {accountData.username}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        <Grid item xs={7} xl={8} height="calc(100vh - 120px)">
          {selectedId !== null ? (
            <EditAccount
              id={selectedId}
              listView={listView}
              resetListView={resetListView}
              resetSelectedId={resetSelectedId}
            />
          ) : (
            <Stack justifyContent="center" alignItems="center" height="100%">
              No account selected
            </Stack>
          )}
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Accounts
