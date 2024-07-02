import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as EventsIcon } from '../assets/icos/events.svg'
import { ReactComponent as MapsIcon } from '../assets/icos/maps.svg';
import { useHeightContext } from '../hooks/HeightContext'
import { useOrientation } from '../hooks/OrientationContext'
import { useDataContext } from '../hooks/DataContext'
import { useViewMode } from '../hooks/ViewModeContext'
import MapView from './components/MapView' // Import the MapView component
import { useNavigate } from 'react-router-dom'

const Events = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext()
  const { data, loading, error } = useDataContext()
  const { isMapView } = useViewMode()
  const eventsData = data.events
  const navigate = useNavigate()

  const orientation = useOrientation()

  const pageTitleContent = (
    <div className="page-title">
      <EventsIcon />
      <h1>{pageTitle} {isMapView && 'Map'}</h1>
      {isMapView && <MapsIcon className="icon-svg" />}
    </div>
  );

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
      <main
        className="internal-content"
        style={{
          paddingTop: `calc(${headerHeight}px)`,
          paddingBottom: `calc(${footerHeight}px + 50px)`,
        }}
      >
        <div className="page-title">
        {pageTitleContent}
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="content">
            {isMapView ? (
              <MapView data={eventsData} type="events" />
            ) : (
              eventsData.map((item) => (
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
              ))
            )}
          </div>
        )}
      </main>
      <Footer showCircles={true} ref={footerRef} />
    </div>
  )
}

export default Events
