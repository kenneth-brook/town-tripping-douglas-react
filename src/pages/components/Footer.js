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
import { useViewMode } from '../../hooks/ViewModeContext';

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
  const { isMapView, setIsMapView } = useViewMode();

  const handleNavigate = (path) => {
    const currentRoute = location.pathname.substring(1); // Get current path without leading slash
    const currentType = routeToDataType[currentRoute];
    if (path === 'maps') {
      setIsMapView(!isMapView);
    } else {
      navigate(`/${path}`);
    }
  };

  const isHomePage = location.pathname === '/home';
  const currentRoute = location.pathname.substring(1).split('/')[0];
  const isActive = (key) => location.pathname === `/${key}`;

  const mapButtonLabel = isMapView ? 'List' : 'Map';

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
                  className={`footer-icon ${isMapView ? 'active' : ''}`}
                  onClick={() => handleNavigate('maps')}
                >
                  <Icon className={`icon-svg ${isMapView ? 'active-icon' : ''}`} />
                  <span className={`icon-label ${isMapView ? 'active-text' : ''}`}>
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
