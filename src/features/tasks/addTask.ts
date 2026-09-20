import { createTask as createTaskApi } from '../../api'
import type { Task } from '../../types'

export interface AddTaskInput {
  title: string
  completed?: boolean
}

export async function addTask({ title, completed = false }: AddTaskInput): Promise<Task> {
  return createTaskApi({ title, completed })
}
