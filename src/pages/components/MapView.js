// src/pages/components/MapView.js
import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { ReactComponent as Phone } from '../../assets/icos/phone2.svg';
import { ReactComponent as Share } from '../../assets/icos/share-icon2.svg';
import { ReactComponent as AddItinerary } from '../../assets/icos/add-itinerary2.svg';

// Import PNG markers
import eatPin from '../../assets/icos/eatPin.png';
import shopPin from '../../assets/icos/shopPin.png';
import stayPin from '../../assets/icos/stayPin.png';
import playPin from '../../assets/icos/playPin.png';
import eventPin from '../../assets/icos/eventPin.png';

const markerIcons = {
  eat: eatPin,
  shop: shopPin,
  stay: stayPin,
  play: playPin,
  events: eventPin,
};

const MapView = ({ data, type }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    if (data && data.length > 0 && mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();
      data.forEach((item) => {
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

  const handleMarkerClick = (item) => {
    setSelectedPlace(item);
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: [item.long, item.lat],
        zoom: 14,
        speed: 1,
        offset: [0, -200],
      });
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 5,
        }}
        style={{
          width: '100%',
          height: 'calc(100vh - 165px)',
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="pk.eyJ1Ijoid29tYmF0MTk3MiIsImEiOiJjbDN1bmdqM2MyZHF2M2J1djg4bzRncWZpIn0.dXd3qQMnwuob5XB9HKXgkw"
        onLoad={() => {
          if (data && data.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            data.forEach((item) => {
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
            <img src={markerIcons[item.type]} alt={`${item.type} marker`} className="marker-icon" />
          </Marker>
        ))}
        {selectedPlace && (
          <Popup
            className="popCard"
            longitude={selectedPlace.long}
            latitude={selectedPlace.lat}
            onClose={() => {
              setSelectedPlace(null);
            }}
            closeOnClick={false}
            anchor="top"
          >
            <div className="popWrap">
              <div className="popTop">
                {selectedPlace.images && selectedPlace.images.length > 0 && (
                  <img
                    src={`https://douglas.365easyflow.com/easyflow-images/${selectedPlace.images[0]}`}
                    alt={selectedPlace.name}
                  />
                )}
                <h2>{selectedPlace.name}</h2>
              </div>
              <div className="addyText">
                <p>{selectedPlace.street_address}</p>
                <p>
                  {selectedPlace.city}, {selectedPlace.state} {selectedPlace.zip}
                </p>
              </div>
              <div className="popButtonsWrap">
                <div className="popButtonDevide">
                  <div className="popButton">
                    <Phone />
                  </div>
                  <p>CALL</p>
                </div>
                <div className="popButtonDevide">
                  <div className="popButton">
                    <Share />
                  </div>
                  <p>SHARE</p>
                </div>
                <div className="popButtonDevide">
                  <div className="popButton">
                    <AddItinerary />
                  </div>
                  <p>ITINERARY</p>
                </div>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapView;
