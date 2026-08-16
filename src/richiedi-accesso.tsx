import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import RichiediAccesso from './pages/RichiediAccesso.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RichiediAccesso />
  </StrictMode>,
)
