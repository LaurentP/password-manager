import {
  BaseDirectory,
  exists,
  removeFile,
  writeTextFile,
} from '@tauri-apps/api/fs'

const saveUsers = async (users: object): Promise<void> => {
  const fileName = 'data/users.json'
  const options = { dir: BaseDirectory.AppData }

  if (await exists(fileName, options)) {
    await removeFile(fileName, options)
  }

  await writeTextFile(fileName, JSON.stringify(users), options)
}

export default saveUsers
