import type { EntityId, Task, User } from './types'

// Basis-URL für den lokalen JSON Server.
const API_BASE_URL = 'http://localhost:3000'

// Lädt alle Benutzer aus der JSON-Server-Datenbank und gibt sie als Array zurück.
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

// Erstellt einen neuen Benutzer auf dem Backend und liefert den gespeicherten Datensatz zurück.
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

// Entfernt einen Benutzer per ID aus der Datenbank.
export async function deleteUser(userId: EntityId): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Fehler beim Löschen: ${response.status}`)
  }
}

// Holt alle Aufgaben aus der JSON-Server-Datenbank und liefert sie als Liste zurück.
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
  userId?: EntityId | null
}

// Legt eine neue Aufgabe im Backend an und gibt die gespeicherte Aufgabe zurück.
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

// Aktualisiert den Erledigt-Status einer Aufgabe im Backend und liefert das geänderte Objekt zurück.
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

// Löscht eine Aufgabe anhand ihrer ID aus der Datenbank.
export async function deleteTask(taskId: EntityId): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Fehler beim Löschen der Aufgabe: ${response.status}`)
  }
}

// Aktualisiert einen vorhandenen Benutzer mit neuen Daten und liefert den neuen Stand zurück.
export async function updateUser(userId: EntityId, updatedUser: Partial<CreateUserInput>): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  })

  if (!response.ok) {
    throw new Error(`Fehler beim Aktualisieren des Benutzers: ${response.status}`)
  }

  const data: unknown = await response.json()

  return data as User
}
