import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'; // Ensure you have this page component
import LandingPage from './pages/LandingPage';
import useOrientation from './hooks/useOrientation';

function App() {
  const orientation = useOrientation();

  return (
    <Router>
      <div>
        {orientation === 0 || orientation === 180 ? ( // Checks for portrait mode
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        ) : (
          <div>Current orientation is {orientation}</div> // Display orientation in non-portrait modes
        )}
      </div>
    </Router>
  );
}

export default App;