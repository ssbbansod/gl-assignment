import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import AppMap from './components/AppMap.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppMap />
  </StrictMode>,
)
