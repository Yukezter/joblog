// import { useSession } from 'next-auth/react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Navbar from '../components/Navbar'
import NavbarBrand from '../components/NavbarBrand'

type PublicLayoutProps = {
  children?: React.ReactNode
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  // const { data: session } = useSession()

  // if (session) {

  // }

  return (
    <Box display='flex' flexDirection='column' minHeight='100vh'>
      <Navbar>
        <NavbarBrand />
      </Navbar>
      <Box flexGrow={1} display='flex' justifyContent='center' alignItems='center'>
        <Container maxWidth='lg'>{children}</Container>
      </Box>
    </Box>
  )
}

export default PublicLayout
