import { useContext } from 'react'

const useTypedContext = <T>(context: React.Context<T | null>): T => {
  const contextData = useContext(context)

  if (contextData === null) {
    throw new Error('Context not provided.')
  }

  return contextData
}

export default useTypedContext
