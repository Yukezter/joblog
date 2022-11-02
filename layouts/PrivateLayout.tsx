import React from 'react'
import { signOut } from 'next-auth/react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import AccountIcon from '@mui/icons-material/AccountBox'
import Navbar from '../components/Navbar'
import NavbarBrand from '../components/NavbarBrand'
import Link from '../components/Link'

const NotificationsPopper = () => {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(previousOpen => !previousOpen)
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorEl && anchorEl.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const canBeOpen = open && Boolean(anchorEl)
  const id = canBeOpen ? 'notifications-popup' : undefined

  return (
    <div>
      <IconButton aria-describedby={id} color='inherit' onClick={handleClick}>
        <NotificationsIcon />
      </IconButton>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement='bottom-end'
        disablePortal
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ p: 1 }}>
              <ClickAwayListener onClickAway={handleClose}>
                <div>Notifications coming soon!</div>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  )
}

const AccountPopper = () => {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(previousOpen => !previousOpen)
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorEl && anchorEl.contains(event.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const canBeOpen = open && Boolean(anchorEl)
  const id = canBeOpen ? 'account-popup' : undefined

  return (
    <div>
      <IconButton aria-describedby={id} color='inherit' onClick={handleClick}>
        <AccountIcon />
      </IconButton>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement='bottom-end'
        disablePortal
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  <MenuItem>
                    <ListItemIcon>
                      <SettingsIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Settings</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => signOut()}>
                    <ListItemIcon>
                      <LogoutIcon fontSize='small' />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  )
}

const Footer = () => (
  <Container maxWidth='md' sx={{ mt: 'auto' }}>
    <Box display='flex' alignItems='center' py={2}>
      <Typography variant='caption' mr={0.5}>
        Designed and developed by
      </Typography>
      <Link href='https://personal-website-gamma-six-74.vercel.app' variant='caption'>
        Bryan Hinchliffe
      </Link>
    </Box>
  </Container>
)

type PrivateLayoutProps = {
  children?: React.ReactNode
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <Box minHeight='100vh' display='flex' flexDirection='column'>
      <Navbar variant='outlined' sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <NavbarBrand href='/applications' />
          <div style={{ display: 'flex' }}>
            <NotificationsPopper />
            <AccountPopper />
          </div>
        </Container>
      </Navbar>
      <Container maxWidth='md' sx={{ py: { xs: 10, sm: 12 } }}>
        {children}
      </Container>
      <Footer />
    </Box>
  )
}

export default PrivateLayout
