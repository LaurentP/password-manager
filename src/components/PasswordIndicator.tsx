import {
  GppBad as GppBadIcon,
  GppGood as GppGoodIcon,
  GppMaybe as GppMaybeIcon,
} from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import useId from '@mui/material/utils/useId'
import { useEffect, useState } from 'react'
import getPasswordStrength from '../services/get-password-strength'

type Params = { icon: JSX.Element; color: string; text: string }

const PasswordIndicator = ({ password }: { password: string }): JSX.Element => {
  const [params, setParams] = useState<Params>({
    icon: <></>,
    color: '#fff',
    text: '',
  })

  // Needed to avoid conflicts when the Password Generator dialog box is opened while editing accounts
  const passwordMeterId = useId() ?? 'passwordMeter'

  useEffect(() => {
    if (password === undefined || password.length === 0) {
      setParams({ icon: <></>, color: '', text: '' })
      return
    }

    const colors = ['#f44336', '#f44336', '#ff9800', '#4caf50', '#4caf50']

    const strength = getPasswordStrength(password)

    switch (strength) {
      case 4:
        setParams({
          icon: <GppGoodIcon />,
          color: colors[strength],
          text: 'Very strong password',
        })
        break
      case 3:
        setParams({
          icon: <GppGoodIcon />,
          color: colors[strength],
          text: 'Strong password',
        })
        break
      case 2:
        setParams({
          icon: <GppMaybeIcon />,
          color: colors[strength],
          text: 'Middling password',
        })
        break
      default:
        setParams({
          icon: <GppBadIcon />,
          color: colors[strength],
          text: 'Weak password',
        })
    }

    const passwordMeterElements = document.querySelectorAll(
      `#${passwordMeterId.replace(/:/g, '\\:')} > div`,
    )

    for (let i = 0; i < passwordMeterElements.length; i++) {
      let element = passwordMeterElements[i]

      element.removeAttribute('style')

      if (i <= strength) {
        if (i === strength && strength > 0) {
          element = passwordMeterElements[i - 1]
        }

        element.setAttribute('style', 'background-color:' + colors[strength])
      }
    }
  }, [password])

  return password.length !== 0 ? (
    <>
      <Stack
        id={passwordMeterId}
        direction="row"
        spacing={1}
        width="100%"
        my={2}
        sx={{
          '& > div': {
            height: '4px',
            width: 'calc(100% / 4)',
            backgroundColor: '#e0e0e0',
            transition: '200ms',
          },
        }}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </Stack>
      <Typography
        variant="subtitle2"
        component={Stack}
        direction="row"
        alignItems="center"
        color={params.color}
      >
        {params.icon} {params.text}
      </Typography>
    </>
  ) : (
    <></>
  )
}

export default PasswordIndicator
