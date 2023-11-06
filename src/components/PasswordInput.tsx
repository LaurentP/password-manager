import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material'
import {
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
} from '@mui/material'
import { useId, useState } from 'react'

const PasswordInput = ({
  fullWidth,
  label,
  name,
  value,
  onChange,
  error,
  helperText,
}: {
  fullWidth: boolean
  label: string
  name: string
  value: string | null
  onChange: React.ChangeEventHandler<HTMLInputElement> | null
  error: boolean
  helperText: string
}): JSX.Element => {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const id = useId()

  let inputProps: object = { maxLength: 100 }

  if (value !== null) {
    inputProps = { ...inputProps, value }
  }

  if (onChange !== null) {
    inputProps = { ...inputProps, onChange }
  }

  const handleClick = (): void => {
    setShowPassword((show) => !show)
  }

  return (
    <FormControl
      variant="filled"
      fullWidth={fullWidth || false}
      size="small"
      error={error}
    >
      <InputLabel htmlFor={id}>{label}</InputLabel>

      <FilledInput
        id={id}
        type={showPassword ? 'text' : 'password'}
        name={name}
        inputProps={inputProps}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={handleClick} edge="end">
              {showPassword ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </IconButton>
          </InputAdornment>
        }
        sx={{
          '& ::-ms-reveal': {
            display: 'none',
          },
        }}
      />
      {/* This condition disables margin from hyperText if it does not contain text */}
      {helperText !== '' ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  )
}

export default PasswordInput
