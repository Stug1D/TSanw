import type { EntityId } from '../../types'
import { deleteUser as deleteUserApi } from '../../api'

export async function deleteUserRecord(userId: EntityId): Promise<void> {
  await deleteUserApi(userId)
}
