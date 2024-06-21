import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as DineIcon } from '../assets/icos/dine.svg'

const Dine = ({ pageTitle }) => {
  return (
    <>
      <Header />
      <main className="internal-content">
        <div className="page-title">
          <DineIcon />
          <h1>{pageTitle}</h1>
        </div>

        {/* You can add more content here as needed */}
      </main>
      <Footer showCircles={true} />
    </>
  )
}

export default Dine
