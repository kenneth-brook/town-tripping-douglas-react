// src/pages/Events.js
import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as EventsIcon } from '../assets/icos/events.svg'
import { useHeightContext } from '../hooks/HeightContext'
import { useOrientation } from '../hooks/OrientationContext'
import { useDataContext } from '../hooks/DataContext'
import { useNavigate } from 'react-router-dom'

const Events = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext()
  const { data, loading, error } = useDataContext()
  const eventsData = data.events
  const navigate = useNavigate()

  const orientation = useOrientation()

  return (
    <div
      className={`app-container ${
        orientation === 'landscape-primary' ||
        orientation === 'landscape-secondary'
          ? 'landscape'
          : orientation === 'desktop'
          ? 'desktop'
          : 'portrait'
      }`}
    >
      <Header />
      <main
        className="internal-content"
        style={{
          paddingTop: `calc(${headerHeight}px + 30px)`,
          paddingBottom: `calc(${footerHeight}px + 50px)`,
        }}
      >
        <div className="page-title">
          <EventsIcon />
          <h1>{pageTitle}</h1>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="content">
            {eventsData.map((item) => (
              <div key={item.id} className="content-item">
                <h2>{item.name}</h2>
                <div className="descriptBox">
                  <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
                </div>
                <div className="reviews-container">
                  <button
                    className="more-button"
                    onClick={() => navigate(`/events/${item.id}`)}
                  >
                    more
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer showCircles={true} ref={footerRef} />
    </div>
  )
}

export default Events
