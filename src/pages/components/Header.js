import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SlidingMenu from './SlidingMenu'
import SortMenu from './SortMenu.js'
import '../../sass/componentsass/Header.scss'
import { ReactComponent as EyeIcon } from '../../assets/icos/eye.svg'
import { ReactComponent as Search } from '../../assets/icos/search.svg'
import logo from '../../assets/images/logo.png'

function Header() {
  const headerRef = useRef(null) // Reference to header element
  const [headerHeight, setHeaderHeight] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuOpen2, setMenuOpen2] = useState(false)

  // Function to update the height of the header
  const updateHeaderHeight = () => {
    if (headerRef.current) {
      const newHeight = headerRef.current.offsetHeight
      setHeaderHeight(newHeight)
      console.log('Updated Header Height:', newHeight)
    }
  }

  // Effect to update the header height on mount and resize
  useEffect(() => {
    updateHeaderHeight() // Initial update on mount
    window.addEventListener('resize', updateHeaderHeight) // Update on window resize

    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

  // Effect to handle dynamic content changes that might affect the header's size
  useEffect(() => {
    const observer = new MutationObserver(() => {
      updateHeaderHeight() // Update height when mutations are observed
    })
    if (headerRef.current) {
      observer.observe(headerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      })
    }

    return () => observer.disconnect() // Clean up observer on component unmount
  }, [])

  // Toggle the visibility of the sliding menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const toggleMenu2 = () => {
    setMenuOpen2(!menuOpen2)
  }

  // Content for the sliding menu
  const menuContent = [
    { label: 'Stay', link: '/home' },
    { label: 'Play', link: '/home' },
    { label: 'Dine', link: '/home' },
    { label: 'Shop', link: '/home' },
    { label: 'Events', link: '/home' },
    { label: 'Maps', link: '/home' },
    { label: 'Follow Us', link: '/home' },
    { label: 'Visitors Guide', link: '/home' },
    { label: 'Website', link: '/home' },
    { label: 'About', link: '/home' },
  ]

  // Content for the sort menu
  const menuList = [
    { label: 'Show All', link: '/home' },
    { label: 'Near Me', link: '/home' },
    { label: 'Alphabetical', link: '/home' },
    { label: 'Price', link: '/home' },
    { label: 'Cuisine Type', link: '/home' },
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
  )
}

export default Header
