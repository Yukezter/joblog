import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import type { ApplicationStatusOptions } from '../types'

type StatusProps = BoxProps & { status: ApplicationStatusOptions }

const ApplicationStatus = ({ status, ...props }: StatusProps) => {
  const statusColors: { [key in ApplicationStatusOptions]: string } = {
    Applied: '#e0e1dd',
    Interview: '#6e4bb9',
    Interviewed: '#4b64b9',
    Rejected: '#b94b4b',
    Offer: '#4bb964',
  }

  return (
    <Box display='flex' alignItems='center' {...props}>
      <span
        style={{
          height: 12,
          width: 12,
          display: 'inline-block',
          background: statusColors[status],
          borderRadius: '50%',
          marginRight: 6,
        }}
      />
      <Typography variant='caption'>{status}</Typography>
    </Box>
  )
}

export default ApplicationStatus
