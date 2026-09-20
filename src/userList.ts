import type { EntityId, User } from './types'

// Optionen für das Rendern der Benutzerliste.
interface RenderUsersOptions {
  userList: HTMLUListElement
  users: User[]
  query: string
  onDelete: (userId: EntityId) => void
  onEdit: (user: User) => void
}

// Filtert Nutzer nach Suchbegriff und rendert die Karten inklusive Bearbeiten- und Löschen-Buttons.
export function renderUsers({
  userList,
  users,
  query,
  onDelete,
  onEdit,
}: RenderUsersOptions): void {
  const normalizedQuery = query.trim().toLowerCase()
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(normalizedQuery),
  )

  userList.innerHTML = filteredUsers.length
    ? filteredUsers
        .map(
          (user) => `
            <li class="user-card">
              <div class="user-content">
                <h2>${user.name}</h2>
                <p><strong>E-Mail:</strong> ${user.email}</p>
                <p><strong>Firma:</strong> ${user.company.name}</p>
              </div>
              <div class="user-card-actions">
                <button class="edit-btn" type="button" data-user-id="${user.id}">Bearbeiten</button>
                <button class="delete-btn" type="button" data-user-id="${user.id}">Löschen</button>
              </div>
            </li>
          `,
        )
        .join('')
    : '<li class="empty">Keine Benutzer gefunden.</li>'

  userList.querySelectorAll<HTMLButtonElement>('.delete-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = button.dataset.userId

      if (userId === undefined) {
        return
      }

      onDelete(userId)
    })
  })

  userList.querySelectorAll<HTMLButtonElement>('.edit-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = button.dataset.userId
      const user = users.find((entry) => String(entry.id) === String(userId))

      if (!user) {
        return
      }

      onEdit(user)
    })
  })
}
