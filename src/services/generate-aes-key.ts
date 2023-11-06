const getKeyMaterial = async (password: string): Promise<CryptoKey> => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  )

  return key
}

const generateAesKey = async (
  password: string,
  salt: string,
): Promise<CryptoKey> => {
  const keyMaterial = await getKeyMaterial(password)
  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt'],
  )

  return key
}

export default generateAesKey
