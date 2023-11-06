import {
  FormatListBulleted as FormatListBulletedIcon,
  Logout as LogoutIcon,
  NoteAdd as NoteAddIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { Tab, Tabs } from '@mui/material'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import type { SessionDataContextType } from '../typings/SessionData'

const Navigation = (): JSX.Element => {
  const [sessionData, setSessionData] =
    useTypedContext<SessionDataContextType>(SessionContext)

  const location = useLocation()

  let prevIndex = 0

  if (location.state !== null && location.state.prevIndex !== undefined) {
    prevIndex = location.state.prevIndex
  }

  const [value, setValue] = useState<number>(prevIndex)

  const navigate = useNavigate()

  const tabsIndex: Record<string, number> = {
    '/': 0,
    '/newaccount': 1,
    '/settings': 2,
  }

  useEffect(() => {
    switch (window.location.pathname) {
      case '/':
        setValue(0)
        break
      case '/newaccount':
        setValue(1)
        break
      case '/settings':
        setValue(2)
    }
  }, [])

  const handleNavigate = (path: string): void => {
    navigate(path, {
      state: { prevIndex: tabsIndex[window.location.pathname] },
    })
  }

  const handleLogout = (): void => {
    setSessionData({ ...sessionData, isAuth: false })
  }

  return (
    <Tabs value={value} orientation="vertical" textColor="inherit">
      <Tab
        value={0}
        icon={<FormatListBulletedIcon />}
        label="Accounts"
        onClick={() => {
          handleNavigate('/')
        }}
      />
      <Tab
        value={1}
        icon={<NoteAddIcon />}
        label="New"
        onClick={() => {
          handleNavigate('/newaccount')
        }}
      />

      <Tab
        value={2}
        icon={<SettingsIcon />}
        label="Settings"
        onClick={() => {
          handleNavigate('/settings')
        }}
      />
      <Tab
        value={3}
        icon={<LogoutIcon />}
        label="Logout"
        onClick={handleLogout}
      />
    </Tabs>
  )
}

export default Navigation
