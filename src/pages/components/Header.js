import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SlidingMenu from './SlidingMenu';
import SortMenu from './SortMenu.js';
import '../../sass/componentsass/Header.scss';
import { ReactComponent as EyeIcon } from '../../assets/icos/eye.svg';
import { ReactComponent as Search } from '../../assets/icos/search.svg';
import logo from '../../assets/images/logo.png';
import HeaderHeightContext from '../../hooks/HeaderHeightContext.js';

function Header() {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpen2, setMenuOpen2] = useState(false);

  const updateHeaderHeight = () => {
    if (headerRef.current) {
      const newHeight = headerRef.current.offsetHeight;
      setHeaderHeight(newHeight);
      document.documentElement.style.setProperty('--header-height', `${newHeight}px`);
    }
  };

  useEffect(() => {
    // Use setTimeout to ensure the DOM is fully rendered before measuring the height
    setTimeout(() => {
      updateHeaderHeight();
    }, 100);

    window.addEventListener('resize', updateHeaderHeight);
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      updateHeaderHeight();
    });
    if (headerRef.current) {
      observer.observe(headerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    }
    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleMenu2 = () => {
    setMenuOpen2(!menuOpen2);
  };

  const menuContent = [
    { label: 'Stay', link: '/stay' },
    { label: 'Play', link: '/play' },
    { label: 'Dine', link: '/dine' },
    { label: 'Shop', link: '/shop' },
    { label: 'Events', link: '/events' },
    { label: 'Maps', link: '/maps' },
    { label: 'Follow Us', link: '/follow-us' },
    { label: 'Visitors Guide', link: '/visitors-guide' },
    { label: 'Website', link: '/website' },
    { label: 'About', link: '/about' },
  ];

  const menuList = [
    { label: 'Show All', link: '/show-all' },
    { label: 'Near Me', link: '/near-me' },
    { label: 'Alphabetical', link: '/alphabetical' },
    { label: 'Price', link: '/price' },
    { label: 'Cuisine Type', link: '/cuisine-type' },
  ];

  const location = useLocation();
  const isNotHomePage = location.pathname !== '/home';

  return (
    <HeaderHeightContext.Provider value={headerHeight}>
      <header ref={headerRef}>
        <div className="header-container">
          <Link to="/itinerery" className="square-button-link">
            <button className="square-button">
              <EyeIcon />
              <span>View</span>
              <span>Itinerary</span>
            </button>
          </Link>
          <div className="centerWrap">
            <Link to="/home">
              <img src={logo} alt="Header Image" className="centered-image" />
            </Link>
          </div>
          <button className="circle-button" onClick={toggleMenu}>
            {menuOpen ? 'X' : '☰'}
          </button>
        </div>
        {isNotHomePage && (
          <div className="search-container">
            <div className="inputBox">
              <input
                type="text"
                placeholder="Keyword Search"
                className="search-box"
              />
              <Search />
            </div>

            <div className="sort-box">
              <button className="sort-button" onClick={toggleMenu2}>
                Sort Options
              </button>
            </div>
          </div>
        )}
        <SlidingMenu
          isOpen={menuOpen}
          top={headerHeight}
          menuContent={menuContent}
        />
        <SortMenu
          isOpen={menuOpen2}
          top={headerHeight}
          menuList={menuList}
          toggleMenu2={toggleMenu2}
        />
      </header>
    </HeaderHeightContext.Provider>
  );
}

export { Header };
