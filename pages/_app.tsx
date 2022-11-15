import '../styles/globals.css'
import React from 'react'
import Head from 'next/head'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { SessionProvider, SessionProviderProps } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import theme from '../theme'
import createEmotionCache from '../utils/createEmotionCache'
import { AuthProvider } from '../context/AuthContext'
import PublicLayout from '../layouts/PublicLayout'
import { BASE_URL } from '../utils/constants'
import Root from '../components/Root'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  Layout?: React.FC
  // Auth?: React.FC
}

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout
  emotionCache?: EmotionCache
  pageProps: AppProps['pageProps'] & {
    session: SessionProviderProps['session']
    // dehydratedState: DehydratedState
  }
}

const MyApp = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps: { session, ...pageProps },
}: MyAppProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 10,
          },
        },
      })
  )

  const router = useRouter()
  const canonicalURL = BASE_URL + router.asPath
  const Layout = Component.Layout || PublicLayout
  // const Auth = Component.Auth || (({ children }: React.PropsWithChildren) => <>{children}</>)

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        {/* <Hydrate state={dehydratedState}> */}
        <CacheProvider value={emotionCache}>
          <Head>
            <link rel='icon' href='/favicon.ico' />
            <link rel='canonical' href={canonicalURL} />
          </Head>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Root>
              {/* <AuthProvider> */}
              <Layout>
                <Component {...pageProps} />
              </Layout>
              {/* </AuthProvider> */}
            </Root>
          </ThemeProvider>
        </CacheProvider>
        {/* </Hydrate> */}
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp
