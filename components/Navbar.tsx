// import { useSession } from 'next-auth/react'
import AppBar, { AppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
// import Container from '@mui/material/Container'

type NavbarProps = AppBarProps & {
  // children?: React.ReactNode
}

const Navbar = ({ children, ...props }: NavbarProps) => {
  // const { data: session } = useSession()

  // if (session) {

  // }

  return (
    <AppBar color='transparent' elevation={0} {...props}>
      <Toolbar sx={{ justifyContent: 'center' }}>{children}</Toolbar>
    </AppBar>
  )
}

export default Navbar
