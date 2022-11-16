import React from 'react'
// import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import Pusher from 'pusher-js'
import { useMutation } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
// import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Alert from '@mui/material/Alert'
import Collapse from '@mui/material/Collapse'
import NotificationsIcon from '@mui/icons-material/Notifications'
// import SettingsIcon from '@mui/icons-material/Settings'
import CloseIcon from '@mui/icons-material/Close'
// import LogoutIcon from '@mui/icons-material/Logout'
import AccountIcon from '@mui/icons-material/AccountBox'
import type { UserSettings } from '../types'
import httpAPI from '../utils/httpAPI'
import { AuthProvider, useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import NavbarBrand from '../components/NavbarBrand'
import Link from '../components/Link'
// import Redirect from '../components/Redirect'

const NotificationsPopper = () => {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  React.useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      userAuthentication: {
        endpoint: '/auth/socket',
        transport: 'ajax',
      },
    })

    pusher.signin()

    pusher.user.bind('notification', (context: any) => {
      console.log(context)
    })
  }, [])

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

type AccountPopperProps = {
  openSettings: () => void
}

const AccountPopper = ({ openSettings }: AccountPopperProps) => {
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

  const handleClickSettings = () => {
    setOpen(false)
    openSettings()
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
                  <MenuItem onClick={handleClickSettings}>
                    {/* <ListItemIcon>
                      <SettingsIcon fontSize='small' />
                    </ListItemIcon> */}
                    <ListItemText disableTypography>
                      <Typography variant='body2'>Settings</Typography>
                    </ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => signOut()}>
                    {/* <ListItemIcon>
                      <LogoutIcon fontSize='small' />
                    </ListItemIcon> */}
                    <ListItemText disableTypography>
                      <Typography variant='body2' color='error.dark'>
                        Logout
                      </Typography>
                    </ListItemText>
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

type PhoneVerificationProps = {
  auth: ReturnType<typeof useAuth>
  cancel: () => void
}

const PhoneVerification = ({ auth, cancel }: PhoneVerificationProps) => {
  const form = useForm({
    defaultValues: {
      to: '',
      code: '',
    },
  })

  React.useEffect(() => {
    form.setFocus('to')
  }, [form])

  const sendCode = useMutation(
    (to: string) => {
      return httpAPI.post('/verify/phone/send', { to })
    },
    {
      onSuccess() {
        form.setFocus('code')
      },
    }
  )

  const verifyCode = useMutation(
    ({ to, code }: { to: string; code: string }) => {
      return httpAPI.post('/verify/phone/check', { to, code })
    },
    {
      onSuccess() {
        auth.refresh()
      },
    }
  )

  const handleClickSendCode = form.handleSubmit(({ to }) => {
    if (auth.user?.phoneNumber === to) {
      return
    }

    sendCode.mutate(to)
  })

  const handleClickVerifyCode = form.handleSubmit(({ to, code }) => {
    verifyCode.mutate({ to, code })
  })

  const isPendingVerification = sendCode.status === 'success'
  const isVerifying = verifyCode.status === 'loading' || verifyCode.status === 'success'

  return (
    <>
      <Grid xs={12}>
        <TextField
          id='phone-number-input'
          hiddenLabel
          aria-label='phone number'
          placeholder='Phone Number'
          sx={{ mr: { sm: 1 }, height: 44 }}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            ...form.register('to', { required: true }),
            sx: { height: 44 },
          }}
        />
        <Button
          variant='contained'
          disabled={sendCode.status === 'loading' || isPendingVerification}
          sx={{ minWidth: 80, height: '100%', mr: 1 }}
          onClick={handleClickSendCode}
        >
          {sendCode.status === 'loading' ? 'Sending...' : 'Send Code'}
        </Button>
        <Button variant='text' sx={{ minWidth: 80, height: '100%' }} onClick={cancel}>
          Cancel
        </Button>
      </Grid>
      {isPendingVerification && (
        <Grid xs={12}>
          <TextField
            id='sms-code-input'
            placeholder='Code'
            sx={{ height: 48 }}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              ...form.register('code', { required: isPendingVerification }),
              sx: { height: 48, mr: { sm: 1 } },
            }}
          />
          <Button
            variant='contained'
            disabled={isVerifying}
            onClick={handleClickVerifyCode}
            sx={{ height: '100%' }}
          >
            {isVerifying ? 'Checking...' : 'Submit'}
          </Button>
        </Grid>
      )}
    </>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  tab: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, tab, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={tab !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      style={{ marginBottom: 32 }}
      {...other}
    >
      {tab === index && children}
    </div>
  )
}

const a11yProps = (index: number) => {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  }
}

const NotificationsSettings = () => {
  const auth = useAuth()

  const updateSettings = useMutation(
    (data: Omit<UserSettings, 'id'>) => {
      return httpAPI.post('/users/settings/update', data)
    },
    {
      onSuccess() {
        auth.refresh()
      },
    }
  )

  const form = useForm({
    defaultValues: {
      notifications: {
        on: false,
        hourBefore: false,
        dayBefore: false,
        weekBefore: false,
        ...auth.user?.notifications,
      },
    },
  })

  // React.useEffect(() => {
  //   if (user?.notifications) {
  //     console.log(user?.notifications)
  //     form.reset({ notifications: auth.user.notifications })
  //   }
  // }, [form, user?.notifications])

  const handleSubmit = form.handleSubmit(data => {
    updateSettings.mutate(data)
  })

  const [isChangingPhoneNumber, setIsChangingPhoneNumber] = React.useState(false)

  React.useEffect(() => {
    setIsChangingPhoneNumber(false)
  }, [auth.user?.phoneNumber])

  const removePhoneNumber = useMutation(() => httpAPI.post('/users/phone/delete'), {
    async onSuccess() {
      auth.refresh()
    },
  })

  const showPhoneVerification = !auth.user?.phoneNumber || isChangingPhoneNumber
  const isRemovingPhoneNumber = removePhoneNumber.isLoading || removePhoneNumber.isSuccess
  const isDoneRemovingPhoneNumber = removePhoneNumber.isSuccess && !auth.user?.phoneNumber

  const handleCancel = () => {
    setIsChangingPhoneNumber(false)
  }

  const handleRemovePhoneNumber = () => {
    removePhoneNumber.mutate()
  }

  React.useEffect(() => {
    if (isDoneRemovingPhoneNumber) {
      removePhoneNumber.reset()
    }
  }, [isDoneRemovingPhoneNumber, removePhoneNumber])

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant='h5' mb={5}>
        Text Notifications
      </Typography>
      <Collapse in={!auth.user?.phoneNumber}>
        <Box pb={2}>
          <Alert severity='info'>
            A verified phone number is required to receive text notifications.
          </Alert>
        </Box>
      </Collapse>
      <Typography fontWeight={600} display='block' mb={1}>
        {isChangingPhoneNumber ? 'Verify your phone number' : 'Phone number'}
      </Typography>
      <Grid container columnSpacing={{ sm: 1 }} rowSpacing={4}>
        {showPhoneVerification ? (
          <PhoneVerification auth={auth} cancel={handleCancel} />
        ) : (
          <Grid xs={12} display='flex' alignItems='center'>
            <Typography mr={2}>{auth.user?.phoneNumber}</Typography>
            <Button
              variant='text'
              sx={{ minWidth: 80, height: '100%' }}
              disabled={isRemovingPhoneNumber}
              onClick={() => setIsChangingPhoneNumber(true)}
            >
              Change
            </Button>
            <Button
              variant='text'
              color='error'
              disabled={isRemovingPhoneNumber}
              sx={{ minWidth: 80, height: '100%' }}
              onClick={handleRemovePhoneNumber}
            >
              {isRemovingPhoneNumber ? 'Removing...' : 'Remove'}
            </Button>
          </Grid>
        )}
        <Grid xs={12}>
          <Typography fontWeight={600} mb={1}>
            Turn text notifications on/off
          </Typography>
          <FormGroup sx={{ mb: 1 }}>
            <FormControlLabel
              disabled={!auth.user?.phoneNumber}
              control={
                <Controller
                  name='notifications.on'
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label='On'
            />
          </FormGroup>
          <Typography mb={1}>Interview date reminders</Typography>
          <FormGroup>
            <FormControlLabel
              disabled={!auth.user?.phoneNumber}
              control={
                <Controller
                  name='notifications.weekBefore'
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label='1 week before'
            />
            <FormControlLabel
              disabled={!auth.user?.phoneNumber}
              control={
                <Controller
                  name='notifications.dayBefore'
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label='1 day before'
            />
            <FormControlLabel
              disabled={!auth.user?.phoneNumber}
              control={
                <Controller
                  name='notifications.hourBefore'
                  control={form.control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      checked={field.value}
                      onChange={e => field.onChange(e.target.checked)}
                    />
                  )}
                />
              }
              label='1 hour before'
            />
          </FormGroup>
        </Grid>
      </Grid>
      <Box mt='auto'>
        <Button type='submit' variant='contained' size='large' sx={{ mr: 1 }}>
          Save
        </Button>
        <Button variant='outlined' size='large'>
          Cancel
        </Button>
      </Box>
    </form>
  )
}

const Settings = () => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)

  const openSettings = () => {
    setIsSettingsOpen(true)
  }

  const handleSettingsClose = () => {
    setIsSettingsOpen(false)
  }

  const [tab, setTab] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newTab: number) => {
    setTab(newTab)
  }

  return (
    <>
      <AccountPopper openSettings={openSettings} />
      <Dialog
        open={isSettingsOpen}
        onClose={handleSettingsClose}
        fullScreen
        TransitionProps={{
          onExited: () => {
            setTab(0)
          },
        }}
      >
        <Box p={3} width='100%' maxWidth='md' mx='auto'>
          <Box display='flex' mt={4}>
            <IconButton onClick={handleSettingsClose} sx={{ ml: 'auto' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant='h4' mb={3}>
            Settings
          </Typography>
          <Grid container>
            <Grid xs={12} sm='auto'>
              <Box sx={{ borderRight: 1, borderColor: 'divider' }}>
                <Tabs
                  orientation='vertical'
                  value={tab}
                  onChange={handleChange}
                  aria-label='basic tabs example'
                >
                  <Tab label='General' {...a11yProps(0)} />
                  <Tab label='Notifications' {...a11yProps(1)} />
                </Tabs>
              </Box>
            </Grid>
            <Grid
              xs={12}
              sm
              display='flex'
              flexDirection='column'
              pl={{ sm: 5 }}
              minHeight={{ sm: 400 }}
            >
              <TabPanel tab={tab} index={0}>
                General settings coming soon!
              </TabPanel>
              <TabPanel tab={tab} index={1}>
                <NotificationsSettings />
              </TabPanel>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  )
}

type PrivateLayoutProps = {
  children?: React.ReactNode
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  return (
    <AuthProvider>
      <Navbar variant='outlined' sx={{ bgcolor: 'background.default' }}>
        <Container maxWidth='md' sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <NavbarBrand href='/applications' />
          <div style={{ display: 'flex' }}>
            <NotificationsPopper />
            <Settings />
          </div>
        </Container>
      </Navbar>
      <Container maxWidth='md' sx={{ py: { xs: 10, sm: 12 } }}>
        {children}
      </Container>
      <Footer />
    </AuthProvider>
  )
}

export default PrivateLayout
