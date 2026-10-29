import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { RouterProvider } from './router'
import './styles/global.css'
import './styles/link.css'
// Self-hosted Latin fonts (latin subset only, small woff2). CJK relies on
// system font stacks — see global.css.
import '@fontsource/jost/latin-300.css'
import '@fontsource/jost/latin-400.css'
import '@fontsource/jost/latin-500.css'
import '@fontsource/jost/latin-600.css'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-500.css'
import '@fontsource/ibm-plex-sans/latin-600.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider>
      <App />
    </RouterProvider>
  </React.StrictMode>,
)
