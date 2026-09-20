import type { EntityId, User } from '../../types'
import { updateUser as updateUserApi } from '../../api'

export interface UpdateUserInput {
  name: string
  email: string
  companyName: string
}

export async function updateUserRecord(
  userId: EntityId,
  { name, email, companyName }: UpdateUserInput,
): Promise<User> {
  return updateUserApi(userId, {
    name,
    email,
    company: { name: companyName },
  })
}
