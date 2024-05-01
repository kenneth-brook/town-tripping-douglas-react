import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './sass/componentsass/App.scss';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import { OrientationProvider } from './hooks/OrientationContext';

function App() {
  useEffect(() => {
    const adjustViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set the viewport height on initial load
    adjustViewportHeight();

    // Add event listeners
    window.addEventListener('resize', adjustViewportHeight);
    window.addEventListener('orientationchange', adjustViewportHeight);

    // Cleanup the event listeners on component unmount
    return () => {
      window.removeEventListener('resize', adjustViewportHeight);
      window.removeEventListener('orientationchange', adjustViewportHeight);
    };
  }, []);
  return (
    <Router>
      <OrientationProvider> {/* Providing orientation context */}
        <div className='mainWrap'>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </div>
      </OrientationProvider>
    </Router>
  );
}

export default App;