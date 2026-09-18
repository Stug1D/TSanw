import type { EntityId, User } from './types'

// Optionen für das Rendern der Benutzerliste.
interface RenderUsersOptions {
  userList: HTMLUListElement
  users: User[]
  query: string
  onDelete: (userId: EntityId) => void
}

// Filtert Nutzer nach Suchbegriff und rendert die Karten inklusive Löschen-Button.
export function renderUsers({
  userList,
  users,
  query,
  onDelete,
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
              <button class="delete-btn" type="button" data-user-id="${user.id}">Löschen</button>
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
}
