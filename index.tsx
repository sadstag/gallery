/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
import { createRoot } from 'react-dom/client'
import { App } from './src/app/App'

const root = document.getElementById('root')

if (root) {
    createRoot(root).render(<App />)
} else {
    console.error('Root element not found !')
}
