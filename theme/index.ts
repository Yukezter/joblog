import { createTheme, responsiveFontSizes } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const fontFamily = {
  heading: '"Bebas Neue", cursive',
  body: '"Montserrat", sans-serif',
}

// Create a theme instance.
let theme = createTheme({
  typography: {
    fontFamily: fontFamily.body,
    h1: {
      fontFamily: fontFamily.heading,
      fontSize: '5rem',
      // letterSpacing: '0.00735em',
      lineHeight: 1,
    },
    h2: {
      fontFamily: fontFamily.heading,
    },
    h3: {
      fontFamily: fontFamily.heading,
    },
    h4: {
      fontFamily: fontFamily.heading,
    },
    h5: {
      fontFamily: fontFamily.heading,
    },
    h6: {
      fontFamily: fontFamily.heading,
    },
    subtitle1: {
      fontSize: '1.15rem',
      lineHeight: 1.5,
      fontWeight: 500,
    },
  },
  palette: {
    background: {
      // default: '#fafafa',
      default: '#fff',
    },
    primary: {
      main: '#778DA9',
    },
    secondary: {
      main: '#415A77',
    },
    error: {
      main: red.A400,
    },
  },
  // breakpoints: {
  //   values: {
  //     xs: 0,
  //     sm: 600,
  //     md: 900,
  //     lg: 1100,
  //     xl: 1536,
  //   },
  // },
  components: {
    MuiContainer: {
      styleOverrides: {
        // The disableGutters property won't work when styleOverrides are applied
        // so as a workaround, we use a callback to access the component's props
        // See https://github.com/mui/material-ui/issues/3082
        root: ({ ownerState, theme }) => ({
          ...(!ownerState.disableGutters && {
            [theme.breakpoints.between('xs', 'sm')]: {
              padding: `0 ${theme.spacing(3)}`,
            },
          }),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
        },
      },
    },
  },
})

// theme = responsiveFontSizes(theme)

export default theme
