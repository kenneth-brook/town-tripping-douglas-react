import React from 'react';
import { Link } from 'react-router-dom';
import '../../sass/componentsass/SlidingMenu.scss';

function SlidingMenu({ isOpen, top, menuContent }) {
    const menuStyle = {
        top: `${top}px`,
        transform: isOpen ? 'translateY(0)' : 'translateY(-100%)',
    };

    console.log("Menu style:", menuStyle);

    return (
        <div className="sliding-menu" style={menuStyle}>
            {menuContent.map((item, index) => (
                <a key={index} href={item.link} className="menu-item">
                    {item.label}
                </a>
            ))}
        </div>
    );
}

export default SlidingMenu;