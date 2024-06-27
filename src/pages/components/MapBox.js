import React, { useState } from 'react'
import MapGL from 'react-map-gl'
import '../../sass/componentsass/MapBox.scss'

const MapBox = () => {
  const [viewport, setViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  })

  return (
    <div className="map-container">
      <MapGL
        {...viewport}
        mapboxApiAccessToken="pk.eyJ1Ijoid29tYmF0MTk3MiIsImEiOiJjbDN1bmdqM2MyZHF2M2J1djg4bzRncWZpIn0.dXd3qQMnwuob5XB9HKXgkw"
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      />
    </div>
  )
}

export default MapBox
