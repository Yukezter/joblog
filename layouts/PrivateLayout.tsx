import React from 'react'
// import { useRouter } from 'next/router'
import { signOut } from 'next-auth/react'
import Pusher from 'pusher-js'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Unstable_Grid2'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
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
import Spinner from '@mui/material/CircularProgress'
import type { UserNotification, UserSettings } from '../types'
import httpAPI from '../utils/httpAPI'
import { AuthProvider, useAuth } from '../context/AuthContext'
import useSettings from '../hooks/useSettings' 
import Navbar from '../components/Navbar'
import NavbarBrand from '../components/NavbarBrand'
import Link from '../components/Link'

const useNotifications = () => {
  return useQuery(['notifications'], async () => {
    const { data } = await httpAPI.get<UserNotification[]>('/users/notifications')
    return data
  })
}

const Notifications = ({ notifications }: { notifications: ReturnType<typeof useNotifications> }) => {

  if (notifications.isLoading) {
    return <Spinner />
  }

  if (notifications.isError) {
    return <Spinner />
  }

  if (!notifications.data.length) {
    return <Typography variant='body2' m='auto'>No Notifications</Typography>
  }

  return (
    <List dense disablePadding>
      {notifications.data.map(notification => {
        const date = new Date(notification.createdAt)
        return (
          <ListItem key={notification.id} divider sx={{ ...(!notification.seen && { bgcolor: 'grey.100' }) }}>
            <ListItemText
              primary={notification.message}
              secondary={date.toLocaleDateString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
              secondaryTypographyProps={{ variant: 'caption' }}
            />
          </ListItem>
        )
      })}
    </List>
  )
}

const NotificationsPopper = () => {
  const [open, setOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  const seeNotifications = useMutation<void, unknown, string[]>(async data => {
    await httpAPI.post('/users/notifications/read', data)
  }, {
    onMutate(data) {
      // Cancel current query and optimistically update unread notifications
      queryClient.cancelQueries(['notifications'])
      queryClient.setQueryData<UserNotification[]>(
        ['notifications'],
        (currentNotifications = []) => {
          return currentNotifications.map(notification => {
            if (data.includes(notification.id)) {
              return {
                ...notification,
                seen: true,
              }
            }

            return notification
          })
        }
      )
    },
    onSettled() {
      queryClient.refetchQueries<UserNotification[]>(['notifications'])
    }
  })

  const handleSeeNotifications = () => {
    if (notifications.data) {
      const unseen = notifications.data.filter(notification => {
        return !notification.seen
      })

      if (unseen.length) {
        seeNotifications.mutate(unseen.map(notification => notification.id))
      }
    }
  }

  const clearNotifications = useMutation(async () => {
    await httpAPI.post('/users/notifications/clear')
  }, {
    onMutate() {
      // Cancel current query and optimistically clear notifications
      queryClient.cancelQueries(['notifications'])
      queryClient.setQueryData<UserNotification[]>(['notifications'], [])
    },
    onSettled() {
      queryClient.refetchQueries<UserNotification[]>(['notifications'])
    }
  })

  const handleClearNotifications = () => {
    clearNotifications.mutate()
  }

  React.useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      userAuthentication: {
        endpoint: '/auth/socket',
        transport: 'ajax',
      },
    })

    pusher.signin()

    pusher.user.bind('notification', (context: UserNotification) => {
      console.log(context)

      // Cancel current query and optimistically add new notification
      queryClient.cancelQueries(['notifications'])
      queryClient.setQueryData<UserNotification[]>(
        ['notifications'],
        (data = []) => [...data, context]
      )

      queryClient.refetchQueries<UserNotification[]>(['notifications'])
    })
  }, [])
  
  const shouldMarkAsSeen = React.useRef(false)
  
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    setOpen(previousOpen => {
      const newOpen = !previousOpen
      if (!newOpen) {
        shouldMarkAsSeen.current = true
      }

      return newOpen
    })
  }

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorEl && anchorEl.contains(event.target as HTMLElement)) {
      return
    }

    shouldMarkAsSeen.current = true
    setOpen(false)
  }

  // Mark notifications as seen whenever user closes the notifications popper
  // The shouldMarkAsSeen ref ensures handleSeeNotifications only runs once when popper closes
  React.useEffect(() => {
    if (!shouldMarkAsSeen.current) {
      return
    }

    handleSeeNotifications()
    shouldMarkAsSeen.current = false
  }, [handleSeeNotifications])

  const canBeOpen = open && Boolean(anchorEl)
  const id = canBeOpen ? 'notifications-popup' : undefined
  
  return (
    <div>
      <IconButton aria-describedby={id} color='inherit' onClick={handleOpen}>
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
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <Box width={300}display='flex' flexDirection='column'>
                  <Box display='flex' justifyContent='space-between' px={1.5} py={0.5}>
                    <Typography variant='h6' display='flex' alignItems='center'>
                      Your Notifications
                    </Typography>
                    <Button
                      variant='text'
                      disabled={!notifications.data?.length}
                      onClick={handleClearNotifications}
                    >
                      Clear All
                    </Button>
                  </Box>
                  <Divider />
                  <Box maxHeight={300} minHeight={120} display='flex' sx={{ overflowY: 'auto' }}>
                    <Notifications notifications={notifications} />
                  </Box>
                </Box>
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
                    <ListItemText disableTypography>
                      <Typography variant='body2'>Settings</Typography>
                    </ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => signOut()}>
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

type PhoneVerificationProps = {
  settings: ReturnType<typeof useSettings>
  cancel: () => void
}

const PhoneVerification = ({ settings, cancel }: PhoneVerificationProps) => {
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

  const handleCancelVerification = () => {
    sendCode.reset()
  }

  const queryClient = useQueryClient()

  const verifyCode = useMutation(
    ({ to, code }: { to: string; code: string }) => {
      return httpAPI.post('/verify/phone/check', { to, code })
    },
    {
      onSuccess() {
        queryClient.refetchQueries(['settings'])
      },
    }
  )

  const handleClickSendCode = form.handleSubmit(({ to }) => {
    if (settings.data?.phoneNumber === to) {
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
          {sendCode.status === 'loading' ? 'Sending...' : 'Get Code'}
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
              sx: { height: 48, mr: 1 },
            }}
          />
          <Button
            variant='contained'
            disabled={isVerifying}
            onClick={handleClickVerifyCode}
            sx={{ height: '100%', mr: 1 }}
          >
            {isVerifying ? 'Checking...' : 'Submit'}
          </Button>
          <Button variant='text' sx={{ minWidth: 80, height: '100%' }} onClick={handleCancelVerification}>
            Cancel
          </Button>
        </Grid>
      )}
    </>
  )
}

type FormSettings = Omit<UserSettings, 'id' | 'phoneNumber'>

const Settings = () => {
  const auth = useAuth()
  const settings = useSettings(auth.user?.id)

  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)

  const handleOpen = () => {
    setIsSettingsOpen(true)
  }

  const handleClose = () => {
    setIsSettingsOpen(false)
  }

  const queryClient = useQueryClient()
  const updateSettings = useMutation<void, unknown, FormSettings>(
    data => httpAPI.post('/users/settings/update', data),
    {
      onSuccess() {
        queryClient.refetchQueries(['settings'])
      },
    }
  )

  const form = useForm<FormSettings>()

  React.useEffect(() => {
    if (settings.data && settings.isFetchedAfterMount) {
      form.reset(settings.data)
    }
  }, [settings.data, settings.isFetchedAfterMount])

  const handleSubmit = form.handleSubmit(data => {
    updateSettings.mutate(data)
  })

  const [isChangingPhoneNumber, setIsChangingPhoneNumber] = React.useState(false)

  React.useEffect(() => {
    setIsChangingPhoneNumber(false)
  }, [settings.data?.phoneNumber])

  const removePhoneNumber = useMutation(() => httpAPI.post('/users/phone/delete'), {
    onSuccess() {
      queryClient.refetchQueries(['settings'])
    },
  })

  const showPhoneVerification = !settings.data?.phoneNumber || isChangingPhoneNumber
  const isRemovingPhoneNumber = removePhoneNumber.isLoading || removePhoneNumber.isSuccess
  const isDoneRemovingPhoneNumber = removePhoneNumber.isSuccess && !settings.data?.phoneNumber

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
    <>
      <AccountPopper openSettings={handleOpen} />
      <Dialog open={isSettingsOpen} onClose={handleClose}>
        <Box p={5} width='100%' maxWidth='md' mx='auto'>
          <Box display='flex' justifyContent='space-between' justifyItems='center' mb={4}>
            <Typography variant='h4'>
              Settings
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container>
            <Grid xs={12}>
                <Collapse in={!settings.data?.phoneNumber}>
                  <Box pb={2}>
                    <Alert severity='info'>
                      A verified phone number is required to receive text notifications.
                    </Alert>
                  </Box>
                </Collapse>
                <Typography fontWeight={600} display='block' mb={1}>
                  Phone number for text notifications
                </Typography>
                <Grid container mb={1} rowSpacing={2}>
                {showPhoneVerification ? (
                    <PhoneVerification settings={settings} cancel={handleCancel} />
                  ) : (
                    <Grid xs={12} display='flex' alignItems='center'>
                      <Typography mr={2}>{settings.data?.phoneNumber}</Typography>
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
                </Grid>
              <form onSubmit={handleSubmit}>
                <FormGroup sx={{ mb: 4 }}>
                  <FormControlLabel
                    disabled={!settings.data?.phoneNumber}
                    control={
                      <Controller
                        name='textRemindersDisabled'
                        control={form.control}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            disabled={!settings.data?.phoneNumber}
                            checked={field.value}
                            onChange={e => field.onChange(e.target.checked)}
                          />
                        )}
                      />
                    }
                    label='Disable Text Reminders'
                  />
                </FormGroup>
                <Box mt='auto'>
                  <Button
                    type='submit'
                    disabled={updateSettings.isLoading}
                    variant='contained'
                    size='large'
                    sx={{ mr: 1 }}
                  >
                    {updateSettings.isLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant='outlined' size='large' onClick={handleClose}>
                    Cancel
                  </Button>
                </Box>
              </form>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
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