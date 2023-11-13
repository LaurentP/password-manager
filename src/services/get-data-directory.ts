import { BaseDirectory } from '@tauri-apps/api/fs'

const getDataDirectory = (): BaseDirectory => {
  const mode = import.meta.env.VITE_MODE

  if (mode === 'dev') {
    return BaseDirectory.Resource
  } else if (mode === 'prod') {
    return BaseDirectory.AppData
  } else {
    throw new Error('VITE_MODE expects "dev" or "prod" in the .env file.')
  }
}

export default getDataDirectory
