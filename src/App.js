import React from 'react';
import LandingPage from './pages/LandingPage';
import useOrientation from './hooks/useOrientation';

function App() {
  const orientation = useOrientation();

  return (
    <div>
      {orientation === 0 || orientation === 180 ?  // 0 and 180 indicate portrait modes
        <LandingPage />
        :
        <div>Current orientation is {orientation}</div>
      }
    </div>
  );
}

export default App;
