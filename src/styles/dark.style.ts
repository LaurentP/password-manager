import { blue } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

const darkStyle = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#151515',
    },
    primary: {
      main: blue[700],
    },
    tonalOffset: 0.2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          userSelect: 'none',
          cursor: 'default',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          color: '#fff',
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
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000',
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
          backgroundColor: '#111',
          color: '#fff',
        },
      },
    },
  },
})

export default darkStyle
