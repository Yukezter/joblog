import React from 'react'
import Box from '@mui/material/Box'

const Root = ({ children }: React.PropsWithChildren) => {
  return (
    <Box minHeight='100vh' display='flex' flexDirection='column'>
      {children}
    </Box>
  )
}

export default Root
