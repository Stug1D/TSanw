// Zeigt eine Meldung im Fehlerbereich an, damit der Benutzer den Fehler auf der Oberfläche sieht.
export function showError(element: HTMLElement, message: string): void {
  element.textContent = message
  element.classList.remove('hidden')
}

// Blendet die Fehlermeldung wieder aus und leert den Text, damit kein alter Fehler weiter angezeigt wird.
export function hideError(element: HTMLElement): void {
  element.textContent = ''
  element.classList.add('hidden')
}
