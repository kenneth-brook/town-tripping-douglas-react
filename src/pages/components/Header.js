import React, { useState } from 'react';
import { useOrientation } from '../../hooks/OrientationContext';
import '../../sass/componentsass/Header.scss';
import { ReactComponent as EyeIcon } from '../../assets/icos/eye.svg';
import logo from '../../assets/images/logo.png';

function Header() {
  console.log("Header rendering");
  const orientation = useOrientation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
      setMenuOpen(!menuOpen);
  };

  return (
      <header>
          <div className="header-container">
              <button className="square-button">
                  <EyeIcon />
                  <span>View</span>
                  <span>Itinerary</span>
              </button>
              <div className='centerWrap'>
                  <img src= {logo} alt="Header Image" className="centered-image"/>
                  <input type="text" placeholder="Search..." className="search-box"/>
              </div>
              <button className="circle-button" onClick={toggleMenu}>
                  {menuOpen ? 'X' : '☰'}
              </button>
          </div>
      </header>
  );
}

export default Header;