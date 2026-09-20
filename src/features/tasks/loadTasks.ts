import { fetchTasks as fetchTasksApi } from '../../api'
import type { Task } from '../../types'

export async function loadTasks(): Promise<Task[]> {
  return fetchTasksApi()
}
