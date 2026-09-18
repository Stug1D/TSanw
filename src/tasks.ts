import type { Task } from './types'

// Aktualisiert den completed-Status im lokalen State, ohne den Server direkt zu fragen.
export function updateTaskCompletion(
  tasks: Task[],
  taskId: string | number,
  checked: boolean,
): Task[] {
  const normalizedTaskId = String(taskId)

  return tasks.map((task) =>
    String(task.id) === normalizedTaskId ? { ...task, completed: checked } : task,
  )
}

// Entfernt eine Aufgabe aus dem lokalen State.
export function deleteTaskFromList(
  tasks: Task[],
  taskId: string | number,
): Task[] {
  const normalizedTaskId = String(taskId)

  return tasks.filter((task) => String(task.id) !== normalizedTaskId)
}

// Optionen für das Rendern der Aufgabenliste.
interface RenderTasksOptions {
  taskList: HTMLUListElement
  tasks: Task[]
  onToggle: (taskId: string | number, checked: boolean) => void
  onDelete: (taskId: string | number) => void
}

// Rendert die Aufgabe-Liste und verbindet Checkboxen sowie Löschen-Buttons mit den Aktionen.
export function renderTasks({
  taskList,
  tasks,
  onToggle,
  onDelete,
}: RenderTasksOptions): void {
  taskList.innerHTML = tasks
    .map(
      (task) => `
        <li class="task-item ${task.completed ? 'done' : ''}">
          <label class="task-label">
            <input type="checkbox" data-task-id="${task.id}" ${task.completed ? 'checked' : ''} />
            <span>${task.title}</span>
          </label>
          <button class="task-delete-btn" type="button" data-task-id="${task.id}">Löschen</button>
        </li>
      `,
    )
    .join('')

  taskList.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement
      const taskId = target.dataset.taskId
      const checked = target.checked

      if (taskId === undefined) {
        return
      }

      onToggle(taskId, checked)
    })
  })

  taskList.querySelectorAll<HTMLButtonElement>('.task-delete-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const taskId = button.dataset.taskId

      if (taskId === undefined) {
        return
      }

      onDelete(taskId)
    })
  })
}
