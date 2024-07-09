import React from 'react';
import '../../sass/componentsass/SlidingMenu.scss';
import { ReactComponent as Triangle } from '../../assets/icos/triangle.svg';
import { ReactComponent as Cross } from '../../assets/icos/cross.svg';
import { useViewMode } from '../../hooks/ViewModeContext';
import { useNavigate } from 'react-router-dom';

function SlidingMenu({ isOpen, top, menuContent, orientation, toggleMenu, isSortMenu = false, selectedDate, setDate }) {
  const { setIsMapView } = useViewMode();
  const navigate = useNavigate();

  const handleNavigation = (link, onClick) => {
    if (!link && onClick) {
      onClick();
    } else if (link === '/all') {
      setIsMapView(true);
      navigate(link);
    } else if (link && link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else if (link) {
      navigate(link);
    }
    toggleMenu();
  };

  const menuStyle =
    orientation === 'landscape-primary' ||
    orientation === 'landscape-secondary' ||
    orientation === 'desktop'
      ? {
          left: '0px',
          transform: isOpen ? 'translateX(0)' : 'translateX(-110%)',
        }
      : {
          top: `${top}px`,
          transform: isOpen ? 'translateY(0)' : 'translateY(-110%)',
        };

  return (
    <div className={`sliding-menu ${orientation}`} style={menuStyle}>
      {orientation === 'landscape-primary' ||
        orientation === 'landscape-secondary' ||
        (orientation === 'desktop' && (
          <button onClick={toggleMenu} className="menu-close-button">
            <Cross />
          </button>
        ))}

      <div className="menu-content">
        {orientation === 'landscape-primary' ||
        orientation === 'landscape-secondary' ||
        orientation === 'desktop' ? (
          <>
            <div className="column">
              {menuContent
                .slice(0, Math.ceil(menuContent.length / 2))
                .map((item, index) => (
                  <div
                    key={index}
                    className="menu-item"
                    onClick={() => handleNavigation(item.link, item.onClick)}
                  >
                    <Triangle />
                    {item.label}
                    {item.type === 'date' && (
                      <input
                        type="date"
                        value={selectedDate ? selectedDate.toISOString().substring(0, 10) : ''}
                        onChange={item.onChange}
                      />
                    )}
                  </div>
                ))}
            </div>
            <div className="column">
              {menuContent
                .slice(Math.ceil(menuContent.length / 2))
                .map((item, index) => (
                  <div
                    key={index + Math.ceil(menuContent.length / 2)}
                    className="menu-item"
                    onClick={() => handleNavigation(item.link, item.onClick)}
                  >
                    <Triangle />
                    {item.label}
                    {item.type === 'date' && (
                      <input
                        type="date"
                        value={selectedDate ? selectedDate.toISOString().substring(0, 10) : ''}
                        onChange={item.onChange}
                      />
                    )}
                  </div>
                ))}
            </div>
          </>
        ) : (
          menuContent.map((item, index) => (
            <div
              key={index}
              className="menu-item"
              onClick={() => handleNavigation(item.link, item.onClick)}
            >
              <Triangle />
              {item.label}
              {item.type === 'date' && (
                <input
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().substring(0, 10) : ''}
                  onChange={item.onChange}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SlidingMenu;
