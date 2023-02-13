import React from 'react'
// import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import ArrowBackIosSharpIcon from '@mui/icons-material/ArrowBackIosSharp'
// import AddIcon from '@mui/icons-material/Add'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Unstable_Grid2'
import Skeleton from '@mui/material/Skeleton'
import type { NextPageWithLayout } from '../_app'
// import getServerSession from '../../utils/getServerSession'
import { formatPay } from '../../utils/formatting'
import useApplication from '../../hooks/useApplication'
import PrivateLayout from '../../layouts/PrivateLayout'
import Link from '../../components/Link'
import ApplicationStatus from '../../components/ApplicationStatus'
import NotablePerson from '../../components/NotablePerson'

const BorderBox = styled((props: BoxProps) => (
  <Box px={4} py={3} border={theme => `1px solid ${theme.palette.divider}`} {...props} />
))({})

// export const getServerSideProps: GetServerSideProps = async context => {
//   // const session = await getServerSession(context.req, context.res)

//   // if (!session || !session.user) {
//   //   return {
//   //     redirect: {
//   //       destination: '/auth/signin',
//   //       permanent: false,
//   //     },
//   //   }
//   // }

//   return {
//     props: {
//       id: context.query.id,
//     },
//   }
// }

const Application: NextPageWithLayout = () => {
  const router = useRouter()
  const { id } = router.query
  const { data } = useApplication(id as string)
  return (
    <div>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Button
          component={Link}
          href='/applications'
          variant='text'
          startIcon={<ArrowBackIosSharpIcon />}
          sx={{
            textTransform: 'none',
          }}
        >
          Applications
        </Button>
        <Button
          component={Link}
          href={`/applications/edit/${id}`}
          variant='contained'
          size='small'
          // startIcon={<AddIcon />}
        >
          Edit
        </Button>
      </Box>
      <div>
        <BorderBox borderBottom={0}>
          {data && <ApplicationStatus status={data.applicationStatus} mb={2} />}
          <Typography variant='h3'>
            {!data ? <Skeleton width={200} /> : data.companyName}
          </Typography>
          <Typography variant='body1' fontWeight={600}>
            {!data ? <Skeleton width={250} /> : data.jobTitle}
          </Typography>
        </BorderBox>
        <BorderBox borderBottom={0}>
          <Typography variant='h5' mb={2}>
            Job Details
          </Typography>
          <Grid container rowSpacing={2}>
            <Grid xs={12} md={3}>
              <Typography variant='body2' color='text.disabled'>
                Pay
              </Typography>
              <Typography variant='body1'>
                {!data ? <Skeleton width='80%' sx={{ maxWidth: 200 }} /> : formatPay(data.pay)}
              </Typography>
            </Grid>
            <Grid xs={12} md={3}>
              <Typography variant='body2' color='text.disabled'>
                Job Type
              </Typography>
              <Typography variant='body1'>
                {!data ? <Skeleton width='80%' sx={{ maxWidth: 200 }} /> : data.jobType}
              </Typography>
            </Grid>
            <Grid xs={12} md={3}>
              <Typography variant='body2' color='text.disabled'>
                Job Location Type
              </Typography>
              <Typography variant='body1'>
                {!data ? <Skeleton width='80%' sx={{ maxWidth: 200 }} /> : data.jobLocationType}
              </Typography>
            </Grid>
            <Grid xs={12} md={3}>
              <Typography variant='body2' color='text.disabled'>
                Job Location
              </Typography>
              <Typography variant='body1'>
                {!data ? (
                  <Skeleton width='80%' sx={{ maxWidth: 200 }} />
                ) : data.jobLocation ? (
                  `${data.jobLocation.structured_formatting.main_text}, ${data.jobLocation.structured_formatting.secondary_text}`
                ) : (
                  'N/A'
                )}
              </Typography>
            </Grid>
          </Grid>
        </BorderBox>
        <BorderBox borderBottom={0}>
          <Typography variant='h5' mb={2}>
            Application Details
          </Typography>
          <Grid container rowSpacing={2}>
            <Grid xs={12} md={3}>
              <Typography variant='body2' color='text.disabled'>
                Date Applied
              </Typography>
              <Typography variant='body1'>
                {!data ? (
                  <Skeleton width='80%' sx={{ maxWidth: 200 }} />
                ) : (
                  new Date(data.dateApplied).toLocaleDateString()
                )}
              </Typography>
            </Grid>
            <Grid xs={12} md={3}>
              <Typography variant='body2' color='text.disabled'>
                Job Board
              </Typography>
              <Typography variant='body1'>
                {!data ? <Skeleton width='80%' sx={{ maxWidth: 200 }} /> : data.jobBoard}
              </Typography>
            </Grid>
            <Grid xs={12} md={3}>
              <Typography variant='body2' color='text.disabled'>
                Submission Method
              </Typography>
              <Typography variant='body1'>
                {!data ? <Skeleton width='80%' sx={{ maxWidth: 200 }} /> : data.submissionMethod}
              </Typography>
            </Grid>
          </Grid>
        </BorderBox>
        <BorderBox>
          <Typography variant='h5' mb={2}>
            Notable People
          </Typography>
          <Grid container rowSpacing={2} columnSpacing={2} mb={1}>
            {(!data ? Array.from(Array<undefined>(2)) : data.notablePeople).map((person, index) => (
              <Grid key={index} xs={12} md={6}>
                {!person ? (
                  <Skeleton variant='rectangular' height={150} />
                ) : (
                  <NotablePerson {...person} />
                )}
              </Grid>
            ))}
            {data && data.notablePeople.length === 0 && (
              <Grid xs={12} display='flex' justifyContent='center'>
                <Typography variant='body2' py={5} color='text.disabled'>
                  No people here!
                </Typography>
              </Grid>
            )}
          </Grid>
        </BorderBox>
      </div>
    </div>
  )
}

Application.Layout = PrivateLayout

export default Application
