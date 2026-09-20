import type { User } from '../../types'
import { fetchUsers } from '../../api'

// Lädt alle Benutzer aus dem Backend, damit die App den aktuellen Stand anzeigen kann.
export async function loadUsers(): Promise<User[]> {
  return fetchUsers()
}
