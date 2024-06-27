import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as MapsIcon } from '../assets/icos/maps.svg'
import { useHeightContext } from '../hooks/HeightContext'
import Map from 'react-map-gl'
import { useOrientation } from '../hooks/OrientationContext'

const Maps = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext()
  const orientation = useOrientation()

  return (
    <div
      className={`app-container ${
        orientation === 'landscape-primary' ||
        orientation === 'landscape-secondary'
          ? 'landscape'
          : 'portrait'
      }`}
    >
      <Header />
      <main style={{
            height: '100vh',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}>
        <div className="page-title page-title-overlay" style={{
          top: '165px',
        }}>
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
          />
        </div>
      </main>
      <Footer showCircles={true} />
    </div>
  )
}

export default Maps
