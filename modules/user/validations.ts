export function validationRegister(username: any, email: any, password: any) {
  if (typeof username !== 'string') throw new Error('username must be a string')
  if (typeof password !== 'string') throw new Error('password must be a string')
  if (typeof email !== 'string') throw new Error('email must be a string')
}
export function validationLogin(email: any, password: any) {
  if (typeof password !== 'string') throw new Error('password must be a string')
  if (typeof email !== 'string') throw new Error('email must be a string')
}
