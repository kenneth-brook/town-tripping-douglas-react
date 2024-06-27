import React from 'react'
import '../../sass/componentsass/SlidingMenu.scss'
import { ReactComponent as Triangle } from '../../assets/icos/triangle.svg'
import { ReactComponent as Cross } from '../../assets/icos/cross.svg'

function SlidingMenu({ isOpen, top, menuContent, orientation, toggleMenu }) {
  const menuStyle =
    orientation === 'landscape-primary' || orientation === 'landscape-secondary'
      ? {
          left: '0px',
          transform: isOpen ? 'translateX(0)' : 'translateX(-110%)',
        }
      : {
          top: `${top}px`,
          transform: isOpen ? 'translateY(0)' : 'translateY(-110%)',
        }

  return (
    <div className={`sliding-menu ${orientation}`} style={menuStyle}>
      {(orientation === 'landscape-primary' ||
        orientation === 'landscape-secondary') && (
        <button onClick={toggleMenu} className="menu-close-button">
          <Cross />
        </button>
      )}

      <div className="menu-content">
        {orientation === 'landscape-primary' ||
        orientation === 'landscape-secondary' ? (
          <>
            <div className="column">
              {menuContent
                .slice(0, Math.ceil(menuContent.length / 2))
                .map((item, index) => (
                  <a key={index} href={item.link} className="menu-item">
                    <Triangle />
                    {item.label}
                  </a>
                ))}
            </div>
            <div className="column">
              {menuContent
                .slice(Math.ceil(menuContent.length / 2))
                .map((item, index) => (
                  <a
                    key={index + Math.ceil(menuContent.length / 2)}
                    href={item.link}
                    className="menu-item"
                  >
                    <Triangle />
                    {item.label}
                  </a>
                ))}
            </div>
          </>
        ) : (
          menuContent.map((item, index) => (
            <a key={index} href={item.link} className="menu-item">
              <Triangle />
              {item.label}
            </a>
          ))
        )}
      </div>
    </div>
  )
}

export default SlidingMenu
