import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useHeightContext } from '../hooks/HeightContext';
import Map, { Marker, Popup } from 'react-map-gl';
import { useOrientation } from '../hooks/OrientationContext';
import mapboxgl from 'mapbox-gl';
import { ReactComponent as Phone } from '../assets/icos/phone2.svg'
import { ReactComponent as Share } from '../assets/icos/share-icon2.svg'
import { ReactComponent as AddItinerary } from '../assets/icos/add-itinerary2.svg'

// Import PNG markers
import eatPin from '../assets/icos/eatPin.png';
import shopPin from '../assets/icos/shopPin.png';
import stayPin from '../assets/icos/stayPin.png';
import playPin from '../assets/icos/playPin.png';
import eventPin from '../assets/icos/eventPin.png';

// Import SVG icons
import { ReactComponent as DineIcon } from '../assets/icos/dine.svg';
import { ReactComponent as PlayIcon } from '../assets/icos/play.svg';
import { ReactComponent as StayIcon } from '../assets/icos/stay.svg';
import { ReactComponent as EventsIcon } from '../assets/icos/events.svg';
import { ReactComponent as ShopIcon } from '../assets/icos/shop.svg';
import { ReactComponent as MapsIcon } from '../assets/icos/maps.svg';

const markerIcons = {
  eat: eatPin,
  shop: shopPin,
  stay: stayPin,
  play: playPin,
  events: eventPin,
};

const typeIcons = {
  eat: DineIcon,
  play: PlayIcon,
  stay: StayIcon,
  shop: ShopIcon,
  events: EventsIcon,
};

const Maps = () => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext();
  const orientation = useOrientation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentType, data, previousPath } = location.state || {};
  const [selectedPlace, setSelectedPlace] = useState(null);
  const mapRef = useRef();

  const typeToTitle = {
    eat: 'Dine Map',
    play: 'Play Map',
    stay: 'Stay Map',
    shop: 'Shop Map',
    events: 'Events Map',
  };

  const TypeIcon = typeIcons[currentType] || null;
  const currentTitle = typeToTitle[currentType] || 'Map';

  useEffect(() => {
    if (!currentType) {
      navigate('/home'); // Redirect to home if no type is passed
    }
  }, [currentType, navigate]);

  useEffect(() => {
    if (data && data.length > 0 && mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();
      data.forEach(item => {
        bounds.extend([item.long, item.lat]);
      });

      const map = mapRef.current.getMap();
      map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15,
        duration: 1000,
      });
    }
  }, [data]);

  const MarkerIcon = markerIcons[currentType];

  const handleMarkerClick = (item) => {
    console.log('Marker clicked:', item);
    setSelectedPlace(item);
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: [item.long, item.lat],
        zoom: 14, // Adjust the zoom level as needed
        speed: 1, // Adjust the animation speed as needed
      });
    }
  };

  return (
    <div
      className={`app-container ${
        orientation === 'landscape-primary' || orientation === 'landscape-secondary'
          ? 'landscape'
          : 'portrait'
      }`}
    >
      <Header />
      <main
        style={{
          height: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="page-title page-title-overlay"
          style={{
            top: '165px',
          }}
        >
          {TypeIcon && <TypeIcon className="icon-svg" />}
          <h1>{currentTitle}</h1>
          <MapsIcon className="icon-svg" />
        </div>
        <div
          className="internal-content"
          style={{
            height: 'calc(100vh - 165px)',
            position: 'relative',
          }}
        >
          {data ? (
            <Map
              ref={mapRef}
              initialViewState={{
                longitude: -100,
                latitude: 40,
                zoom: 5,
              }}
              style={{
                position: 'relative',
                objectFit: 'contain',
              }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken="pk.eyJ1Ijoid29tYmF0MTk3MiIsImEiOiJjbDN1bmdqM2MyZHF2M2J1djg4bzRncWZpIn0.dXd3qQMnwuob5XB9HKXgkw"
              onLoad={() => {
                if (data && data.length > 0) {
                  const bounds = new mapboxgl.LngLatBounds();
                  data.forEach(item => {
                    bounds.extend([item.long, item.lat]);
                  });
                  const map = mapRef.current.getMap();
                  map.fitBounds(bounds, {
                    padding: { top: 50, bottom: 50, left: 50, right: 50 },
                    maxZoom: 15,
                    duration: 1000,
                  });
                }
              }}
            >
              {data.map((item) => (
                <Marker
                  key={item.id}
                  longitude={item.long}
                  latitude={item.lat}
                  anchor="bottom"
                  onClick={() => handleMarkerClick(item)}
                >
                  <img src={MarkerIcon} alt={`${currentType} marker`} className="marker-icon" />
                </Marker>
              ))}
              {selectedPlace && (
                <Popup className='popCard'
                  longitude={selectedPlace.long}
                  latitude={selectedPlace.lat}
                  onClose={() => {
                    console.log('Popup closed');
                    setSelectedPlace(null);
                  }}
                  closeOnClick={false} // Prevents the popup from closing when clicking inside it
                  anchor="top"
                >
                  <div className='popWrap'>
                    <div className='popTop'>
                      {selectedPlace.images && selectedPlace.images.length > 0 && (
                        <img
                        src={`https://douglas.365easyflow.com/easyflow-images/${selectedPlace.images[0]}`}
                        alt={selectedPlace.name}
                        />
                      )}
                      <h2>{selectedPlace.name}</h2>
                    </div>
                    <div className='addyText'>
                      <p>{selectedPlace.street_address}</p>
                      <p>{selectedPlace.city}, {selectedPlace.state} {selectedPlace.zip}</p>
                    </div>
                    <div className='popButtonsWrap'>
                      <div className='popButtonDevide'>
                        <div className='popButton'><Phone /></div>
                        <p>CALL</p>
                      </div>
                      <div className='popButtonDevide'>
                        <div className='popButton'><Share /></div>
                        <p>SHARE</p>
                      </div>
                      <div className='popButtonDevide'>
                        <div className='popButton'><AddItinerary /></div>
                        <p>ITINERARY</p>
                      </div>
                    </div>
                    
                  </div>
                </Popup>
              )}
            </Map>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </div>
  );
};

export default Maps;
