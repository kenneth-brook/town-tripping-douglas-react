import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactComponent as MapsIcon } from '../assets/icos/maps.svg';
import { useHeightContext } from '../hooks/HeightContext';
import Map from 'react-map-gl';

const Maps = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext();

  return (
    <>
      <Header />
      <main className="internal-content" style={{ paddingTop: `calc(${headerHeight}px + 30px)`, paddingBottom: `calc(${footerHeight}px + 50px)`, height: '100vh', position: 'relative', overflow: 'hidden' }}>
        <div className="page-title page-title-overlay">
          <MapsIcon />
          <h1>{pageTitle}</h1>
        </div>
        <Map
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 3.5
          }}
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          mapboxAccessToken="YOUR_MAPBOX_ACCESS_TOKEN"
        />
      </main>
      <Footer showCircles={true} />
    </>
  );
}

export default Maps;
