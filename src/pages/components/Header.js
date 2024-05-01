import React from 'react';
import { useOrientation } from '../../hooks/OrientationContext';
import '../../sass/componentsass/Header.scss';

function Header() {
  console.log("Header rendering");
  const orientation = useOrientation();

  return (
    <header>
      <h1>{orientation.includes('portrait') ? 'Portrait Header' : 'Landscape Header'}</h1>
    </header>
  );
}

export default Header;