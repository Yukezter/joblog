import React from 'react'
// import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Spinner from '@mui/material/CircularProgress'
import type { NextPageWithLayout } from '../../_app'
// import getServerSession from '../../../utils/getServerSession'
// import { getApplication } from '../../../services/applications'
import PrivateLayout from '../../../layouts/PrivateLayout'
import Link from '../../../components/Link'
import useApplication from '../../../hooks/useApplication'
import useEditApplication from '../../../hooks/useEditApplication'
import ApplicationForm, { ApplicationFormProps } from '../../../components/ApplicationForm'
// import Redirect from '../../../components/Redirect'

// export const getServerSideProps: GetServerSideProps = async context => {
//   const session = await getServerSession(context.req, context.res)

//   if (!session || !session.user) {
//     return {
//       redirect: {
//         destination: '/auth/signin',
//         permanent: false,
//       },
//     }
//   }

//   const { id } = context.query
//   const { user } = session

//   if (typeof id !== 'string') {
//     return {
//       notFound: true,
//     }
//   }

//   const application = await getApplication({ _id: id, user_id: user.id })

//   if (!application) {
//     return {
//       notFound: true,
//     }
//   }

//   const { _id, ...data } = application
//   const autocompleteOptions = await getAutcompleteOptions({ user_id: user.id })

//   return {
//     props: {
//       data,
//       autocompleteOptions,
//     },
//   }
// }

// type EditProps = {
//   data: JobApplicationResponse
//   autocompleteOptions:
// }

const Edit: NextPageWithLayout = () => {
  const router = useRouter()
  const { id } = router.query
  const { data} = useApplication(id as string)
  const { mutate, status } = useEditApplication()

  const onSubmit: ApplicationFormProps['onSubmit'] = data => {
    mutate({ id: id as string, data })
  }

  const redirectTo = React.useMemo(() => {
    if (status === 'success') {
      return `/applications/${id}`
    }
  }, [status, id])  

  return (
    <div>
      <Button
        component={Link}
        href={`/applications/${id}`}
        variant='text'
        startIcon={<ArrowBackIosSharpIcon />}
        sx={{ textTransform: 'none', mb: 2 }}
      >
        Back
      </Button>
      <Typography variant='h4' mb={1}>
        Edit
      </Typography>
      <ApplicationForm
          onSubmit={onSubmit}
          defaultValues={data}
          isLoading={['loading', 'success'].includes(status)}
          redirectTo={redirectTo}
        />
    </div>
  )
}

Edit.Layout = PrivateLayout

export default Edit
