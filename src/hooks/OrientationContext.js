import React, { createContext, useContext, useState, useEffect } from 'react';

const OrientationContext = createContext(null);

export const OrientationProvider = ({ children }) => {
  const [orientation, setOrientation] = useState(window.screen.orientation?.type);

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.screen.orientation?.type);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <OrientationContext.Provider value={orientation}>
      {children}
    </OrientationContext.Provider>
  );
};

export const useOrientation = () => useContext(OrientationContext);
