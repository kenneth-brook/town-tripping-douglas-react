import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useOrientation } from '../../hooks/OrientationContext';
import { ReactComponent as DineIcon } from '../../assets/icos/dine.svg';
import { ReactComponent as PlayIcon } from '../../assets/icos/play.svg';
import { ReactComponent as StayIcon } from '../../assets/icos/stay.svg';
import { ReactComponent as MapsIcon } from '../../assets/icos/maps.svg';
import { ReactComponent as EventsIcon } from '../../assets/icos/events.svg';
import { ReactComponent as ShopIcon } from '../../assets/icos/shop.svg';
import '../../sass/componentsass/Footer.scss';

const icons = {
  dine: DineIcon,
  play: PlayIcon,
  stay: StayIcon,
  maps: MapsIcon,
  events: EventsIcon,
  shop: ShopIcon
};

function Footer({ showCircles = false }) {
  const orientation = useOrientation();
  const navigate = useNavigate(); // Hook to navigate

  // Function to handle navigation
  const handleNavigate = (path) => {
    navigate(`/${path}`);
  };

  return (
    <footer>
      {showCircles && (
        <div className="footer-circles">
          {Object.keys(icons).map((key, index) => {
            const Icon = icons[key];
            return (
              <div key={index} className="footer-icon" onClick={() => handleNavigate(key)}>
                <Icon />
              </div>
            );
          })}
        </div>
      )}
    </footer>
  );
}

export default Footer;