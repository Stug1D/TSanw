import type { EntityId } from '../../types'
import { deleteUser as deleteUserApi } from '../../api'

// Entfernt einen Benutzer über die API und verwendet dabei die ID als eindeutigen Schlüssel.
export async function deleteUserRecord(userId: EntityId): Promise<void> {
  await deleteUserApi(userId)
}
