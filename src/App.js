import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './sass/componentsass/App.scss';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import Itinerary from './pages/Itinerary'; // Correct the import
import DetailView from './pages/components/DetailView';
import Stay from './pages/Stay';
import Play from './pages/Play';
import Dine from './pages/Dine';
import Shop from './pages/Shop';
import Events from './pages/Events';
import AllView from './pages/AllView'; // Import AllView
import LoginPage from './pages/LoginPage'; // Import your login page
import ProtectedRoute from './pages/components/ProtectedRoute'; // Import the ProtectedRoute component
import { HeightProvider } from './hooks/HeightContext';
import { OrientationProvider } from './hooks/OrientationContext';
import DataProvider from './hooks/DataContext';
import { ViewModeProvider } from './hooks/ViewModeContext';
import 'mapbox-gl/dist/mapbox-gl.css';

function App() {
  const isAuthenticated = false; // Replace this with your actual authentication check logic

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
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/stay" element={<Stay pageTitle="Stay" />} />
                  <Route path="/play" element={<Play pageTitle="Play" />} />
                  <Route path="/dine" element={<Dine pageTitle="Dine" />} />
                  <Route path="/shop" element={<Shop pageTitle="Shop" />} />
                  <Route path="/events" element={<Events pageTitle="Events" />} />
                  <Route path="/login" element={<LoginPage />} /> {/* Add the login page route */}
                  <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
                    <Route path="/itinerary" element={<Itinerary pageTitle="Itinerary" />} />
                  </Route>
                  <Route path="/all" element={<AllView pageTitle="All View" />} /> {/* Add AllView route */}
                  <Route path="/:category/:id" element={<DetailView />} />
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
