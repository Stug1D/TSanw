import type { EntityId, Task, User } from './types'

// Basis-URL für den lokalen JSON Server.
const API_BASE_URL = 'http://localhost:3000'

// Lädt alle Benutzer aus der DB und wirft bei Fehlern einen Fehler.
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`)

  if (!response.ok) {
    throw new Error(`Fehler beim Laden: ${response.status}`)
  }

  const data: unknown = await response.json()

  return data as User[]
}

// Input-Typ für das Anlegen eines neuen Benutzers.
export interface CreateUserInput {
  name: string
  email: string
  company: {
    name: string
  }
}

// Sendet einen neuen Benutzer per POST an den Server.
export async function createUser(user: CreateUserInput): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error(`Fehler beim Speichern: ${response.status}`)
  }

  const data: unknown = await response.json()

  return data as User
}

// Löscht einen Benutzer anhand seiner ID.
export async function deleteUser(userId: EntityId): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Fehler beim Löschen: ${response.status}`)
  }
}

// Lädt alle Aufgaben aus der DB.
export async function fetchTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks`)

  if (!response.ok) {
    throw new Error(`Fehler beim Laden der Aufgaben: ${response.status}`)
  }

  const data: unknown = await response.json()

  return data as Task[]
}

// Input-Typ für das Anlegen einer neuen Aufgabe.
export interface CreateTaskInput {
  title: string
  completed: boolean
}

// Sendet eine neue Aufgabe an den Server.
export async function createTask(task: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    throw new Error(`Fehler beim Speichern der Aufgabe: ${response.status}`)
  }

  const data: unknown = await response.json()

  return data as Task
}

// Aktualisiert nur den Status einer Aufgabe (erledigt / nicht erledigt).
export async function toggleTask(taskId: EntityId, completed: boolean): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  })

  if (!response.ok) {
    throw new Error(`Fehler beim Aktualisieren: ${response.status}`)
  }

  const data: unknown = await response.json()

  return data as Task
}

// Entfernt eine Aufgabe aus der DB.
export async function deleteTask(taskId: EntityId): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Fehler beim Löschen der Aufgabe: ${response.status}`)
  }
}
