import { deleteTask as deleteTaskApi } from '../../api'
import type { EntityId } from '../../types'

export async function deleteTaskRecord(taskId: EntityId): Promise<void> {
  await deleteTaskApi(taskId)
}
