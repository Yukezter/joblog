import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Navbar from '../components/Navbar'
import NavbarBrand from '../components/NavbarBrand'

type PublicLayoutProps = {
  children?: React.ReactNode
}

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <>
      <Navbar>
        <NavbarBrand />
      </Navbar>
      <Box flexGrow={1} display='flex' justifyContent='center' alignItems='center'>
        <Container maxWidth='lg'>{children}</Container>
      </Box>
    </>
  )
}

export default PublicLayout
