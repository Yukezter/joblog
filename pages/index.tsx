// import '../styles/Home.module.css'
import type { NextPage, GetServerSideProps } from 'next'
import Head from 'next/head'
import GlobalStyles from '@mui/material/GlobalStyles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import landingImage from '../assets/images/landing.jpg'
import getServerSession from '../utils/getServerSession'
import Link from '../components/Link'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerSession(context.req, context.res)

  if (session) {
    return {
      redirect: {
        destination: '/applications',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>JobLog - Keep your Job Search Organized</title>
        <meta
          name='description'
          content='Organize your Job Search by centralizing all your job applications.'
        />
      </Head>
      <GlobalStyles
        styles={theme => ({
          body: {
            background: `url(${landingImage.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom left',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
          },
        })}
      />
      <Box maxWidth={500} ml={{ sm: 5 }}>
        <Typography
          variant='h1'
          color='primary'
          sx={{ textShadow: '-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black' }}
        >
          Stay Organized
        </Typography>
        <Typography variant='subtitle1' mb={3}>
          JobLog aims to help job seekers by offering a centralized place to store job applications
        </Typography>
        <Button
          component={Link}
          href='/auth/signin'
          noLinkStyle
          variant='outlined'
          color='inherit'
          size='large'
          sx={{ mr: 2 }}
        >
          Sign In
        </Button>
        <Button component={Link} href='/auth/signin' noLinkStyle variant='contained' size='large'>
          Create Account
        </Button>
      </Box>
    </>
  )
}

export default Home
