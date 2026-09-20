import { toggleTask as toggleTaskApi } from '../../api'
import type { EntityId, Task } from '../../types'

// ändert den Erledigt-Status einer Aufgabe und liefert das aktualisierte Objekt zurück.
export async function toggleTaskRecord(taskId: EntityId, completed: boolean): Promise<Task> {
  return toggleTaskApi(taskId, completed)
}
