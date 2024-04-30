import React from 'react';
import { useAppOrientation } from '../../hooks/OrientationContext';

function Header() {
  const orientation = useAppOrientation();

  return (
    <header>
      {orientation === 0 || orientation === 180
        ? <h1>Portrait Header</h1>
        : <h1>Landscape Header</h1>}
    </header>
  );
}

export default Header;