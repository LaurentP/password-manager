const getPasswordStrength = (password: string): number => {
  let strength = 0

  if (password.length >= 8) {
    strength++
  }

  if (password.length >= 12) {
    strength++
  }

  if (password.length >= 16) {
    strength++
  }

  if (/[a-z]/.test(password)) {
    strength++
  }

  if (/[A-Z]/.test(password)) {
    strength++
  }

  if (/[0-9]/.test(password)) {
    strength++
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    strength++
  }

  if (password.length < 8 && strength > 2) {
    strength = 2
  }

  if (password.length < 6 && strength > 1) {
    strength = 1
  }

  if (strength > 4) {
    strength = 4
  }

  return strength
}

export default getPasswordStrength
