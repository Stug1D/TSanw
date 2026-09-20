import './style.css'
import {
  addTask,
  deleteTaskRecord,
  loadTasks as loadTaskRecords,
  toggleTaskRecord,
} from './features/tasks'
import { addUser, deleteUserRecord, loadUsers as loadUserRecords, updateUserRecord } from './features/users'
import type { Task, User } from './types'
import { renderUsers } from './userList'
import { hideError, showError } from './errors'
import { deleteTaskFromList, renderTasks, updateTaskCompletion } from './tasks'

// -------------------------------
// State
// -------------------------------
let users: User[] = []
let tasks: Task[] = []

// -------------------------------
// App root
// -------------------------------
const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

// -------------------------------
// Initial HTML
// -------------------------------
app.innerHTML = `
  <header class="toolbar">
    <label class="search-field" for="user-search">Suche nach Namen</label>
    <button id="add-user-toggle" class="primary-btn" type="button">Benutzer hinzufügen</button>
    <input id="user-search" type="text" placeholder="Benutzernamen eingeben" autocomplete="off" />
  </header>

  <section id="add-user-panel" class="add-user-panel hidden">
    <form id="add-user-form" class="add-user-form">
      <h2>Neuen Benutzer anlegen</h2>

      <div class="form-row">
        <label for="new-user-name">Name</label>
        <input id="new-user-name" name="name" type="text" placeholder="Max Mustermann" required />
      </div>

      <div class="form-row">
        <label for="new-user-email">E-Mail</label>
        <input id="new-user-email" name="email" type="email" placeholder="max@example.com" required />
      </div>

      <div class="form-row">
        <label for="new-user-company">Firma</label>
        <input id="new-user-company" name="company" type="text" placeholder="Beispiel GmbH" required />
      </div>

      <div class="form-actions">
        <button class="primary-btn" type="submit">Speichern</button>
        <button class="secondary-btn" type="button" id="cancel-user-add">Abbrechen</button>
      </div>
    </form>
  </section>

  <section id="edit-user-panel" class="edit-user-panel hidden">
    <form id="edit-user-form" class="edit-user-form">
      <h2>Benutzer bearbeiten</h2>

      <div class="form-row">
        <label for="edit-user-name">Name</label>
        <input id="edit-user-name" name="name" type="text" required />
      </div>

      <div class="form-row">
        <label for="edit-user-email">E-Mail</label>
        <input id="edit-user-email" name="email" type="email" required />
      </div>

      <div class="form-row">
        <label for="edit-user-company">Firma</label>
        <input id="edit-user-company" name="company" type="text" required />
      </div>

      <div class="form-actions">
        <button class="primary-btn" type="submit">Speichern</button>
        <button class="secondary-btn" type="button" id="cancel-user-edit">Abbrechen</button>
      </div>
    </form>
  </section>

  <main class="user-panel">
    <section>
      <h1>Benutzer</h1>
      <div id="loading" class="loading">Daten werden geladen...</div>
      <ul id="user-list" class="user-list" aria-live="polite"></ul>
    </section>

    <section class="task-section">
      <h2>Aufgaben</h2>
      <div class="task-controls">
        <button id="add-task-toggle" class="primary-btn" type="button">Aufgabe hinzufügen</button>
      </div>
      <div class="task-filters">
        <div class="filter-group">
          <label for="task-status-filter">Status</label>
          <select id="task-status-filter">
            <option value="all">Alle</option>
            <option value="open">Offen</option>
            <option value="done">Erledigt</option>
          </select>
        </div>
        <div class="filter-group">
          <label for="task-user-filter">Benutzer</label>
          <select id="task-user-filter">
            <option value="all">Alle Benutzer</option>
          </select>
        </div>
      </div>
      <div id="task-form-wrapper" class="task-form-wrapper hidden">
        <form id="task-form" class="task-form">
          <div class="form-row">
            <label for="new-task-title">Aufgabe</label>
            <input id="new-task-title" name="title" type="text" placeholder="z. B. Projekt fertigstellen" required />
          </div>
          <div class="form-row">
            <label for="new-task-user">Zugewiesen an</label>
            <select id="new-task-user" name="userId">
              <option value="">Ohne Benutzer</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="primary-btn" type="submit">Speichern</button>
            <button class="secondary-btn" type="button" id="cancel-task-add">Abbrechen</button>
          </div>
        </form>
      </div>
      <div id="task-error" class="task-error hidden" aria-live="polite"></div>
      <ul id="task-list" class="task-list"></ul>
    </section>
  </main>
`

const userListElement = document.querySelector<HTMLUListElement>('#user-list')
const taskListElement = document.querySelector<HTMLUListElement>('#task-list')
const taskErrorElement = document.querySelector<HTMLDivElement>('#task-error')
const taskFormWrapperElement = document.querySelector<HTMLElement>('#task-form-wrapper')
const taskFormElement = document.querySelector<HTMLFormElement>('#task-form')
const taskTitleInputElement = document.querySelector<HTMLInputElement>('#new-task-title')
const taskUserSelectElement = document.querySelector<HTMLSelectElement>('#new-task-user')
const taskStatusFilterElement = document.querySelector<HTMLSelectElement>('#task-status-filter')
const taskUserFilterElement = document.querySelector<HTMLSelectElement>('#task-user-filter')
const addTaskToggleElement = document.querySelector<HTMLButtonElement>('#add-task-toggle')
const cancelTaskAddElement = document.querySelector<HTMLButtonElement>('#cancel-task-add')
const searchInputElement = document.querySelector<HTMLInputElement>('#user-search')
const loadingElement = document.querySelector<HTMLDivElement>('#loading')
const addUserToggleElement = document.querySelector<HTMLButtonElement>('#add-user-toggle')
const addUserPanelElement = document.querySelector<HTMLElement>('#add-user-panel')
const addUserFormElement = document.querySelector<HTMLFormElement>('#add-user-form')
const cancelUserAddElement = document.querySelector<HTMLButtonElement>('#cancel-user-add')
const editUserPanelElement = document.querySelector<HTMLElement>('#edit-user-panel')
const editUserFormElement = document.querySelector<HTMLFormElement>('#edit-user-form')
const cancelUserEditElement = document.querySelector<HTMLButtonElement>('#cancel-user-edit')
const editUserNameInputElement = document.querySelector<HTMLInputElement>('#edit-user-name')
const editUserEmailInputElement = document.querySelector<HTMLInputElement>('#edit-user-email')
const editUserCompanyInputElement = document.querySelector<HTMLInputElement>('#edit-user-company')

if (
  !userListElement ||
  !taskListElement ||
  !taskErrorElement ||
  !taskFormWrapperElement ||
  !taskFormElement ||
  !taskTitleInputElement ||
  !taskUserSelectElement ||
  !taskStatusFilterElement ||
  !taskUserFilterElement ||
  !addTaskToggleElement ||
  !cancelTaskAddElement ||
  !searchInputElement ||
  !loadingElement ||
  !addUserToggleElement ||
  !addUserPanelElement ||
  !addUserFormElement ||
  !cancelUserAddElement ||
  !editUserPanelElement ||
  !editUserFormElement ||
  !cancelUserEditElement ||
  !editUserNameInputElement ||
  !editUserEmailInputElement ||
  !editUserCompanyInputElement
) {
  throw new Error('Not all UI elements were found')
}

const userList = userListElement
const taskList = taskListElement
const taskError = taskErrorElement
const taskFormWrapper = taskFormWrapperElement
const taskForm = taskFormElement
const taskTitleInput = taskTitleInputElement
const taskUserSelect = taskUserSelectElement
const taskStatusFilter = taskStatusFilterElement
const taskUserFilter = taskUserFilterElement
const addTaskToggle = addTaskToggleElement
const cancelTaskAdd = cancelTaskAddElement
const searchInput = searchInputElement
const loading = loadingElement
const addUserToggle = addUserToggleElement
const addUserPanel = addUserPanelElement
const addUserForm = addUserFormElement
const cancelUserAdd = cancelUserAddElement
const editUserPanel = editUserPanelElement
const editUserForm = editUserFormElement
const cancelUserEdit = cancelUserEditElement
const editUserNameInput = editUserNameInputElement
const editUserEmailInput = editUserEmailInputElement
const editUserCompanyInput = editUserCompanyInputElement

let editingUserId: string | number | null = null
let selectedTaskStatus: 'all' | 'open' | 'done' = 'all'
let selectedTaskUserId: string | number | 'all' = 'all'

// -------------------------------
// Error helpers
// -------------------------------
function showTaskError(message: string): void {
  showError(taskError, message)
}

function hideTaskError(): void {
  hideError(taskError)
}

// -------------------------------
// Task rendering and optimistic updates
// -------------------------------
function renderTaskFilters(): void {
  const userOptions = users
    .map(
      (user) =>
        `<option value="${String(user.id)}" ${selectedTaskUserId === String(user.id) ? 'selected' : ''}>${user.name}</option>`,
    )
    .join('')

  taskUserFilter.innerHTML = `<option value="all">Alle Benutzer</option>${userOptions}`
  taskUserFilter.value = selectedTaskUserId === 'all' ? 'all' : String(selectedTaskUserId)

  taskUserSelect.innerHTML = `<option value="">Ohne Benutzer</option>${userOptions}`
}

const renderTaskList = (): void => {
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      selectedTaskStatus === 'all' ||
      (selectedTaskStatus === 'open' && !task.completed) ||
      (selectedTaskStatus === 'done' && task.completed)

    const taskUser = task.userId === undefined || task.userId === null ? 'none' : String(task.userId)
    const matchesUser =
      selectedTaskUserId === 'all' ||
      (selectedTaskUserId === 'none' && taskUser === 'none') ||
      taskUser === String(selectedTaskUserId)

    return matchesStatus && matchesUser
  })

  renderTasks({
    taskList,
    tasks: filteredTasks,
    users,
    onToggle: async (taskId, checked) => {
      // Speichere den alten Zustand, damit wir im Fehlerfall zurückrollen können.
      const previousTasks = [...tasks]
      const taskToUpdate = tasks.find((task) => String(task.id) === String(taskId))

      if (!taskToUpdate) {
        return
      }

      // Optimistic Update: UI sofort anpassen, bevor der Server antwortet.
      tasks = updateTaskCompletion(tasks, taskId, checked)
      renderTaskList()
      hideTaskError()

      try {
        await toggleTaskRecord(taskId, checked)
      } catch (error) {
        // Serverfehler: alten Zustand wieder herstellen und Fehler anzeigen.
        tasks = previousTasks
        renderTaskList()
        showTaskError('Keine Serververbindung. Änderung wurde rückgängig gemacht.')
        console.error(error)
      }
    },
    onDelete: async (taskId) => {
      // Merke dir den alten Zustand, bevor die Aufgabe sofort aus der Liste verschwindet.
      const previousTasks = [...tasks]

      // Optimistic Update: Aufgabe sofort aus der UI entfernen.
      tasks = deleteTaskFromList(tasks, taskId)
      renderTaskList()
      hideTaskError()

      try {
        await deleteTaskRecord(taskId)
      } catch (error) {
        // Serverfehler: Liste wieder auf den alten Stand zurücksetzen.
        tasks = previousTasks
        renderTaskList()
        showTaskError('Keine Serververbindung. Aufgabe wurde nicht gelöscht.')
        console.error(error)
      }
    },
  })
}

function renderTasksView(): void {
  renderTaskList()
}

// -------------------------------
// User delete and optimistic rollback
// -------------------------------
function handleDelete(userId: string | number): void {
  // Speichere den alten Zustand, damit wir bei einem fehlgeschlagenen Request zurückrollen können.
  const previousUsers = [...users]
  const normalizedUserId = String(userId)

  // Optimistic Update: Benutzer sofort aus der UI entfernen.
  users = users.filter((user) => String(user.id) !== normalizedUserId)
  renderUsers({
    userList,
    users,
    tasks,
    query: searchInput.value,
    onDelete: handleDelete,
    onEdit: handleEdit,
  })
  hideTaskError()

  void (async () => {
    try {
      await deleteUserRecord(userId)
      users = await loadUserRecords()
      renderUsers({
        userList,
        users,
        tasks,
        query: searchInput.value,
        onDelete: handleDelete,
        onEdit: handleEdit,
      })
    } catch (error) {
      // Wenn der Server nicht erreichbar ist, rekonstruiere den Zustand vor dem Löschen.
      users = previousUsers
      renderUsers({
        userList,
        users,
        tasks,
        query: searchInput.value,
        onDelete: handleDelete,
        onEdit: handleEdit,
      })
      showTaskError('Keine Serververbindung. Benutzer wurde nicht gelöscht.')
      console.error(error)
    }
  })()
}

function handleEdit(user: User): void {
  editingUserId = user.id
  editUserNameInput.value = user.name
  editUserEmailInput.value = user.email
  editUserCompanyInput.value = user.company.name
  editUserPanel.classList.remove('hidden')
}

// -------------------------------
// User loading
// -------------------------------
async function loadUsers(): Promise<void> {
  loading.hidden = false
  userList.innerHTML = ''

  try {
    users = await loadUserRecords()
    renderTaskFilters()
    renderUsers({
      userList,
      users,
      tasks,
      query: searchInput.value,
      onDelete: handleDelete,
      onEdit: handleEdit,
    })
  } catch (error) {
    userList.innerHTML = '<li class="empty">Benutzerdaten konnten nicht geladen werden.</li>'
    console.error(error)
  } finally {
    loading.hidden = true
  }
}

// -------------------------------
// Task loading
// -------------------------------
async function loadTasks(): Promise<void> {
  try {
    tasks = await loadTaskRecords()
    renderTasksView()
  } catch (error) {
    console.error(error)
  }
}

// -------------------------------
// Task form handlers
// -------------------------------
addTaskToggle.addEventListener('click', () => {
  taskFormWrapper.classList.toggle('hidden')
  taskTitleInput.focus()
})

cancelTaskAdd.addEventListener('click', () => {
  taskFormWrapper.classList.add('hidden')
  taskForm.reset()
})

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const title = taskTitleInput.value.trim()
  const userId = taskUserSelect.value === '' ? null : taskUserSelect.value

  if (!title) {
    return
  }

  // Merke dir den alten Zustand, damit ein fehlgeschlagener POST zurückrollen kann.
  const previousTasks = [...tasks]
  const optimisticTask: Task = {
    id: `temp-${Date.now()}`,
    title,
    completed: false,
  }

  // Optimistic Update: Aufgabe sofort in der Liste anzeigen.
  tasks = [...tasks, optimisticTask]
  renderTasksView()
  hideTaskError()
  taskForm.reset()
  taskUserSelect.value = ''
  taskFormWrapper.classList.add('hidden')

  try {
    const savedTask = await addTask({ title, completed: false, userId })
    tasks = tasks.map((task) => (String(task.id) === String(optimisticTask.id) ? savedTask : task))
    renderTasksView()
  } catch (error) {
    // Serverfehler: ursprüngliche Liste wieder herstellen.
    tasks = previousTasks
    renderTasksView()
    showTaskError('Keine Serververbindung. Aufgabe wurde nicht hinzugefügt.')
    console.error(error)
  }
})

// -------------------------------
// User form handlers
// -------------------------------
addUserToggle.addEventListener('click', () => {
  addUserPanel.classList.toggle('hidden')
})

cancelUserAdd.addEventListener('click', () => {
  addUserPanel.classList.add('hidden')
  addUserForm.reset()
})

addUserForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  const formData = new FormData(addUserForm)
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const companyName = String(formData.get('company') ?? '').trim()

  if (!name || !email || !companyName) {
    return
  }

  loading.hidden = false

  try {
    await addUser({ name, email, companyName })

    addUserForm.reset()
    addUserPanel.classList.add('hidden')
    await loadUsers()
  } catch (error) {
    console.error(error)
    userList.innerHTML = '<li class="empty">Benutzer konnte nicht gespeichert werden.</li>'
  } finally {
    loading.hidden = true
  }
})

// -------------------------------
// Search
// -------------------------------
searchInput.addEventListener('input', (event) => {
  const target = event.target as HTMLInputElement
  renderUsers({
    userList,
    users,
    tasks,
    query: target.value,
    onDelete: handleDelete,
    onEdit: handleEdit,
  })
})

taskStatusFilter.addEventListener('change', (event) => {
  const target = event.target as HTMLSelectElement
  selectedTaskStatus = target.value as 'all' | 'open' | 'done'
  renderTaskList()
})

taskUserFilter.addEventListener('change', (event) => {
  const target = event.target as HTMLSelectElement
  selectedTaskUserId = target.value === 'all' ? 'all' : target.value
  renderTaskList()
})

cancelUserEdit.addEventListener('click', () => {
  editUserPanel.classList.add('hidden')
  editUserForm.reset()
  editingUserId = null
})

editUserForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (editingUserId === null) {
    return
  }

  const name = editUserNameInput.value.trim()
  const email = editUserEmailInput.value.trim()
  const companyName = editUserCompanyInput.value.trim()

  if (!name || !email || !companyName) {
    return
  }

  const previousUsers = [...users]
  const userIdToUpdate = editingUserId
  const userToUpdate = users.find((user) => String(user.id) === String(userIdToUpdate))

  if (!userToUpdate) {
    return
  }

  const optimisticUser: User = {
    ...userToUpdate,
    name,
    email,
    company: {
      ...userToUpdate.company,
      name: companyName,
    },
  }

  users = users.map((user) =>
    String(user.id) === String(userIdToUpdate) ? optimisticUser : user,
  )
  renderUsers({
    userList,
    users,
    tasks,
    query: searchInput.value,
    onDelete: handleDelete,
    onEdit: handleEdit,
  })
  hideTaskError()

  editUserForm.reset()
  editUserPanel.classList.add('hidden')
  editingUserId = null

  try {
    await updateUserRecord(userIdToUpdate, { name, email, companyName })
    users = await loadUserRecords()
    renderUsers({
      userList,
      users,
      tasks,
      query: searchInput.value,
      onDelete: handleDelete,
      onEdit: handleEdit,
    })
  } catch (error) {
    users = previousUsers
    renderUsers({
      userList,
      users,
      tasks,
      query: searchInput.value,
      onDelete: handleDelete,
      onEdit: handleEdit,
    })
    console.error(error)
    showTaskError('Keine Serververbindung. Benutzer wurde nicht bearbeitet.')
  }
})

// -------------------------------
// Startup
// -------------------------------
void loadTasks()
void loadUsers()
