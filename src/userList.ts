import type { EntityId, Task, User } from './types'

// Optionen für das Rendern der Benutzerliste.
interface RenderUsersOptions {
  userList: HTMLUListElement
  users: User[]
  tasks: Task[]
  query: string
  onDelete: (userId: EntityId) => void
  onEdit: (user: User) => void
}

// Filtert Benutzer nach der aktuellen Suche und rendert deren Karten mit Aktionen und aufklappbarer Aufgabenliste.
export function renderUsers({
  userList,
  users,
  tasks,
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
        .map((user) => {
          const assignedTasks = tasks.filter(
            (task) => String(task.userId ?? '') === String(user.id),
          )

          return `
            <li class="user-card">
              <div class="user-header">
                <button class="user-toggle" type="button" data-user-id="${user.id}" aria-expanded="false">
                  <span class="user-toggle-icon">▸</span>
                  <div class="user-content">
                    <h2>${user.name}</h2>
                    <p><strong>E-Mail:</strong> ${user.email}</p>
                    <p><strong>Firma:</strong> ${user.company.name}</p>
                  </div>
                </button>
                <div class="user-card-actions">
                  <button class="edit-btn" type="button" data-user-id="${user.id}">Bearbeiten</button>
                  <button class="delete-btn" type="button" data-user-id="${user.id}">Löschen</button>
                </div>
              </div>

              <div class="user-task-panel hidden" data-user-task-panel="${user.id}">
                <h3>Zugewiesene Aufgaben</h3>
                ${assignedTasks.length
                  ? `<ul class="user-task-list">${assignedTasks
                      .map(
                        (task) => `
                          <li class="user-task-item ${task.completed ? 'done' : ''}">
                            <span>${task.title}</span>
                            <span class="user-task-status">${task.completed ? 'Erledigt' : 'Offen'}</span>
                          </li>
                        `,
                      )
                      .join('')}</ul>`
                  : '<p class="empty-small">Keine Aufgaben zugewiesen.</p>'}
              </div>
            </li>
          `
        })
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

  userList.querySelectorAll<HTMLButtonElement>('.user-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const userId = button.dataset.userId

      if (userId === undefined) {
        return
      }

      const panel = userList.querySelector<HTMLElement>(`[data-user-task-panel="${userId}"]`)

      if (!panel) {
        return
      }

      const isHidden = panel.classList.toggle('hidden')
      button.setAttribute('aria-expanded', String(!isHidden))
      button.querySelector<HTMLElement>('.user-toggle-icon')?.setAttribute(
        'data-open', String(!isHidden),
      )
      const icon = button.querySelector<HTMLElement>('.user-toggle-icon')

      if (icon) {
        icon.textContent = isHidden ? '▸' : '▾'
      }
    })
  })
}
