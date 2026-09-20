// Typ für IDs, da JSON Server manchmal Zahlen und manchmal Strings liefert.
export type EntityId = string | number

export interface Company {
  name: string
}

// Struktur eines Benutzers aus der API.
export interface User {
  id: EntityId
  name: string
  email: string
  company: Company
}

// Struktur einer Aufgabe aus der API.
export interface Task {
  id: EntityId
  title: string
  completed: boolean
  userId?: EntityId | null
}

export interface CreateTaskInput {
  title: string
  completed: boolean
  userId?: EntityId | null
}
