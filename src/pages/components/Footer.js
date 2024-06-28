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
import { useViewMode } from '../../hooks/ViewModeContext';

const icons = {
  dine: DineIcon,
  play: PlayIcon,
  stay: StayIcon,
  shop: ShopIcon,
  events: EventsIcon,
  maps: MapsIcon,
};

const Footer = forwardRef(({ showCircles = false }, ref) => {
  const orientation = useOrientation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setFooterHeight } = useHeightContext();
  const { isMapView, setIsMapView } = useViewMode();

  const handleNavigate = (path) => {
    navigate(`/${path}`);
  };

  const isHomePage = location.pathname === '/home';

  const toggleView = () => {
    setIsMapView(!isMapView);
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
            const isActive = location.pathname === `/${key}`;
            return (
              <div
                key={index}
                className={`footer-icon ${isActive ? 'active' : ''}`}
                onClick={() => handleNavigate(key)}
              >
                <Icon className={`icon-svg ${isActive ? 'active-icon' : ''}`} />
                <span className={`icon-label ${isActive ? 'active-text' : ''}`}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </div>
            );
          })}
          <div className="footer-icon" onClick={toggleView}>
            <MapsIcon className="icon-svg" />
            <span className="icon-label">{isMapView ? 'List View' : 'Map View'}</span>
          </div>
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
