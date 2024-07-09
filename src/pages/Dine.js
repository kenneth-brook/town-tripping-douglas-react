import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as DineIcon } from '../assets/icos/dine.svg'
import { ReactComponent as MapsIcon } from '../assets/icos/maps.svg'
import { useHeightContext } from '../hooks/HeightContext'
import { useOrientation } from '../hooks/OrientationContext'
import { useDataContext } from '../hooks/DataContext'
import { useViewMode } from '../hooks/ViewModeContext'
import MapView from './components/MapView'
import { useNavigate } from 'react-router-dom'
import DetailViewCard from './components/DetailViewCard'

const Dine = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext()
  const { data, loading, error } = useDataContext()
  const { isMapView } = useViewMode()
  const dineData = data.eat
  const navigate = useNavigate()
  const orientation = useOrientation()

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 !== 0 ? 1 : 0
    const emptyStars = 5 - fullStars - halfStar

    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
          <span key={i} className="star full">
            ★
          </span>
        ))}
        {halfStar === 1 && <span className="star half">☆</span>}
        {Array.from({ length: emptyStars }, (_, i) => (
          <span key={i} className="star empty">
            ☆
          </span>
        ))}
      </>
    )
  }

  const pageTitleContent = (
    <div className="page-title">
      <DineIcon className="dine-icon" />
      <h1>
        {pageTitle} {isMapView && 'Map'}
      </h1>
      {isMapView && <MapsIcon className="icon-svg" />}
    </div>
  )

  const renderDineContent = () => (
    <div className="two-column-layout">
      {dineData.map((item) => (
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
              <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
              <div className="reviews-container">
                {item.rating && (
                  <div className="reviews-block">
                    <div className="stars">{renderStars(item.rating)}</div>
                    <p className="reviews-text">
                      {item.rating.toFixed(1)} Google reviews
                    </p>
                  </div>
                )}
                <button
                  className="more-button"
                  onClick={() => navigate(`/dine/${item.id}`)}
                >
                  more
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderDineDesktopContent = () => (
    <div className="two-column-layout-desk">
      {dineData.map((item) => (
        <DetailViewCard
          key={item.id}
          item={item}
          category="eat"
          navigate={navigate}
        />
      ))}
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
      <Header />
      <main
        className="internal-content"
        style={{
          paddingTop: `calc(${headerHeight}px + 30px)`,
          paddingBottom: `calc(${footerHeight}px + 50px)`,
        }}
      >
        {pageTitleContent}
        {loading && <div className="loader"></div>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="content">
            {isMapView ? (
              <MapView data={dineData} type="eat" />
            ) : orientation === 'desktop' ? (
              renderDineDesktopContent()
            ) : (
              renderDineContent()
            )}
          </div>
        )}
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </div>
  )
}

export default Dine
