const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(salt + password),
  )
  let hash = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

  hash = salt + hash

  return hash
}

export default hashPassword
