// src/pages/Maps.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactComponent as MapsIcon } from '../assets/icos/maps.svg';
import { useHeightContext } from '../hooks/HeightContext';
import Map, { Marker, Popup } from 'react-map-gl';
import { useOrientation } from '../hooks/OrientationContext';
import { useDataContext } from '../hooks/DataContext';

const Maps = ({ pageTitle, selectedType }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext();
  const { data, loading, error } = useDataContext();
  const orientation = useOrientation();
  const [selectedPlace, setSelectedPlace] = useState(null);

  const filteredData = selectedType
    ? selectedType === 'events'
      ? data.events
      : data[selectedType]
    : [].concat(data.eat, data.play, data.stay, data.shop);

  useEffect(() => {
    // Ensure the markers are correctly placed by re-rendering when the data changes
  }, [data, selectedType]);

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
          <MapsIcon />
          <h1>{pageTitle}</h1>
        </div>
        <div
          className="internal-content"
          style={{
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {!loading && !error && (
            <Map
              initialViewState={{
                longitude: -100,
                latitude: 40,
                zoom: 3.5,
              }}
              style={{
                position: 'relative',
                objectFit: 'contain',
              }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken="pk.eyJ1Ijoid29tYmF0MTk3MiIsImEiOiJjbDN1bmdqM2MyZHF2M2J1djg4bzRncWZpIn0.dXd3qQMnwuob5XB9HKXgkw"
            >
              {filteredData.map((item) => (
                <Marker
                  key={item.id}
                  longitude={item.long}
                  latitude={item.lat}
                  anchor="bottom"
                  onClick={() => setSelectedPlace(item)}
                >
                  <div className={`marker ${item.type}`} />
                </Marker>
              ))}
              {selectedPlace && (
                <Popup
                  longitude={selectedPlace.long}
                  latitude={selectedPlace.lat}
                  onClose={() => setSelectedPlace(null)}
                >
                  <div>
                    <h2>{selectedPlace.name}</h2>
                    <p dangerouslySetInnerHTML={{ __html: selectedPlace.description }}></p>
                    {selectedPlace.rating && (
                      <div className="reviews-block">
                        <p>{selectedPlace.rating.toFixed(1)} Google reviews</p>
                      </div>
                    )}
                  </div>
                </Popup>
              )}
            </Map>
          )}
        </div>
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </div>
  );
};

export default Maps;
