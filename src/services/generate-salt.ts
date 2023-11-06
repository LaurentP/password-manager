const generateSalt = (): string => {
  const saltArray = crypto.getRandomValues(new Uint8Array(16))
  const salt = Array.from(saltArray)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return salt
}

export default generateSalt
