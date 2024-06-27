import React from 'react'
import { ReactComponent as ShowAll } from '../../assets/icos/show-all.svg'
import { ReactComponent as NearMe } from '../../assets/icos/near-me.svg'
import { ReactComponent as Alpha } from '../../assets/icos/alphabetic.svg'
import { ReactComponent as Price } from '../../assets/icos/price.svg'
import { ReactComponent as Cuisine } from '../../assets/icos/cuisine.svg'
import { ReactComponent as Cross } from '../../assets/icos/cross.svg'
import styles from '../../sass/componentsass/SortMenu.scss'

function SortMenu({ isOpen, top, menuList, orientation, toggleMenu2 }) {
  const menuStyle2 =
    orientation === 'landscape-primary' || orientation === 'landscape-secondary'
      ? {
          left: '0px',
          transform: isOpen ? 'translateX(0)' : 'translateX(-110%)',
        }
      : {
          top: `${top}px`,
          transform: isOpen ? 'translateY(0)' : 'translateY(-110%)',
        }

  const icons = {
    'Show All': ShowAll,
    'Near Me': NearMe,
    Alphabetical: Alpha,
    Price: Price,
    'Cuisine Type': Cuisine,
  }

  return (
    <div className="sort-menu" style={menuStyle2}>
      <button onClick={toggleMenu2}>
        <Cross />
      </button>
      {menuList.map((item, index) => {
        const IconComponent = icons[item.label]
        return (
          <a key={index} href={item.link} className="s-menu-item">
            {IconComponent && <IconComponent />}
            {item.label}
          </a>
        )
      })}
    </div>
  )
}

export default SortMenu
