import { Divider, Grid, Stack, Typography } from '@mui/material'
import Export from '../components/Export'
import Import from '../components/Import'
import Layout from '../components/Layout'
import UserSettings from '../components/UserSettings'

const Settings = (): JSX.Element => {
  return (
    <Layout>
      <Typography variant="h5" mx={2} mt={2}>
        Settings
      </Typography>
      <Stack mx={2}>
        <UserSettings />
        <Divider sx={{ my: 4 }} />
        <Grid container height="100%" maxHeight="180px" pt={2}>
          <Import />
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Export />
        </Grid>
      </Stack>
    </Layout>
  )
}

export default Settings
