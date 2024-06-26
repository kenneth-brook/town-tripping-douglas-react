import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as EventsIcon } from '../assets/icos/events.svg'
import { useHeightContext } from '../hooks/HeightContext';

const Events = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext();
  return (
    <>
      <Header />
      <main className="internal-content" style={{ paddingTop: `calc(${headerHeight}px + 30px)`, paddingBottom: `calc(${footerHeight}px + 50px)` }}>
        <div className="page-title">
          <EventsIcon />
          <h1>{pageTitle}</h1>
        </div>
        <h2>You can add more content here as needed </h2>
      </main>
      <Footer showCircles={true} />
    </>
  )
}

export default Events
