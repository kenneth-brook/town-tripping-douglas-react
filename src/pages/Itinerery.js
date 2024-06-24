import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as Intinerery } from '../assets/icos/intinerery.svg'
import { ReactComponent as Share } from '../assets/icos/share-icon.svg'
//import '../sass/componentsass/Itinerery.scss'
import MapBox from './components/MapBox'

const Itinerery = ({ pageTitle }) => {
  return (
    <>
      <Header />
      <main className="internal-content">
        <div className="page-title">
          <div className="itinerery-title">
            <Intinerery />
            <h1>{pageTitle}</h1>
          </div>
          <div className="right-button">
            <button>
              <Share />
              <span>Share Itinerary</span>
            </button>
          </div>
        </div>
        <MapBox />
      </main>
      <Footer showCircles={true} />
    </>
  )
}

export default Itinerery
