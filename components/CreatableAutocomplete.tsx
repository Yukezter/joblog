import React from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Autocomplete, { createFilterOptions, AutocompleteProps } from '@mui/material/Autocomplete'

type OptionType = {
  inputValue?: string
  value: string
}

const filter = createFilterOptions<OptionType>()

type CustomAutocompleteProps = AutocompleteProps<OptionType, false, false, true>

type CreatableAutocompleteProps = Omit<CustomAutocompleteProps, 'renderInput'> & {
  onChange?: (newValue: string) => void
  renderInput?: CustomAutocompleteProps['renderInput']
  TextFieldProps: TextFieldProps
}

// eslint-disable-next-line react/display-name
const CreatableAutocomplete = React.forwardRef(
  ({ onChange = () => {}, TextFieldProps, ...props }: CreatableAutocompleteProps, ref) => {
    return (
      <Autocomplete
        ref={ref}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            onChange(newValue)
          } else if (newValue && newValue.inputValue) {
            // Create a new value from the user input
            onChange(newValue.inputValue)
          } else {
            onChange(newValue?.value || '')
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params)

          const { inputValue } = params
          // Suggest the creation of a new value
          const isExisting = options.some(option => inputValue === option.value)
          if (inputValue !== '' && !isExisting) {
            filtered.push({
              inputValue,
              value: `Add "${inputValue}"`,
            })
          }

          return filtered
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        getOptionLabel={option => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue
          }
          // Regular option
          return option.value
        }}
        renderOption={(props, option) => <li {...props}>{option.value}</li>}
        fullWidth
        freeSolo
        renderInput={params => (
          <TextField {...params} InputLabelProps={{ shrink: true }} {...TextFieldProps} />
        )}
        {...props}
      />
    )
  }
)

export default CreatableAutocomplete
