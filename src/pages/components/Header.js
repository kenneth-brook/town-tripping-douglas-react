import React, { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SlidingMenu from './SlidingMenu';
import '../../sass/componentsass/Header.scss';
import { ReactComponent as EyeIcon } from '../../assets/icos/eye.svg';
import { ReactComponent as Search } from '../../assets/icos/search.svg';
import logoDesk from '../../assets/images/logo-desktop.png';
import { useHeightContext } from '../../hooks/HeightContext.js';
import { useOrientation } from '../../hooks/OrientationContext';
import { useDataContext } from '../../hooks/DataContext';
import { useResettingNavigate } from '../../hooks/useResettingNavigate';

function Header() {
  const { headerRef, headerHeight } = useHeightContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const { setKeyword, resetKeyword, sortData, isAscending, setIsAscending, setSelectedDate, handleNearMe } = useDataContext();
  const orientation = useOrientation();
  const location = useLocation();
  const isNotHomePage = location.pathname !== '/home';
  const keywordInputRef = useRef(null);
  const navigate = useResettingNavigate();
  const [selectedDate, setDate] = useState(null);

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
    console.log(`Keyword set to: ${e.target.value}`);
  };

  const handleShowAllClick = () => {
    console.log('Show All clicked');
    resetKeyword(); // Reset the keyword search
    if (keywordInputRef.current) {
      keywordInputRef.current.value = ''; // Clear the input field
    }
    setSortMenuOpen(false); // Close the sort menu
  };

  const handleAlphabeticalSort = () => {
    setIsAscending(!isAscending); // Toggle the sorting order
    sortData(!isAscending); // Sort the data
    setSortMenuOpen(false); // Close the sort menu
  };

  const handleDateChange = (event) => {
    const date = new Date(event.target.value);
    setDate(date);
    setSelectedDate(date);
    setSortMenuOpen(false); // Close the sort menu
  };

  const menuContent = [
    { label: 'Stay', link: '/stay' },
    { label: 'Play', link: '/play' },
    { label: 'Dine', link: '/dine' },
    { label: 'Shop', link: '/shop' },
    { label: 'Events', link: '/events' },
    { label: 'View All Map', link: '/all' },
    { label: 'Follow Us', link: 'https://www.facebook.com/VisitDouglasCoffeeCountyGA' },
    { label: 'Visitors Guide', link: 'https://365publicationsonline.com/DouglasVG2024/#p=1' },
    { label: 'Website', link: 'https://visitdouglasga.org/' },
  ];

  const sortMenuContent = location.pathname === '/events'
    ? [
        { label: 'Select a Date', type: 'date', onChange: handleDateChange },
      ]
    : [
        { label: 'Near Me', onClick: handleNearMe },
        { label: 'Alphabetical', onClick: handleAlphabeticalSort },
        { label: 'Cuisine Type', link: '/cuisine-type' },
      ];

  return (
    <header ref={headerRef}>
      <div className="header-container">
        <Link to="/itinerary" className="square-button-link">
          <button className="square-button" to="/itinerary">
            <EyeIcon />
            <span>View</span>
            <span>Itinerary</span>
          </button>
        </Link>
        <div
          className={`centerWrap ${
            orientation === 'landscape-primary' ||
            orientation === 'landscape-secondary'
              ? 'landscape'
              : 'portrait'
          }`}
        >
          <a href="/home">
            <img src={logoDesk} alt="Header Image" className="centered-image" />
          </a>
        </div>
        <button
          className="circle-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'X' : '☰'}
        </button>
      </div>
      {isNotHomePage && (
        <div className="search-container">
          <div className="inputBox">
            <input
              ref={keywordInputRef}
              type="text"
              placeholder="Keyword Search"
              className="search-box"
              onChange={handleKeywordChange}
            />
            <Search />
          </div>
          <div className="sort-box">
            <button
              className="sort-button"
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
            >
              Sort Options
            </button>
          </div>
        </div>
      )}
      <SlidingMenu
        isOpen={menuOpen}
        top={headerHeight}
        menuContent={menuContent}
        orientation={orientation}
        toggleMenu={() => setMenuOpen(!menuOpen)}
      />
      <SlidingMenu
        isOpen={sortMenuOpen}
        top={headerHeight}
        menuContent={sortMenuContent}
        orientation={orientation}
        toggleMenu={() => setSortMenuOpen(!sortMenuOpen)}
        isSortMenu={true}
        selectedDate={selectedDate}
        setDate={setDate}
      />
    </header>
  );
}

export default Header;
