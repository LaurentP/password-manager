import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({
  isAuth,
  children,
}: {
  isAuth: boolean
  children: JSX.Element
}): JSX.Element => {
  if (!isAuth) return <Navigate to="/auth" replace />

  return children
}

export default ProtectedRoute
