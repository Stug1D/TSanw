import { initApp } from './app'

const appRoot = document.querySelector<HTMLElement>('#app')

if (!appRoot) {
  throw new Error('App root not found')
}

initApp(appRoot)
