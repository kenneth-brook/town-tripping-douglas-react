import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as PlayIcon } from '../assets/icos/ticket-icon.svg'
import '../sass/componentsass/Play.scss'

const Play = ({ pageTitle }) => {
  return (
    <>
      <Header />
      <main className="internal-content">
        <div className="page-title">
          <PlayIcon className="play-icon" />
          <h1>{pageTitle}</h1>
        </div>
        {/* You can add more content here as needed */}
      </main>
      <Footer showCircles={true} />
    </>
  )
}

export default Play
