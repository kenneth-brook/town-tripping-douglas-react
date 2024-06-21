import React from 'react'
import { Header } from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as MapsIcon } from '../assets/icos/maps.svg'

const Maps = ({ pageTitle }) => {
  return (
    <>
      <Header />
      <main className="internal-content">
        <div className="page-title">
          <MapsIcon />
          <h1>{pageTitle}</h1>
        </div>
        {/* You can add more content here as needed */}
      </main>
      <Footer showCircles={true} />
    </>
  )
}

export default Maps
