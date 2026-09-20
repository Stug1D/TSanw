import type { Task, User } from './types'

// Zentraler App-State für Benutzer und Aufgaben, damit verschiedene Bereiche dieselben Daten teilen.
export const appState = {
  users: [] as User[],
  tasks: [] as Task[],
}

// Speichert die aktuelle Benutzerliste im globalen State, damit alle Views denselben Stand nutzen.
export function setUsers(users: User[]): void {
  appState.users = users
}

// Speichert die aktuelle Aufgabenliste im globalen State, damit Filter und Listen synchron bleiben.
export function setTasks(tasks: Task[]): void {
  appState.tasks = tasks
}
