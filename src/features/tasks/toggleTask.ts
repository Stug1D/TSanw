import { toggleTask as toggleTaskApi } from '../../api'
import type { EntityId, Task } from '../../types'

export async function toggleTaskRecord(taskId: EntityId, completed: boolean): Promise<Task> {
  return toggleTaskApi(taskId, completed)
}
