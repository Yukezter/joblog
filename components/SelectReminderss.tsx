import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
// import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'

import { INTERVIEW_REMINDER_TIMES } from '../utils/constants'

type Minute = keyof typeof INTERVIEW_REMINDER_TIMES

type SelectRemindersProps = {
  defaultValue?: Minute[]
}

const SelectReminders = ({ defaultValue = [] }: SelectRemindersProps) => {
  // const form = useForm()
  const [value, setValue] = React.useState<string>('')
  
  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string)
  }

  const [selectedReminders, setSelectedReminders] = React.useState(defaultValue)

  const handleAdd = () => {
    if (value in INTERVIEW_REMINDER_TIMES) {
      const minutes = parseInt(value) as Minute
      if (!selectedReminders.includes(minutes)) {
        setValue('')
        setSelectedReminders(prevSelectedReminders => {
          return [...prevSelectedReminders, minutes].sort((a, b) => a - b)
        })
      }
    }
  }

  const handleRemove = (index: number) => () => {
    setSelectedReminders(prevSelectedReminders => {
      return prevSelectedReminders.filter((_, i) => index !== i)
    })
  }

  return (
    <>
      <Box display='flex'>
      <FormControl fullWidth>
        <InputLabel id="reminder-times-label">Reminders</InputLabel>
        <Select
          labelId="reminder-times-label"
          id="reminder-times"
          value={value}
          label="Reminder"
          onChange={handleChange}
        >
          {Object.entries(INTERVIEW_REMINDER_TIMES)
              .filter(([minutes]) => !selectedReminders.includes(parseInt(minutes) as Minute))
              .map(([minutes, label]) => (
            <MenuItem value={minutes}>{label} Before Interview</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button onClick={handleAdd}>Add</Button>
      </Box>
      <List>
        {selectedReminders.map((minutes, index) => (
          <ListItem
          secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={handleRemove(index)}>
              <DeleteIcon />
            </IconButton>
          }
          >
            {INTERVIEW_REMINDER_TIMES[minutes]} Before Interview
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default SelectReminders