import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import AppMap from './components/ArcMap/AppMap.tsx'
// import AppMap1 from './components/ArcMap/AppMap1.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppMap />
  </StrictMode>,
)
