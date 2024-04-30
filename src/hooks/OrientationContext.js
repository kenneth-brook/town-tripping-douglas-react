import React, { createContext, useContext } from 'react';
import useOrientation from './useOrientation';

const OrientationContext = createContext();

export const OrientationProvider = ({ children }) => {
  const orientation = useOrientation();
  return (
    <OrientationContext.Provider value={orientation}>
      {children}
    </OrientationContext.Provider>
  );
};

export const useAppOrientation = () => useContext(OrientationContext);