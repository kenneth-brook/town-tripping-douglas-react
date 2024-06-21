import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as StayIcon } from '../assets/icos/stay.svg'

const Stay = ({ pageTitle }) => {
  return (
    <>
      <Header />
      <main className="internal-content">
        <div className="page-title">
          <StayIcon />
          <h1>{pageTitle}</h1>
        </div>
        {/* You can add more content here as needed */}
      </main>
      <Footer showCircles={true} />
    </>
  )
}

export default Stay
