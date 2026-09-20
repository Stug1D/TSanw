import { deleteTask as deleteTaskApi } from '../../api'
import type { EntityId } from '../../types'

// Löscht eine Aufgabe über die API anhand ihrer eindeutigen ID.
export async function deleteTaskRecord(taskId: EntityId): Promise<void> {
  await deleteTaskApi(taskId)
}
