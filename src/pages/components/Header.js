import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import SlidingMenu from './SlidingMenu'
import '../../sass/componentsass/Header.scss'
import { ReactComponent as EyeIcon } from '../../assets/icos/eye.svg'
import logo from '../../assets/images/logo.png'

function Header() {
  const headerRef = useRef(null) // Reference to header element
  const [headerHeight, setHeaderHeight] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

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

  // Content for the sliding menu
  const menuContent = [
    { label: 'Profile', link: '/home' },
    { label: 'Settings', link: '/home' },
    { label: 'Logout', link: '/home' },
  ]

  return (
    <header ref={headerRef}>
      <div className="header-container">
        <button className="square-button">
          <EyeIcon />
          <span>View</span>
          <span>Itinerary</span>
        </button>
        <div className="centerWrap">
          <Link to="/home">
            <img src={logo} alt="Header Image" className="centered-image" />
            <input type="text" placeholder="Search..." className="search-box" />
          </Link>
        </div>
        <button className="circle-button" onClick={toggleMenu}>
          {menuOpen ? 'X' : '☰'}
        </button>
      </div>
      <SlidingMenu
        isOpen={menuOpen}
        top={headerHeight}
        menuContent={menuContent}
      />
    </header>
  )
}

export default Header
