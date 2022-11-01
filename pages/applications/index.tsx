import React from 'react'
import { GetServerSideProps } from 'next'
import type { NextPageWithLayout } from '../_app'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// import Paper from '@mui/material/Paper'
// import Popper from '@mui/material/Popper'
// import Fade from '@mui/material/Fade'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Skeleton from '@mui/material/Skeleton'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import ApplicationIcon from '@mui/icons-material/StickyNote2'
// import ArrowDownIcon from '@mui/icons-material/ArrowDropDown'
import AddIcon from '@mui/icons-material/Add'
import { applicationStatuses, jobLocationTypes, jobTypes } from '../../types.d'
import getServerSession from '../../utils/getServerSession'
import { formatPay } from '../../utils/formatting'
import useApplications from '../../hooks/useApplications'
import PrivateLayout from '../../layouts/PrivateLayout'
import Link from '../../components/Link'
import ApplicationStatus from '../../components/ApplicationStatus'
// import { sortByOptions } from '../api/applications'

type ListOptionSelectProps<T> = {
  id?: string
  label: string
  value?: T | ''
  options: readonly T[]
  onChange: (value: T | '') => void
}

const ListOptionSelect = <T extends string>(props: ListOptionSelectProps<T>) => {
  const { id, label, value = '', options, onChange } = props
  const isEmpty = !value

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as T | '')
  }

  return (
    <TextField
      id={id}
      select
      InputLabelProps={{ sx: { color: 'primary.main' } }}
      hiddenLabel
      aria-label={label}
      value={value}
      onChange={handleChange}
      size='small'
      color='primary'
      SelectProps={{
        displayEmpty: true,
        renderValue: v => <>{!v ? label : v}</>,
        MenuProps: {
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        },
      }}
      sx={{
        mr: 1,
        borderColor: 'primary.main',
        '& .MuiInputBase-input': {
          color: isEmpty ? 'text.secondary' : 'background.default',
          ...(!!value && { bgcolor: 'primary.main' }),
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'primary.main',
          },
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiSvgIcon-root': {
          color: isEmpty ? 'text.secondary' : 'background.default',
        },
      }}
    >
      <MenuItem value=''>
        <em>None</em>
      </MenuItem>
      {options.map(option => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}

type ApplicationsToolbarProps = {
  sortBy: SortBy
  onSortBy: (newSortBy: SortBy) => void
  isLoading: boolean
  applicationsCount?: number
}

const ApplicationsToolbar = ({
  sortBy,
  onSortBy,
  // isLoading,
  applicationsCount,
}: ApplicationsToolbarProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [isFabHidden, setIsFabHidden] = React.useState(true)

  React.useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current

    const observer = new IntersectionObserver(
      entries => {
        setIsFabHidden(entries[0].isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(el)

    return () => {
      observer.unobserve(el)
    }
  }, [])

  return (
    <Box
      ref={containerRef}
      display='flex'
      alignItems='center'
      color='background.default'
      bgcolor='secondary.main'
      px={3}
      py={1}
    >
      <Box display={{ xs: 'none', md: 'flex' }} mr={3}>
        <ApplicationIcon />
        <Typography fontWeight={600} ml={1}>
          {applicationsCount} {applicationsCount === 1 ? 'Application' : 'Applications'}
        </Typography>
      </Box>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
        <Typography variant='body2'>Sort by: </Typography>
        {/* <ListOptionSelect
          id='sort-select'
          label='Date'
          value={sortBy}
          options={['dateApplied', 'companyName', 'jobTitle', 'applicationStatus']}
          onChange={value => {
            onSortBy(value || 'dateApplied')
          }}
        /> */}
        <TextField
          id='sort-select'
          select
          // disabled={isLoading}
          InputLabelProps={{ sx: { color: 'primary.main' } }}
          hiddenLabel
          aria-label='sort'
          value={sortBy}
          onChange={event => {
            onSortBy((event.target.value as SortBy) || 'dateApplied')
          }}
          size='small'
          SelectProps={{
            MenuProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
            },
          }}
          sx={{
            // mr: 1,
            // borderColor: 'transparent',
            '& .MuiInputBase-input': {
              color: 'background.default',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
              // '&.Mui-disabled fieldset': {
              //   borderColor: 'transparent',
              // },
            },
            '& .MuiSvgIcon-root': {
              color: 'background.default',
            },
          }}
        >
          {[
            { label: 'Date', value: 'dateApplied' },
            { label: 'Company Name', value: 'companyName' },
            { label: 'Position', value: 'jobTitle' },
            { label: 'Status', value: 'applicationStatus' },
          ].map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <Button
        component={Link}
        href='/applications/create'
        variant='contained'
        size='small'
        startIcon={<AddIcon />}
      >
        Add
      </Button>
      <SpeedDial
        ariaLabel='Create a new application'
        hidden={isFabHidden}
        // @ts-ignore
        FabProps={{ component: Link, href: '/applications/create' }}
        sx={{ position: 'fixed', bottom: 16, right: { xs: 20, sm: 32 } }}
        icon={<SpeedDialIcon />}
      />
    </Box>
  )
}

type Filters = Parameters<typeof useApplications>[0]
type SortBy = Parameters<typeof useApplications>[1]

const Applications: NextPageWithLayout = () => {
  const [filters, setFilters] = React.useState<Filters>({})
  const [sortBy, setSortBy] = React.useState<SortBy>('dateApplied')
  const { data, isLoading } = useApplications(filters, sortBy)

  const addFilter = (newFilters: Filters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
    }))
  }

  const removeFilter = (filterKey: keyof Filters) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters }
      delete newFilters[filterKey]
      return newFilters
    })
  }

  const handleFilterChange =
    <T extends keyof Filters>(filterKey: T) =>
    (value: Filters[T] | '') => {
      if (value) {
        addFilter({ [filterKey]: value })
      } else {
        removeFilter(filterKey)
      }
    }

  const updateSortBy = (newSortBy: SortBy) => {
    setSortBy(newSortBy)
  }

  return (
    <Box>
      <Grid container>
        <Box component={Grid} md={3} display={{ xs: 'none', md: 'initial' }}>
          <Stack spacing={1} border={theme => `1px solid ${theme.palette.divider}`} p={2} mr={2}>
            <Typography fontWeight={600} mb={1}>
              Status
            </Typography>
            {applicationStatuses.map(status => (
              <Box key={status} display='flex' justifyContent='space-between' alignItems='center'>
                <ApplicationStatus status={status} />
                <Typography variant='caption'>
                  {!data
                    ? '-'
                    : data.filter(application => {
                        return application.applicationStatus === status
                      }).length}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
        <Grid xs={12} md={9}>
          <div>
            <ApplicationsToolbar
              sortBy={sortBy}
              onSortBy={updateSortBy}
              isLoading={isLoading}
              applicationsCount={data?.length}
            />
            <Box pt={2} pb={1} whiteSpace='nowrap' overflow='auto'>
              {/* {['Position'].map(filter => (
                <Button
                  key={filter}
                  disabled={isLoading}
                  variant='outlined'
                  endIcon={<ArrowDownIcon />}
                  sx={{
                    mr: 1,
                    textTransform: 'none',
                    '& .MuiButton-endIcon': {
                      marginLeft: 0,
                    },
                  }}
                >
                  {filter}
                </Button>
              ))} */}
              <ListOptionSelect
                id='filter-select-status'
                label='Status'
                value={filters.applicationStatus}
                options={applicationStatuses}
                onChange={handleFilterChange('applicationStatus')}
              />
              <ListOptionSelect
                id='filter-select-schedule'
                label='Schedule'
                value={filters.jobType}
                options={jobTypes}
                onChange={handleFilterChange('jobType')}
              />
              <ListOptionSelect
                id='filter-select-location'
                label='Location'
                value={filters.jobLocationType}
                options={jobLocationTypes}
                onChange={handleFilterChange('jobLocationType')}
              />
              <ListOptionSelect
                id='filter-select-date-applied'
                label='Date'
                value={filters.dateApplied}
                options={['30d', '90d', '1y', '2y', '5y']}
                onChange={handleFilterChange('dateApplied')}
              />
            </Box>
            <List>
              {(!data ? Array.from(Array<undefined>(5)) : data).map((application, index) => (
                <ListItem
                  key={index}
                  {...(application && {
                    component: Link,
                    href: `/applications/${application._id}`,
                  })}
                  sx={theme => ({
                    mb: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  })}
                >
                  <Box position='relative' display='flex' width='100%' my={1.25}>
                    <div style={{ flex: 1 }}>
                      {application && (
                        <Box display={{ xs: 'flex', sm: 'none' }} alignItems='center' mb={1}>
                          <ApplicationStatus status={application.applicationStatus} />
                          <Typography variant='caption' color='text.disabled' ml='auto'>
                            {new Date(application.dateApplied).toLocaleDateString()}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        display='flex'
                        width='100%'
                        justifyContent='space-between'
                        alignItems='center'
                      >
                        <Typography variant='body1' fontWeight={600} flex={1}>
                          {application ? application.companyName : <Skeleton width='60%' />}
                        </Typography>
                        {application && (
                          <ApplicationStatus
                            status={application.applicationStatus}
                            display={{ xs: 'none', sm: 'flex' }}
                          />
                        )}
                      </Box>
                      <Typography variant='body2' color='text.secondary' mb={1}>
                        {application ? application.jobTitle : <Skeleton width='40%' />}
                      </Typography>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        {application ? (
                          <>
                            <div>
                              {[
                                application.jobType,
                                application.jobLocationType,
                                formatPay(application.pay),
                              ].map(detail => (
                                <Button
                                  key={detail}
                                  variant='outlined'
                                  size='small'
                                  sx={{
                                    mr: 1,
                                    textTransform: 'none',
                                  }}
                                >
                                  {detail}
                                </Button>
                              ))}
                            </div>
                            <Typography
                              variant='caption'
                              color='text.disabled'
                              ml='auto'
                              display={{ xs: 'none', sm: 'initial' }}
                            >
                              {new Date(application.dateApplied).toLocaleDateString()}
                            </Typography>
                          </>
                        ) : (
                          <div style={{ display: 'flex' }}>
                            <Skeleton variant='rounded' width={60} height={24} sx={{ mr: 2 }} />
                            <Skeleton variant='rounded' width={60} height={24} sx={{ mr: 2 }} />
                            <Skeleton variant='rounded' width={60} height={24} />
                          </div>
                        )}
                      </div>
                    </div>
                  </Box>
                </ListItem>
              ))}
            </List>
          </div>
        </Grid>
      </Grid>
    </Box>
  )
}

Applications.Layout = PrivateLayout

export const getServerSideProps: GetServerSideProps = async context => {
  const session = await getServerSession(context.req, context.res)

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  console.log(session)

  // const queryClient = new QueryClient()

  // await queryClient.prefetchQuery(['applications'], async () => {
  //   return Application.find<PartialApplication>({ owner: '123123' }).lean()
  // })

  return {
    props: {
      // dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Applications

/* <ListItemText
                    disableTypography
                    primary={
                      <Typography variant='body1' fontWeight={600}>
                        {application.companyName}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant='body2' color='text.secondary' mb={1}>
                          {application.jobTitle}
                        </Typography>
                        {[application.jobType, application.jobLocation, '$60K'].map(detail => (
                          <Button
                            key={detail}
                            variant='outlined'
                            size='small'
                            sx={{
                              mr: 1,
                              textTransform: 'none',
                            }}
                          >
                            {detail}
                          </Button>
                        ))}
                      </>
                    }
                  />
                  <Typography variant='caption' color='text.secondary' my={1.25}>
                    {new Date(application.dateApplied).toLocaleDateString()}
                  </Typography> */
