import { exists, removeFile, writeTextFile } from '@tauri-apps/api/fs'
import getDataDirectory from './get-data-directory'

const saveUsers = async (users: object): Promise<void> => {
  const fileName = 'data/users.json'
  const options = { dir: getDataDirectory() }

  if (await exists(fileName, options)) {
    await removeFile(fileName, options)
  }

  await writeTextFile(fileName, JSON.stringify(users), options)
}

export default saveUsers
