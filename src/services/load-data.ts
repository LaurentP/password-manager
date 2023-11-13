import { exists, readBinaryFile } from '@tauri-apps/api/fs'
import type { AccountData } from '../typings/AccountData'
import getDataDirectory from './get-data-directory'

const aesDecrypt = async (
  iv: Uint8Array,
  key: CryptoKey,
  ciphertext: ArrayBuffer,
): Promise<string> => {
  const decoder = new TextDecoder()

  const plaintext = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    ciphertext,
  )

  return decoder.decode(plaintext)
}

const loadData = async (
  id: string,
  aesKey: CryptoKey,
): Promise<AccountData[]> => {
  const fileName = `data/data-${id}.bin`

  try {
    const options = { dir: getDataDirectory() }

    if (await exists(fileName, options)) {
      const read = await readBinaryFile(fileName, options)

      const ivLength = 16

      const iv = read.slice(0, ivLength)
      const ciphertext = read.slice(ivLength)

      const data = await aesDecrypt(iv, aesKey, ciphertext.buffer)

      return JSON.parse(data)
    }
  } catch (error) {
    console.error(error)
  }

  return []
}

export default loadData
