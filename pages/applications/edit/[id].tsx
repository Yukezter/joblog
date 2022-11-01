import React from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import type { NextPageWithLayout } from '../../_app'
import { JobApplication, JobApplicationResponse } from '../../../types'
import getServerSession from '../../../utils/getServerSession'
import { getAutcompleteOptions, AutocompleteOptions } from '../../../services/applications'
import { getApplication } from '../../../services/applications'
import PrivateLayout from '../../../layouts/PrivateLayout'
import Link from '../../../components/Link'
// import useApplication from '../../../hooks/useApplication'
import useEditApplication from '../../../hooks/useEditApplication'
import ApplicationForm, { ApplicationFormProps } from '../../../components/ApplicationForm'

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

  const { id } = context.query
  const { user } = session

  if (typeof id !== 'string') {
    return {
      notFound: true,
    }
  }

  const application = await getApplication({ _id: id, user_id: user.id })

  if (!application) {
    return {
      notFound: true,
    }
  }

  const { _id, ...data } = application
  const autocompleteOptions = await getAutcompleteOptions({ user_id: user.id })

  return {
    props: {
      data,
      autocompleteOptions,
    },
  }
}

// type Data = Exclude<Awaited<ReturnType<typeof getApplication>>, null>

type EditProps = {
  data: JobApplicationResponse
  autocompleteOptions: AutocompleteOptions
}

const Edit: NextPageWithLayout<EditProps> = ({ data, autocompleteOptions }) => {
  const router = useRouter()
  const { id } = router.query
  // const { data } = useApplication(id as string)
  const { mutate, status } = useEditApplication(id as string)

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
          mb: 2,
        }}
      >
        Back
      </Button>
      <Typography variant='h4' mb={1}>
        Edit
      </Typography>
      <ApplicationForm
        onSubmit={onSubmit}
        defaultValues={data}
        autocompleteOptions={autocompleteOptions}
        redirect={status === 'success'}
      />
    </div>
  )
}

Edit.Layout = PrivateLayout

export default Edit
