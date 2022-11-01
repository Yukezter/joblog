import React from 'react'
import { GetServerSideProps } from 'next'
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { NextPageWithLayout } from '../_app'
import getServerSession from '../../utils/getServerSession'
import {
  getApplications,
  getAutcompleteOptions,
  AutocompleteOptions,
} from '../../services/applications'
import PrivateLayout from '../../layouts/PrivateLayout'
import Link from '../../components/Link'
import ApplicationForm, { ApplicationFormProps } from '../../components/ApplicationForm'
import useCreateApplication from '../../hooks/useCreateApplication'

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerSession(context.req, context.res)

  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  const { user } = session
  const autocompleteOptions = await getAutcompleteOptions({ user_id: user.id })

  console.log(autocompleteOptions)

  return {
    props: {
      autocompleteOptions,
    },
  }
}

type CreateProps = {
  autocompleteOptions: AutocompleteOptions
}

const Create: NextPageWithLayout<CreateProps> = ({ autocompleteOptions }) => {
  const { mutate, status } = useCreateApplication()

  const onSubmit: ApplicationFormProps['onSubmit'] = data => {
    mutate(data)
  }

  return (
    <div>
      <Button
        component={Link}
        href='/applications'
        variant='text'
        startIcon={<ArrowBackIosSharpIcon />}
        sx={{
          textTransform: 'none',
          mb: 3,
        }}
      >
        Back
      </Button>
      <Typography variant='h4' mb={2}>
        Add a job application
      </Typography>
      <ApplicationForm
        autocompleteOptions={autocompleteOptions}
        onSubmit={onSubmit}
        redirect={status === 'success'}
      />
    </div>
  )
}

Create.Layout = PrivateLayout

export default Create
