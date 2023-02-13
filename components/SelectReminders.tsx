import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { INTERVIEW_REMINDER_TIMES } from '../utils/constants';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type Minutes = keyof typeof INTERVIEW_REMINDER_TIMES

type SelectCheckboxProps = {
  disabled?: boolean
  defaultValue?: number[]
  onChange?: (minutes: number[]) => void
}

const SelectReminders = ({ defaultValue = [], onChange = () => {}, disabled = false }: SelectCheckboxProps) => {
  const [reminders, setReminders] = React.useState<string[]>(defaultValue.map(String));

  const handleChange = (event: SelectChangeEvent<typeof reminders>) => {
    const {
      target: { value },
    } = event
    // On autofill we get a stringified value.
    const newReminders = typeof value === 'string' ? value.split(',') : value
    setReminders(newReminders)
    onChange(newReminders.map(Number).sort((a, b) => a - b))
  };

  return (
    <div>
      <FormControl sx={{ width: '100%' }}>
        <InputLabel id="demo-multiple-checkbox-label" shrink>Interview Reminders</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={reminders}
          onChange={handleChange}
          input={<OutlinedInput label="Interview Reminders" notched />}
          displayEmpty
          disabled={disabled}
          renderValue={selected => {
            return 'Interview Reminders'
            // if (!selected.length) {
            //   return 'Interview Reminders'
            // }

            // return selected.map(Number).sort((a, b) => a - b).map(minutes => {
            //   const label = INTERVIEW_REMINDER_TIMES[minutes as Minutes]
            //   return `${label} Before Interview`
            // }).join(', ')
          }}
          MenuProps={MenuProps}
        >
          {Object.entries(INTERVIEW_REMINDER_TIMES).map(([minutes, label]) => (
            <MenuItem key={minutes} value={minutes}>
              <Checkbox checked={reminders.indexOf(minutes) > -1} />
              <ListItemText primary={`${label} Before Interview`} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default SelectReminders