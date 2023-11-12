import { BaseDirectory, exists, readTextFile } from '@tauri-apps/api/fs'
import type { UserData } from '../typings/UserData'

const getUsers = async (): Promise<UserData[]> => {
  const fileName = 'data/users.json'
  const options = { dir: BaseDirectory.AppData }

  if (await exists(fileName, options)) {
    return JSON.parse(await readTextFile(fileName, options))
  }
  return []
}

export default getUsers
