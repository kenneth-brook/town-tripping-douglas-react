import React from 'react';
import { ReactComponent as DineIcon } from '../../assets/icos/dine.svg';
import { ReactComponent as PlayIcon } from '../../assets/icos/play.svg';
import { ReactComponent as StayIcon } from '../../assets/icos/stay.svg';
import { ReactComponent as MapsIcon } from '../../assets/icos/maps.svg';
import { ReactComponent as EventsIcon } from '../../assets/icos/events.svg';
import { ReactComponent as ShopIcon } from '../../assets/icos/shop.svg';

const icons = {
  dine: DineIcon,
  play: PlayIcon,
  stay: StayIcon,
  maps: MapsIcon,
  events: EventsIcon,
  shop: ShopIcon
};

const Circle = ({ icon, text, angle, distance }) => {
  const IconComponent = icons[icon];

  const positionCircle = () => {
    const radian = (angle * Math.PI) / 180;
    const offsetLeft = distance * Math.cos(radian);
    const offsetTop = distance * Math.sin(radian);
    return {
      left: `calc(50% + ${offsetLeft}px - 60px)`,
      top: `calc(50% - ${offsetTop}px - 60px)`
    };
  };

  return (
    <div className="white-circle" style={positionCircle()}>
      <IconComponent />
      <span className="circle-text">{text}</span>
    </div>
  );
};

export default Circle;
