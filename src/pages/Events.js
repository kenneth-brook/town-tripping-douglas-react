import React, { useState, useMemo } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as EventsIcon } from '../assets/icos/events.svg'
import { ReactComponent as MapsIcon } from '../assets/icos/maps.svg'
import { useHeightContext } from '../hooks/HeightContext'
import { useOrientation } from '../hooks/OrientationContext'
import { useDataContext } from '../hooks/DataContext'
import { useViewMode } from '../hooks/ViewModeContext'
import MapView from './components/MapView'
import { useNavigate } from 'react-router-dom'
import DetailViewCard from './components/DetailViewCard' // Don't forget to import DetailViewCard

const Events = ({ pageTitle }) => {
  const { headerRef, footerRef, headerHeight, footerHeight } = useHeightContext();
  const { data, loading, error } = useDataContext()
  const { isMapView } = useViewMode()
  const navigate = useNavigate()
  const orientation = useOrientation()

  const [sortOrder, setSortOrder] = useState('asc')

  const sortedEventsData = useMemo(() => {
    return data.events.slice().sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
  }, [data.events, sortOrder])

  const pageTitleContent = (
    <div className="page-title">
      <EventsIcon />
      <h1>
        {pageTitle} {isMapView && 'Map'}
      </h1>
      {isMapView && <MapsIcon className="icon-svg" />}
    </div>
  )

  return (
    <div
      className={`app-container ${
        orientation === 'landscape-primary' ||
        orientation === 'landscape-secondary'
          ? 'landscape'
          : orientation === 'desktop'
          ? 'desktop internal-desktop'
          : 'portrait'
      }`}
    >
      <Header ref={headerRef} />
      <main
        className="internal-content"
        style={{
          paddingTop: `calc(${headerHeight}px + 30px)`,
          paddingBottom: `calc(${footerHeight}px + 50px)`,
        }}
      >
        <div className="page-title">{pageTitleContent}</div>
        {loading && <div className="loader"></div>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="content">
            {isMapView ? (
              <MapView data={sortedEventsData} type="events" />
            ) : orientation === 'desktop' ? (
              <div className="two-column-layout-desk">
                {sortedEventsData.map((item) => (
                  <DetailViewCard
                    key={item.id}
                    item={item}
                    category="events"
                    navigate={navigate}
                  />
                ))}
              </div>
            ) : (
              sortedEventsData.map((item) => (
                <div key={item.id} className="content-item">
                  <h2>{item.name}</h2>
                  <div className="content-box">
                    {item.images && item.images.length > 0 && (
                      <img
                        src={`https://douglas.365easyflow.com/easyflow-images/${item.images[0]}`}
                        alt={item.name}
                        className="content-image"
                      />
                    )}
                    <div className="text-box">
                      <p
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      ></p>
                      <div className="reviews-container">
                        {item.rating && (
                          <div className="reviews-block">
                            <p className="reviews-text">
                              {item.rating.toFixed(1)} Google reviews
                            </p>
                          </div>
                        )}
                        <button
                          className="more-button"
                          onClick={() => navigate(`/shop/${item.id}`)}
                        >
                          more
                        </button>
                      </div>
                    </div>
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
