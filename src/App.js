import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './sass/componentsass/App.scss'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import Stay from './pages/Stay'
import Play from './pages/Play'
import Dine from './pages/Dine'
import Shop from './pages/Shop'
import Events from './pages/Events'
import Maps from './pages/Maps'
import { OrientationProvider } from './hooks/OrientationContext'

function App() {
  useEffect(() => {
    const adjustViewportHeight = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    // Set the viewport height on initial load
    adjustViewportHeight()

    // Add event listeners
    window.addEventListener('resize', adjustViewportHeight)
    window.addEventListener('orientationchange', adjustViewportHeight)

    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener('resize', adjustViewportHeight)
      window.removeEventListener('orientationchange', adjustViewportHeight)
    }
  }, [])
  return (
    <Router>
      <OrientationProvider>
        {' '}
        {/* Providing orientation context */}
        <div className="mainWrap">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/stay" element={<Stay pageTitle="Stay" />} />
            <Route path="/play" element={<Play pageTitle="Play" />} />
            <Route path="/dine" element={<Dine pageTitle="Dine" />} />
            <Route path="/shop" element={<Shop pageTitle="Shop" />} />
            <Route path="/events" element={<Events pageTitle="Events" />} />
            <Route path="/maps" element={<Maps pageTitle="Maps" />} />
            <Route path="/maps" element={<Maps pageTitle="Maps" />} />
          </Routes>
        </div>
      </OrientationProvider>
    </Router>
  )
}

export default App
