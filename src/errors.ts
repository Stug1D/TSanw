// Zeigt eine Fehlermeldung in einem vorhandenen HTML-Element an.
export function showError(element: HTMLElement, message: string): void {
  element.textContent = message
  element.classList.remove('hidden')
}

// Entfernt die Fehlermeldung und versteckt das Element wieder.
export function hideError(element: HTMLElement): void {
  element.textContent = ''
  element.classList.add('hidden')
}
