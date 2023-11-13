import { exists, removeFile, writeBinaryFile } from '@tauri-apps/api/fs'
import type { AccountData } from '../typings/AccountData'
import getDataDirectory from './get-data-directory'

const aesEncrypt = async (
  iv: Uint8Array,
  key: CryptoKey,
  plaintext: string,
): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder()

  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encoder.encode(plaintext),
  )

  return ciphertext
}

const saveData = async (
  database: AccountData[],
  id: string,
  aesKey: CryptoKey,
): Promise<void> => {
  const iv = crypto.getRandomValues(new Uint8Array(16))

  const ciphertext = await aesEncrypt(iv, aesKey, JSON.stringify(database))

  const data = new Uint8Array([...iv, ...new Uint8Array(ciphertext)])

  const fileName = `data/data-${id}.bin`
  const options = { dir: getDataDirectory() }

  if (await exists(fileName, options)) {
    await removeFile(fileName, options)
  }

  await writeBinaryFile(fileName, data, options)
}

export default saveData
