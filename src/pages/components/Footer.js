import React from 'react';
import { useOrientation } from '../../hooks/OrientationContext';
import '../../sass/componentsass/Footer.scss';

function Footer() {
  console.log("Footer rendering");
  const orientation = useOrientation();

  return (
    <footer>
      <p>{orientation === 'portrait' ? 'Portrait Footer' : 'Landscape Footer'}</p>
    </footer>
  );
}

export default Footer;