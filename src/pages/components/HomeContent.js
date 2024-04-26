import React, { useEffect, useState } from 'react';
import '../../sass/componentsass/HomeContent.scss'; // Assume you have CSS/SCSS for styling
import Circle from './Circle';

import { ReactComponent as DineIcon } from '../../assets/icos/dine.svg';
import { ReactComponent as PlayIcon } from '../../assets/icos/play.svg';
import { ReactComponent as StayIcon } from '../../assets/icos/stay.svg';
import { ReactComponent as MapsIcon } from '../../assets/icos/maps.svg';
import { ReactComponent as EventsIcon } from '../../assets/icos/events.svg';
import { ReactComponent as ShopIcon } from '../../assets/icos/shop.svg';

const HomeContent = () => {
  const [circles, setCircles] = useState([]);

  useEffect(() => {
    const svgs = [
        DineIcon,
        PlayIcon,
        StayIcon,
        MapsIcon,
        EventsIcon,
        ShopIcon
      ];
    const texts = ["Dine", "Play", "Stay", "Maps", "Events", "Shop"];

    // Calculate positions and create circle data
    const newCircles = texts.map((text, index) => {
      const angle = index * 60;
      const distance = 125; // Distance from center
      return { svg: svgs[index], text, angle, distance };
    });

    setCircles(newCircles);
  }, []);

  return (
    <main className="main-content">
      <div id="main-container">
        <div className="background-circle2"></div>
        <div className="background-circle"></div> 
        <div id="circle-container">
          {circles.map((circle, index) => (
            <Circle
              key={index}
              svg={circle.svg}
              text={circle.text}
              angle={circle.angle}
              distance={circle.distance}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default HomeContent;