import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as ShopIcon } from '../assets/icos/shop.svg'

const Shop = ({ pageTitle }) => {
  return (
    <>
      <Header />
      <main className="internal-content">
        <div className="page-title">
          <ShopIcon />
          <h1>{pageTitle}</h1>
        </div>
        {/* You can add more content here as needed */}
      </main>
      <Footer showCircles={true} />
    </>
  )
}

export default Shop
