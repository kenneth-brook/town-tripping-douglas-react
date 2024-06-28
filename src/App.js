import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './sass/componentsass/App.scss';
import HomePage from './pages/HomePage';
import Stay from './pages/Stay';
import Play from './pages/Play';
import Dine from './pages/Dine';
import Shop from './pages/Shop';
import Events from './pages/Events';
import { HeightProvider } from './hooks/HeightContext';
import { OrientationProvider } from './hooks/OrientationContext';
import DataProvider from './hooks/DataContext';
import { ViewModeProvider } from './hooks/ViewModeContext';

function App() {
  useEffect(() => {
    const adjustViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    adjustViewportHeight();
    window.addEventListener('resize', adjustViewportHeight);
    window.addEventListener('orientationchange', adjustViewportHeight);

    return () => {
      window.removeEventListener('resize', adjustViewportHeight);
      window.removeEventListener('orientationchange', adjustViewportHeight);
    };
  }, []);

  return (
    <Router>
      <OrientationProvider>
        <HeightProvider>
          <DataProvider>
            <ViewModeProvider>
              <div className="mainWrap">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/stay" element={<Stay pageTitle="Stay" />} />
                  <Route path="/play" element={<Play pageTitle="Play" />} />
                  <Route path="/dine" element={<Dine pageTitle="Dine" />} />
                  <Route path="/shop" element={<Shop pageTitle="Shop" />} />
                  <Route path="/events" element={<Events pageTitle="Events" />} />
                </Routes>
              </div>
            </ViewModeProvider>
          </DataProvider>
        </HeightProvider>
      </OrientationProvider>
    </Router>
  );
}

export default App;
