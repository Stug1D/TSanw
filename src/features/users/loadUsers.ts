import type { User } from '../../types'
import { fetchUsers } from '../../api'

export async function loadUsers(): Promise<User[]> {
  return fetchUsers()
}
