import React from 'react'
import Script from 'next/script'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import throttle from 'lodash.throttle'
import parse from 'autosuggest-highlight/parse'
import { Place } from '../types'

// const { GOOGLE_MAPS_API_KEY } = process.env

const GOOGLE_MAPS_API_KEY = 'AIzaSyAs9qdCdCJHxcsO187eV1gOgynjs19JJsY'

type BaseAutocomplete = Omit<
  AutocompleteProps<Place, false, false, false>,
  'renderInput' | 'options' | 'value' | 'inputValue' | 'onChange' | 'onInputChange'
>

type PlacesAutocompleteProps = BaseAutocomplete & {
  value: Place | null
  onChange: (newValue: Place | null) => void
  TextFieldProps?: TextFieldProps
}

const autocompleteService: { current: google.maps.places.AutocompleteService | null } = {
  current: null,
}

// eslint-disable-next-line react/display-name
const PlacesAutocomplete = React.forwardRef<HTMLDivElement, PlacesAutocompleteProps>(
  ({ value, onChange, onBlur, TextFieldProps = {}, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState('')
    const [options, setOptions] = React.useState<Place[]>([])

    const fetch = React.useMemo<
      (
        request: { input: string },
        callback: (results: google.maps.places.AutocompletePrediction[] | null) => void
      ) => void
    >(
      () =>
        throttle(
          (
            request: { input: string },
            callback: (results: google.maps.places.AutocompletePrediction[] | null) => void
          ) => {
            autocompleteService.current?.getPlacePredictions(request, callback)
          },
          200
        ),
      []
    )

    React.useEffect(() => {
      let active = true

      if (!autocompleteService.current && window.google) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
      }

      if (!autocompleteService.current) {
        return undefined
      }

      if (inputValue === '') {
        setOptions(value ? [value] : [])
        return undefined
      }

      fetch({ input: inputValue }, results => {
        if (active) {
          let newOptions: Place[] = []

          if (value) {
            newOptions = [value]
          }

          if (results) {
            const places = results.map(({ place_id, description, structured_formatting }) => ({
              place_id,
              description,
              structured_formatting,
            }))
            newOptions = [...newOptions, ...places]
          }

          setOptions(newOptions)
        }
      })

      return () => {
        active = false
      }
    }, [inputValue, value, fetch])

    return (
      <>
        <Autocomplete
          getOptionLabel={option => (typeof option === 'string' ? option : option.description)}
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue)
          }}
          value={value}
          isOptionEqualToValue={(option, value) => option.place_id === value.place_id}
          onChange={(event, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options)
            onChange(newValue)
          }}
          onBlur={onBlur}
          filterOptions={x => x}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderInput={params => (
            <TextField
              {...params}
              InputLabelProps={{ shrink: true }}
              {...TextFieldProps}
              ref={ref}
            />
          )}
          renderOption={(props, option) => {
            const matches = option.structured_formatting.main_text_matched_substrings
            const parts = parse(
              option.structured_formatting.main_text,
              matches.map(match => [match.offset, match.offset + match.length])
            )

            return (
              <li {...props}>
                <Grid container alignItems='center'>
                  <Grid>
                    <Box component={LocationOnIcon} sx={{ color: 'text.secondary', mr: 2 }} />
                  </Grid>
                  <Grid xs>
                    {parts.map((part, index) => (
                      <span
                        key={index}
                        style={{
                          fontWeight: part.highlight ? 700 : 400,
                        }}
                      >
                        {part.text}
                      </span>
                    ))}
                    <Typography variant='body2' color='text.secondary'>
                      {option.structured_formatting.secondary_text}
                    </Typography>
                  </Grid>
                </Grid>
              </li>
            )
          }}
          {...props}
        />
        <Script
          key='google-places'
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
        />
      </>
    )
  }
)

export default PlacesAutocomplete
