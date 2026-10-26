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
import './styles/framer-enhancements.css'
import './styles/summit-redesign.css'
// Responsive rules run after the page/effect layers they adapt.
import './styles/responsive.css'

// On the home page, fetch the hero page and its dot animation in parallel with the app shell instead of one after the other.
if (window.location.pathname === '/') {
  import('./pages/Home.jsx').catch(() => {})
  import('./components/framer/ParticleIntro.js').catch(() => {})
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
