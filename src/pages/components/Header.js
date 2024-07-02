import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SlidingMenu from './SlidingMenu'
import SortMenu from './SortMenu.js'
import '../../sass/componentsass/Header.scss'
import { ReactComponent as EyeIcon } from '../../assets/icos/eye.svg'
import { ReactComponent as Search } from '../../assets/icos/search.svg'
import logo from '../../assets/images/logo.png'
import logoHor from '../../assets/images/logo-horizontal.png'
import logoDesk from '../../assets/images/logo-desktop.png'
import { useHeightContext } from '../../hooks/HeightContext.js'
import { useOrientation } from '../../hooks/OrientationContext'

function Header() {
  const { headerRef, headerHeight } = useHeightContext()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuOpen2, setMenuOpen2] = useState(false)
  const orientation = useOrientation()

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
  ]

  const menuList = [
    { label: 'Show All', link: '/home' },
    { label: 'Near Me', link: '/near-me' },
    { label: 'Alphabetical', link: '/alphabetical' },
    { label: 'Price', link: '/price' },
    { label: 'Cuisine Type', link: '/cuisine-type' },
  ]

  const location = useLocation()
  const isNotHomePage = location.pathname !== '/home'

  return (
    <header ref={headerRef}>
      <div className="header-container">
        <Link to="/itinerery" className="square-button-link">
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
          <Link to="/home">
            {orientation === 'landscape-primary' ||
            orientation === 'landscape-secondary' ? (
              <img
                src={logoHor}
                alt="Header Image"
                className="centered-image"
              />
            ) : orientation === 'desktop' ? (
              <img
                src={logoDesk}
                alt="Header Image"
                className="centered-image"
              />
            ) : (
              <img src={logo} alt="Header Image" className="centered-image" />
            )}
          </Link>
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
              type="text"
              placeholder="Keyword Search"
              className="search-box"
            />
            <Search />
          </div>
          <div className="sort-box">
            <button
              className="sort-button"
              onClick={() => setMenuOpen2(!menuOpen2)}
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
      <SortMenu
        isOpen={menuOpen2}
        top={headerHeight}
        menuList={menuList}
        orientation={orientation}
        toggleMenu2={() => setMenuOpen2(!menuOpen2)}
      />
    </header>
  )
}

export default Header
