import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'   // moved from index.css → styles/global.css

import './styles/experience.css'
import './styles/refinement.css'
import './styles/scroll-scenes.css'
import './styles/chapters.css'
import './styles/cinematic.css'
import './styles/responsive.css'
import './styles/framer-enhancements.css'
import './styles/summit-redesign.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
