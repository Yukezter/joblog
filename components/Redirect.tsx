import Router from 'next/router'
import Box from '@mui/material/Box'
import Spinner from '@mui/material/CircularProgress'

const Redirect = ({ to }: { to: Parameters<typeof Router.push>[0] }) => {
  Router.push(to)

  return (
    <Box display='flex' m='auto'>
      <Spinner />
    </Box>
  )
}

export default Redirect
