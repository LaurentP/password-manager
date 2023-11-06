export type AccountFormError = {
  name: {
    status: boolean
    message: string
  }
  username: {
    status: boolean
    message: string
  }
  password: {
    status: boolean
    message: string
  }
}
