import { createTask as createTaskApi } from '../../api'
import type { EntityId, Task } from '../../types'

export interface AddTaskInput {
  title: string
  completed?: boolean
  userId?: EntityId | null
}

// Erstellt eine neue Aufgabe und übersetzt die Formulardaten in das API-Format.
export async function addTask({ title, completed = false, userId }: AddTaskInput): Promise<Task> {
  return createTaskApi({ title, completed, userId })
}
