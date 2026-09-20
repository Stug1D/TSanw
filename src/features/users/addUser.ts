import type { User } from '../../types'
import { createUser } from '../../api'

export interface AddUserInput {
  name: string
  email: string
  companyName: string
}

export async function addUser({ name, email, companyName }: AddUserInput): Promise<User> {
  return createUser({
    name,
    email,
    company: { name: companyName },
  })
}
