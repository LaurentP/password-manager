import { Stack } from '@mui/material'
import type { ReactNode } from 'react'
import Navigation from './Navigation'

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <Stack direction="row" height="100vh">
      <Navigation />

      <Stack
        direction="column"
        rowGap={2}
        height="100%"
        width="100%"
        overflow="auto"
      >
        {children}
      </Stack>
    </Stack>
  )
}

export default Layout
