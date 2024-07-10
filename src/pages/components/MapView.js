import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
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

const isValidCoordinate = (lat, lon) => {
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  const valid = !isNaN(latNum) && !isNaN(lonNum) && latNum >= -90 && latNum <= 90 && lonNum >= -180 && lonNum <= 180;
  if (!valid) {
    console.error(`Invalid coordinates: lat=${lat}, lon=${lon}`);
  }
  return valid;
};

const centerMap = (map, data, userLocation, nearMe) => {
  if (nearMe && userLocation) {
    const lat = parseFloat(userLocation.lat);
    const lon = parseFloat(userLocation.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      console.log('Centering map on user location:', { lat, lon });

      // Find the nearest marker to the user location
      let nearestMarker = null;
      let minDistance = Infinity;

      data.forEach((item) => {
        if (item.valid) {
          const itemLat = parseFloat(item.lat);
          const itemLon = parseFloat(item.long);
          const distance = Math.sqrt((lat - itemLat) ** 2 + (lon - itemLon) ** 2);
          if (distance < minDistance) {
            minDistance = distance;
            nearestMarker = { lat: itemLat, lon: itemLon };
          }
        }
      });

      if (nearestMarker) {
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([lon, lat]);
        bounds.extend([nearestMarker.lon, nearestMarker.lat]);
        map.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 14,
          duration: 500, // Reduced duration for faster transition
        });
      } else {
        map.flyTo({
          center: [lon, lat],
          zoom: 14,
          speed: 2, // Increased speed for faster transition
          offset: [0, 0]
        });
      }
    } else {
      console.error('Parsed user location resulted in NaN:', { lat, lon });
    }
  } else {
    const bounds = new mapboxgl.LngLatBounds();
    data.forEach((item) => {
      if (item.valid) {
        bounds.extend([parseFloat(item.long), parseFloat(item.lat)]);
      } else {
        console.error(`Invalid item coordinates for ${item.name}: (${item.lat}, ${item.long})`);
      }
    });

    if (!bounds.isEmpty()) {
      console.log("Fitting map bounds to markers.");
      map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15,
        duration: 500, // Reduced duration for faster transition
      });
    } else {
      console.error("Bounds are empty, cannot fit map to bounds.");
    }
  }
};

const addMarkers = (data, handleMarkerClick) => {
  return data.map((item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.long);
    if (!isNaN(lat) && !isNaN(lon)) {
      return (
        <Marker
          key={item.id}
          longitude={lon}
          latitude={lat}
          anchor="bottom"
          onClick={() => handleMarkerClick(item)}
        >
          <img src={markerIcons[item.type]} alt={`${item.type} marker`} className="marker-icon" />
        </Marker>
      );
    } else {
      console.error(`Skipping marker for ${item.name} due to invalid coordinates: lat=${lat}, lon=${lon}`);
      return null;
    }
  });
};

const renderPopup = (place, setSelectedPlace) => {
  const lat = parseFloat(place.lat);
  const lon = parseFloat(place.long);
  if (!isNaN(lat) && !isNaN(lon)) {
    return (
      <Popup
        className="popCard"
        longitude={lon}
        latitude={lat}
        onClose={() => {
          setSelectedPlace(null);
        }}
        closeOnClick={false}
        anchor="top"
      >
        <div className="popWrap">
          <div className="popTop">
            {place.images && place.images.length > 0 && (
              <img
                src={`https://douglas.365easyflow.com/easyflow-images/${place.images[0]}`}
                alt={place.name}
              />
            )}
            <h2>{place.name}</h2>
          </div>
          <div className="addyText">
            <p>{place.street_address}</p>
            <p>
              {place.city}, {place.state} {place.zip}
            </p>
          </div>
        </div>
      </Popup>
    );
  } else {
    console.error(`Invalid coordinates for popup: lat=${lat}, lon=${lon}`);
    return null;
  }
};

const MapView = ({ data, type }) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const mapRef = useRef();
  const { nearMe, userLocation } = useDataContext();
  const [userPin, setUserPin] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Validate coordinates once and add the result to the data
  const validatedData = data.map(item => ({
    ...item,
    valid: isValidCoordinate(item.lat, item.long)
  }));

  useEffect(() => {
    if (mapLoaded) {
      const map = mapRef.current.getMap();
      centerMap(map, validatedData, userLocation, nearMe);
      console.log("Markers added to map:", validatedData.length);
    }
  }, [validatedData, userLocation, nearMe, mapLoaded]);

  useEffect(() => {
    if (nearMe && userLocation) {
      const lat = parseFloat(userLocation.lat);
      const lon = parseFloat(userLocation.lon);
      if (!isNaN(lat) && !isNaN(lon)) {
        setUserPin({ lat, lon });
      } else {
        setUserPin(null);
      }
    }
  }, [nearMe, userLocation]);

  const handleMarkerClick = (item) => {
    setSelectedPlace(item);
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      if (item.valid) {
        map.flyTo({
          center: [parseFloat(item.long), parseFloat(item.lat)],
          zoom: 14,
          speed: 2, // Increased speed for faster transition
          offset: [0, -window.innerHeight / 4] // Adjust offset to center the marker
        });
      } else {
        console.error(`Invalid coordinates for marker click: (${item.lat}, ${item.long})`);
      }
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
        onLoad={() => setMapLoaded(true)}
      >
        {addMarkers(validatedData, handleMarkerClick)}
        {selectedPlace && renderPopup(selectedPlace, setSelectedPlace)}
        {userPin && (
          <>
            {console.log(`Attempting to place user pin at lat: ${userPin.lat}, lon: ${userPin.lon} (lat type: ${typeof userPin.lat}, lon type: ${typeof userPin.lon})`)}
            <Marker
              longitude={userPin.lon}
              latitude={userPin.lat}
              anchor="bottom"
              color="red"
            >
              {console.log(`Rendering user pin at lat: ${userPin.lat}, lon: ${userPin.lon}`)}
            </Marker>
          </>
        )}
      </Map>
    </div>
  );
};

export default MapView;
