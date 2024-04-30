import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './sass/componentsass/App.scss';
import Header from './pages/components/Header';
import Footer from './pages/components/Footer';
import HomePage from './pages/HomePage'; // Ensure you have this page component
import LandingPage from './pages/LandingPage';
import { OrientationProvider } from './hooks/OrientationContext';

function App() {
  return (
    <Router>
      <OrientationProvider> {/* Providing orientation context */}
        <div className='mainWrap'>
          <Header />  {/* Now can use orientation context */}
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
          <Footer />  {/* Now can use orientation context */}
        </div>
      </OrientationProvider>
    </Router>
  );
}

export default App;