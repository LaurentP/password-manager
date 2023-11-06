import { createTheme } from '@mui/material/styles'

const styles = createTheme({
  components: {
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
          backgroundColor: '#252525',
          color: '#fff',
        },
      },
    },
  },
})

export default styles
