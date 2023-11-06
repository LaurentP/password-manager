import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SessionContext } from '../contexts/SessionContext'
import useTypedContext from '../hooks/useTypedContext'
import Accounts from '../pages/Accounts'
import Auth from '../pages/Auth'
import NewAccount from '../pages/NewAccount'
import Register from '../pages/Register'
import Settings from '../pages/Settings'
import type { SessionDataContextType } from '../typings/SessionData'
import ProtectedRoute from './ProtectedRoute'

const Router = (): JSX.Element => {
  const [sessionData] = useTypedContext<SessionDataContextType>(SessionContext)

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isAuth={sessionData.isAuth}>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newaccount"
          element={
            <ProtectedRoute isAuth={sessionData.isAuth}>
              <NewAccount />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuth={sessionData.isAuth}>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default Router
