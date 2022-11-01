import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PersonIcon from '@mui/icons-material/PersonOutline'
import EmailIcon from '@mui/icons-material/MailOutline'
import PhoneIcon from '@mui/icons-material/PhoneOutlined'
import type { Person } from '../types'
import Link from './Link'

type NotablePersonProps = Person & {
  action?: React.ReactElement
}

const NotablePerson = ({ position, name, email, phoneNumber, action }: NotablePersonProps) => {
  return (
    <Box
      p={2}
      bgcolor={theme =>
        theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)'
      }
    >
      <Box display='flex' justifyContent='space-between' alignItems='center' width='100%'>
        <Typography variant='caption' color='secondary' display='block' mb={1}>
          {position}
        </Typography>
        {action}
      </Box>
      <Box display='flex' alignItems='center' mb={0.5}>
        <PersonIcon color='secondary' sx={{ mr: 2 }} />
        <Typography fontWeight={600}>{name}</Typography>
      </Box>
      <Box display='flex' alignItems='center' mb={0.5}>
        <EmailIcon color='secondary' sx={{ mr: 2 }} />
        {email ? (
          <Link href={`mailto:${email}`} variant='body2' color='text.disabled'>
            {email}
          </Link>
        ) : (
          <Typography variant='body2' color='text.disabled' sx={{ textDecoration: 'underline' }}>
            N/A
          </Typography>
        )}
      </Box>
      <Box display='flex' alignItems='center' mb={0.5}>
        <PhoneIcon color='secondary' sx={{ mr: 2 }} />
        {phoneNumber ? (
          <Link href={`tel:${phoneNumber}`} variant='body2' color='text.disabled'>
            {phoneNumber}
          </Link>
        ) : (
          <Typography variant='body2' color='text.disabled' sx={{ textDecoration: 'underline' }}>
            N/A
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default NotablePerson
