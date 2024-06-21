import React from 'react'
import { Link } from 'react-router-dom'
import '../../sass/componentsass/SlidingMenu.scss'
import { ReactComponent as Triangle } from '../../assets/icos/triangle.svg'

function SlidingMenu({ isOpen, top, menuContent }) {
  const menuStyle = {
    top: `${top}px`,
    transform: isOpen ? 'translateY(0)' : 'translateY(-110%)',
  }

  console.log('Menu style:', menuStyle)

  return (
    <div className="sliding-menu" style={menuStyle}>
      {menuContent.map((item, index) => (
        <a key={index} href={item.link} className="menu-item">
          <Triangle />
          {item.label}
        </a>
      ))}
    </div>
  )
}

export default SlidingMenu
