import { createTheme } from '@mui/material/styles'

const lightStyle = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          userSelect: 'none',
          cursor: 'default',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          textTransform: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          textTransform: 'none',
          ':hover': {
            opacity: '.8',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minWidth: 150,
          backgroundColor: '#151515',
          color: '#fff',
        },
      },
    },
  },
})

export default lightStyle
