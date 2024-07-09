import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { ReactComponent as Phone } from '../../assets/icos/phone2.svg';
import { ReactComponent as Share } from '../../assets/icos/share-icon2.svg';
import { ReactComponent as AddItinerary } from '../../assets/icos/add-itinerary2.svg';
import { useDataContext } from '../../hooks/DataContext';

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
  const { userLocation } = useDataContext();

  const isValidCoordinate = (lat, lon) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    console.log(`Coordinate check: lat=${latNum} (${typeof latNum}), lon=${lonNum} (${typeof lonNum})`); // Debugging log
    const valid = typeof latNum === 'number' && typeof lonNum === 'number' &&
                  !isNaN(latNum) && !isNaN(lonNum) &&
                  latNum >= -90 && latNum <= 90 &&
                  lonNum >= -180 && lonNum <= 180;
    if (!valid) {
      console.error(`Invalid coordinates: (${latNum}, ${lonNum})`);
    }
    return valid;
  };

  useEffect(() => {
    if (data && data.length > 0 && mapRef.current) {
      const bounds = new mapboxgl.LngLatBounds();
      data.forEach((item) => {
        if (isValidCoordinate(item.lat, item.long)) {
          bounds.extend([parseFloat(item.long), parseFloat(item.lat)]);
        } else {
          console.error(`Invalid item coordinates for ${item.name}: (${item.lat}, ${item.long})`);
        }
      });

      if (userLocation && isValidCoordinate(userLocation.lat, userLocation.lon)) {
        bounds.extend([parseFloat(userLocation.lon), parseFloat(userLocation.lat)]);
      } else {
        console.error(`Invalid user coordinates: (${userLocation.lat}, ${userLocation.lon})`);
      }

      if (!bounds.isEmpty()) {
        const map = mapRef.current.getMap();
        map.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15,
          duration: 1000,
        });
      } else {
        console.error("Bounds are empty, cannot fit map to bounds.");
      }
    }
  }, [data, userLocation]);

  const handleMarkerClick = (item) => {
    setSelectedPlace(item);
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: [parseFloat(item.long), parseFloat(item.lat)],
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
        style={{ width: '100%', height: 'calc(100vh - 165px)' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken="pk.eyJ1Ijoid29tYmF0MTk3MiIsImEiOiJjbDN1bmdqM2MyZHF2M2J1djg4bzRncWZpIn0.dXd3qQMnwuob5XB9HKXgkw"
        onLoad={() => {
          if (data && data.length > 0) {
            const bounds = new mapboxgl.LngLatBounds();
            data.forEach((item) => {
              if (isValidCoordinate(item.lat, item.long)) {
                bounds.extend([parseFloat(item.long), parseFloat(item.lat)]);
              }
            });
            if (userLocation && isValidCoordinate(userLocation.lat, userLocation.lon)) {
              bounds.extend([parseFloat(userLocation.lon), parseFloat(userLocation.lat)]);
            }
            if (!bounds.isEmpty()) {
              const map = mapRef.current.getMap();
              map.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                maxZoom: 15,
                duration: 1000,
              });
            } else {
              console.error("Bounds are empty, cannot fit map to bounds.");
            }
          }
        }}
      >
        {userLocation && isValidCoordinate(userLocation.lat, userLocation.lon) && (
          <Marker
            longitude={parseFloat(userLocation.lon)}
            latitude={parseFloat(userLocation.lat)}
            color="red"
            anchor="bottom"
          >
            <Popup>You are here</Popup>
          </Marker>
        )}
        {data.map((item) => (
          isValidCoordinate(item.lat, item.long) && (
            <Marker
              key={item.id}
              longitude={parseFloat(item.long)}
              latitude={parseFloat(item.lat)}
              anchor="bottom"
              onClick={() => handleMarkerClick(item)}
            >
              <img src={markerIcons[item.type]} alt={`${item.type} marker`} className="marker-icon" />
            </Marker>
          )
        ))}
        {selectedPlace && (
          <Popup
            className="popCard"
            longitude={parseFloat(selectedPlace.long)}
            latitude={parseFloat(selectedPlace.lat)}
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
