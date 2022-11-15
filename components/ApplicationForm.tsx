import React from 'react'
import Router from 'next/router'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { styled } from '@mui/material/styles'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Unstable_Grid2'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import type { JobApplication, Person } from '../types'
import useApplicationFormOptions from '../hooks/useApplicationFormOptions'
import Link from '../components/Link'
import CreatableAutocomplete from './CreatableAutocomplete'
import PlacesAutocomplete from './PlacesAutocomplete'
import NotablePerson from '../components/NotablePerson'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '1.4rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

type PersonFormProps = {
  handleClose: () => void
  positions: ReturnType<typeof useApplicationFormOptions>['data']['peoplePositions']
  selectedPerson?: Person
  savePerson: (person: Person) => void
}

const PersonForm = (props: PersonFormProps) => {
  const { handleClose, positions, selectedPerson, savePerson } = props

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Person>({
    defaultValues: {
      position: '',
      name: '',
      email: null,
      phoneNumber: null,
      ...selectedPerson,
    },
  })

  const onSubmit = handleSubmit(data => {
    savePerson(data)
    handleClose()
  })

  return (
    <>
      <DialogTitle variant='h4'>{selectedPerson ? 'Edit Person' : 'Add Person'}</DialogTitle>
      <DialogContent>
        <Stack display='block' mt={1} spacing={2}>
          <Controller
            name='position'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <CreatableAutocomplete
                {...field}
                id='position-autocomplete'
                options={positions}
                TextFieldProps={{
                  label: 'Position *',
                  placeholder: 'Position',
                }}
              />
            )}
          />
          <TextField
            id='name'
            label='Name *'
            placeholder='Full Name'
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ ...register('name', { required: true }) }}
          />
          <TextField
            id='email'
            label='Email Address (optional)'
            placeholder='Email Address'
            type='email'
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ ...register('email') }}
          />
          <TextField
            id='phone-number'
            label='Phone Number (optional)'
            placeholder='Phone Number'
            fullWidth
            InputLabelProps={{ shrink: true }}
            InputProps={{ ...register('phoneNumber') }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Box px={2} mb={2} width='100%'>
          <Button
            variant='outlined'
            color='inherit'
            fullWidth
            size='large'
            sx={{ mb: 1 }}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button variant='contained' fullWidth size='large' onClick={onSubmit}>
            {selectedPerson ? 'Update' : 'Add'}
          </Button>
        </Box>
      </DialogActions>
    </>
  )
}

export type ApplicationFormProps = {
  defaultValues?: JobApplication
  onSubmit: (data: JobApplication) => void
  isLoading: boolean
  redirectTo?: string
}

const ApplicationForm = (props: ApplicationFormProps) => {
  // const isAddMode = !props.defaultValues
  const formOptions = useApplicationFormOptions()
  const [expanded, setExpanded] = React.useState<string | false>('panel1')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedPersonIndex, setSelectedPersonIndex] = React.useState<number>()

  React.useEffect(() => {
    if (props.redirectTo) {
      Router.push(props.redirectTo)
    }
  }, [props.redirectTo])

  const {
    register,
    handleSubmit,
    control,
    watch,
    resetField,
    formState: { errors },
  } = useForm<JobApplication>({
    defaultValues: {
      companyName: '',
      jobTitle: '',
      jobLocationType: 'In-person',
      jobLocation: null,
      jobType: 'Full-time',
      pay: {
        type: 'exact',
        amount1: 0,
        rate: 'year',
      },
      dateApplied: new Date().getTime(),
      jobBoard: '',
      submissionMethod: 'Job Board',
      applicationLink: null,
      applicationStatus: 'Applied',
      interviewDate: null,
      notablePeople: [],
      ...props?.defaultValues,
    },
  })

  const { fields, append, update, remove } = useFieldArray({
    control,
    name: 'notablePeople',
  })

  const amountType = watch('pay.type')
  const applicationStatus = watch('applicationStatus')

  const onSubmit = handleSubmit(data => {
    props.onSubmit(data as JobApplication)
  })

  const handleClickOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false)
  }

  const savePerson = (index?: number) => (person: Person) => {
    // Create
    if (index === undefined) {
      return append(person)
    }

    // Person not found
    if (!fields[index]) {
      return
    }

    // Edit
    update(index, person)
  }

  const editPerson = (index: number) => () => {
    if (fields[index]) {
      setSelectedPersonIndex(index)
      setIsDialogOpen(true)
    }
  }

  const deletePerson = (index: number) => () => {
    remove(index)
  }

  const getAmountLabel = () => {
    if (amountType === 'exact') {
      return 'Exact'
    }

    if (amountType === 'min') {
      return 'Starting at'
    }

    if (amountType === 'max') {
      return 'Maximum'
    }

    return 'Minimum'
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
            <Typography variant='h5'>Basic Information</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box py={3}>
              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid xs={12} sm={6}>
                  <TextField
                    label='Company Name *'
                    placeholder='Company Name'
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ ...register('companyName', { required: true }) }}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Controller
                    name='jobTitle'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CreatableAutocomplete
                        {...field}
                        id='job-title-creatable-autocomplete'
                        options={formOptions.data?.jobTitles}
                        TextFieldProps={{
                          label: 'Job Title *',
                          placeholder: 'Job Title',
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Controller
                    name='jobLocationType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id='job-location-type'
                        select
                        label='Job Location Type'
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      >
                        <MenuItem value='In-person'>In-person</MenuItem>
                        <MenuItem value='Remote'>Remote</MenuItem>
                        <MenuItem value='Hybrid'>Hybrid</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Controller
                    name='jobLocation'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <PlacesAutocomplete
                        placeholder='Job Location'
                        fullWidth
                        TextFieldProps={{
                          label: 'Location',
                          placeholder: 'Location',
                        }}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Controller
                    name='jobType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id='job-type'
                        select
                        label='Job Type'
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      >
                        <MenuItem value='Full-time'>Full-time</MenuItem>
                        <MenuItem value='Part-time'>Part-time</MenuItem>
                        <MenuItem value='Temporary'>Temporary</MenuItem>
                        <MenuItem value='Contract'>Contract</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary aria-controls='panel2-content' id='panel2-header'>
            <Typography variant='h5'>Compensation</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box py={3}>
              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid xs={12}>
                  <Controller
                    name='pay.type'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, ...field } }) => (
                      <TextField
                        {...field}
                        onChange={event => {
                          resetField('pay.amount2', {
                            defaultValue:
                              event.target.value === 'range'
                                ? props.defaultValues?.pay.type === 'range'
                                  ? props.defaultValues.pay.amount2
                                  : 0
                                : undefined,
                          })

                          onChange(event)
                        }}
                        id='select-input-amount-type'
                        select
                        label='Show pay by'
                        InputLabelProps={{ shrink: true }}
                        sx={{ minWidth: 200 }}
                      >
                        <MenuItem value='range'>Range</MenuItem>
                        <MenuItem value='min'>Starting amount</MenuItem>
                        <MenuItem value='max'>Maximum amount</MenuItem>
                        <MenuItem value='exact'>Exact amount</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid container xs={12} alignItems='center'>
                  <Grid xs={12} sm={amountType === 'range' ? true : 6}>
                    <TextField
                      id='text-input-amount1'
                      label={`${getAmountLabel()} *`}
                      placeholder={getAmountLabel()}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        ...register('pay.amount1', {
                          required: true,
                          valueAsNumber: true,
                          pattern: {
                            value: /^(0|[1-9]\d*)(\.\d+)?$/,
                            message: 'Value must be a number!',
                          },
                          validate: n => n > 0,
                        }),
                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  {amountType === 'range' && (
                    <Grid xs={12} sm='auto'>
                      <Typography>to</Typography>
                    </Grid>
                  )}
                  <Grid
                    xs={12}
                    sm={amountType === 'range' ? true : 6}
                    display={amountType === 'range' ? 'initial' : 'none'}
                  >
                    <TextField
                      id='text-input-amount2'
                      label='Maximum *'
                      placeholder='Maximum'
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        ...register('pay.amount2', {
                          valueAsNumber: true,
                          pattern: {
                            value: /^(0|[1-9]\d*)(\.\d+)?$/,
                            message: 'Value must be a number!',
                          },
                          ...(amountType === 'range' && {
                            validate: n => n === undefined || n > 0,
                          }),
                        }),
                        startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid xs={12} sm={amountType === 'range' ? 'auto' : 6}>
                    <Controller
                      name='pay.rate'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id='pay-rate'
                          label='Rate'
                          select
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          sx={{ minWidth: 140 }}
                        >
                          <MenuItem value='hour'>Per Hour</MenuItem>
                          <MenuItem value='week'>Per Week</MenuItem>
                          <MenuItem value='month'>Per Month</MenuItem>
                          <MenuItem value='year'>Per Year</MenuItem>
                        </TextField>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary aria-controls='panel3-content' id='panel3-header'>
            <Typography variant='h5'>Application Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box py={3}>
              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid xs={12} sm={6}>
                  <Controller
                    name='dateApplied'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          {...field}
                          views={['day']}
                          label='Date Applied *'
                          renderInput={params => (
                            <TextField
                              {...params}
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              // InputProps={{
                              //   endAdornment: (
                              //     <InputAdornment position='end'>
                              //       <DatePickerIcon />
                              //     </InputAdornment>
                              //   ),
                              // }}
                              helperText={null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Controller
                    name='jobBoard'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CreatableAutocomplete
                        {...field}
                        id='job-board-creatable-autocomplete'
                        options={formOptions.data?.jobBoards}
                        TextFieldProps={{
                          label: 'Job Board *',
                          placeholder: 'Job Board',
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Controller
                    name='submissionMethod'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id='submission-method-input'
                        label='Submission Method'
                        select
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      >
                        <MenuItem value='Job Board'>Job Board</MenuItem>
                        <MenuItem value='Agency'>Agency</MenuItem>
                        <MenuItem value='Company Website'>Company Website</MenuItem>
                        <MenuItem value='Email'>Email</MenuItem>
                        <MenuItem value='In-person'>In-person</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    id='application-link-input'
                    label='Application Link'
                    placeholder='Application Link'
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ ...register('applicationLink') }}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Controller
                    name='applicationStatus'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id='application-status-input'
                        label='Application Status'
                        select
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      >
                        <MenuItem value='Applied'>Applied</MenuItem>
                        <MenuItem value='Interview'>Interview</MenuItem>
                        <MenuItem value='Interviewed'>Interviewed</MenuItem>
                        <MenuItem value='Rejected'>Rejected</MenuItem>
                        <MenuItem value='Offer'>Offer</MenuItem>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <Controller
                    name='interviewDate'
                    control={control}
                    rules={{ required: applicationStatus === 'Interview' }}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          {...field}
                          onChange={value => {
                            field.onChange(value ? new Date(value).getTime() : null)
                          }}
                          disabled={applicationStatus !== 'Interview'}
                          views={['day', 'hours', 'minutes']}
                          label='Interview Date and Time'
                          disablePast
                          renderInput={params => (
                            <TextField
                              {...params}
                              required
                              id='interview-date-input'
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              helperText={null}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
          <AccordionSummary aria-controls='panel4-content' id='panel4-header'>
            <Typography variant='h5'>Notable People</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pt={3} pb={1}>
              <Grid container rowSpacing={3} columnSpacing={2} mb={1}>
                {fields.map((person, index) => (
                  <Grid key={person.id} xs={12} sm={6}>
                    <NotablePerson
                      position={person.position}
                      name={person.name}
                      email={person.email}
                      phoneNumber={person.phoneNumber}
                      action={
                        <div>
                          <IconButton size='small' color='inherit' onClick={editPerson(index)}>
                            <EditIcon fontSize='small' />
                          </IconButton>
                          <IconButton size='small' color='inherit' onClick={deletePerson(index)}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </div>
                      }
                    />
                  </Grid>
                ))}
              </Grid>
              <Button
                variant='text'
                fullWidth
                startIcon={<AddIcon />}
                sx={{ textTransform: 'none' }}
                onClick={handleClickOpenDialog}
              >
                Add Person
              </Button>
              <Dialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                PaperProps={{ sx: { maxWidth: 380 } }}
                TransitionProps={{
                  onExited: () => {
                    setSelectedPersonIndex(undefined)
                  },
                }}
              >
                <PersonForm
                  handleClose={handleCloseDialog}
                  positions={formOptions.data?.peoplePositions}
                  savePerson={savePerson(selectedPersonIndex)}
                  {...(selectedPersonIndex !== undefined && {
                    selectedPerson: fields[selectedPersonIndex],
                  })}
                />
              </Dialog>
            </Box>
          </AccordionDetails>
        </Accordion>
      </div>
      <Box mt={5} display='flex' justifyContent='flex-end'>
        <Button
          component={Link}
          href='/applications'
          noLinkStyle
          variant='outlined'
          color='inherit'
          size='large'
          sx={{ mr: 2 }}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={props.isLoading} variant='contained' size='large'>
          {props.isLoading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </form>
  )
}

export default ApplicationForm
