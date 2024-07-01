import React, { forwardRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useOrientation } from '../../hooks/OrientationContext';
import { ReactComponent as DineIcon } from '../../assets/icos/dine.svg';
import { ReactComponent as PlayIcon } from '../../assets/icos/play.svg';
import { ReactComponent as StayIcon } from '../../assets/icos/stay.svg';
import { ReactComponent as MapsIcon } from '../../assets/icos/maps.svg';
import { ReactComponent as EventsIcon } from '../../assets/icos/events.svg';
import { ReactComponent as ShopIcon } from '../../assets/icos/shop.svg';
import '../../sass/componentsass/Footer.scss';
import { useHeightContext } from '../../hooks/HeightContext';
import { useDataContext } from '../../hooks/DataContext';

const icons = {
  dine: DineIcon,
  play: PlayIcon,
  stay: StayIcon,
  shop: ShopIcon,
  events: EventsIcon,
  maps: MapsIcon,
};

const routeToDataType = {
  dine: 'eat',
  play: 'play',
  stay: 'stay',
  shop: 'shop',
  events: 'events',
};

const Footer = forwardRef(({ showCircles = false }, ref) => {
  const orientation = useOrientation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setFooterHeight } = useHeightContext();
  const { data } = useDataContext();

  const handleNavigate = (path) => {
    const currentRoute = location.pathname.substring(1); // Get current path without leading slash
    if (path === 'maps') {
      const currentType = routeToDataType[currentRoute];
      const currentData = data[currentType] || [];
      navigate(`/${path}`, { state: { currentType, data: currentData, previousPath: currentRoute } });
    } else {
      navigate(`/${path}`);
    }
  };

  const isHomePage = location.pathname === '/home';
  const isMapPage = location.pathname === '/maps';
  const currentRoute = location.state?.previousPath || location.pathname.substring(1).split('/')[0];
  const isActive = (key) => {
    if (isMapPage && key === 'maps') return false;
    return location.pathname === `/${key}` || (isMapPage && routeToDataType[currentRoute] === key);
  };

  const mapButtonLabel = isMapPage ? 'List' : 'Map';
  const mapButtonHandler = () => {
    if (isMapPage) {
      navigate(`/${currentRoute}`);
    } else {
      handleNavigate('maps');
    }
  };

  useEffect(() => {
    if (ref && ref.current) {
      setFooterHeight(ref.current.offsetHeight);
    }
  }, [ref, setFooterHeight]);

  return (
    <footer ref={ref}>
      {showCircles && (
        <div className="footer-circles">
          {Object.keys(icons).map((key, index) => {
            const Icon = icons[key];
            if (key === 'maps') {
              return (
                <div
                  key={index}
                  className={`footer-icon ${isActive(key) ? 'active' : ''}`}
                  onClick={mapButtonHandler}
                >
                  <Icon className={`icon-svg ${isActive(key) ? 'active-icon' : ''}`} />
                  <span className={`icon-label ${isActive(key) ? 'active-text' : ''}`}>
                    {mapButtonLabel}
                  </span>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className={`footer-icon ${isActive(key) ? 'active' : ''}`}
                  onClick={() => handleNavigate(key)}
                >
                  <Icon className={`icon-svg ${isActive(key) ? 'active-icon' : ''}`} />
                  <span className={`icon-label ${isActive(key) ? 'active-text' : ''}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </div>
              );
            }
          })}
        </div>
      )}

      <div className="footer-container">
        <div className="circle-background">
          {isHomePage && (
            <div className="footer-content">
              <h3>Get Free Info</h3>
              <p>at Visitor Information Center</p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
});

export default Footer;
