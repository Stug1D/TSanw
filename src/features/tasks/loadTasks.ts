import { fetchTasks as fetchTasksApi } from '../../api'
import type { Task } from '../../types'

// Lädt alle Aufgaben aus dem Backend, damit die UI den aktuellen Aufgabenstand anzeigen kann.
export async function loadTasks(): Promise<Task[]> {
  return fetchTasksApi()
}
