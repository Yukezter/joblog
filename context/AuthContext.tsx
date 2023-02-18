import React from 'react'
import { useSession, getSession } from 'next-auth/react'
import Router from 'next/router'
// import { useQuery } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import Spinner from '@mui/material/CircularProgress'
// import { Data as UserSettings } from '../pages/api/users/settings'
// import httpAPI from '../utils/httpAPI'

// const useUserSettings = () => {
//   return useQuery(['users', 'settings'], () => {
//     return httpAPI.get('/users/settings')
//   })
// }

type Data = ReturnType<typeof useSession>['data']

type Auth = {
  user?: NonNullable<NonNullable<Data>['user']>
  refresh: () => Promise<void>
  // settings: UserSettings
}

const AuthContext = React.createContext<Auth>({} as Auth)

export const useAuth = () => React.useContext(AuthContext)

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const { data: session, status } = useSession()
  const [data, setData] = React.useState<Data>()
  // const userSettings = useUserSettings()

  React.useEffect(() => {
    if (status === 'authenticated') {
      setData(session)
    } else if (status === 'unauthenticated') {
      Router.push('/auth/signin')
    }
  }, [session, status])

  const user = React.useMemo(() => {
    if (data?.user) {
      return data.user
    }
  }, [data?.user])

  const refresh = React.useCallback(async () => {
    const newSession = await getSession()
    setData(newSession)
    // const event = new Event('visibilitychange')
    // document.dispatchEvent(event)
  }, [])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <Box m='auto'>
        <Spinner />
      </Box>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
