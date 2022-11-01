import React from 'react'
import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { signIn } from 'next-auth/react'
// import type { NextPageWithLayout } from '../_app'
import getServerSession from '../../utils/getServerSession'
// import PublicLayout from '../../layouts/PublicLayout'
// import Container from '@mui/material/Container'
// import Typography from '@mui/material/Typography'
// import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'
// import Link from '../components/Link'

const SignUp: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign Up | JobLog</title>
        <meta name='description' content='Create an account on JobLog.' />
      </Head>
      <div>Sign Up</div>
      <button onClick={() => signIn('google').catch(err => console.log(err))}>
        Create Account
      </button>
    </>
  )
}

// SignUp.Layout = PublicLayout

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
    props: {},
  }
}

export default SignUp
