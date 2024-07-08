import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as ShopIcon } from '../assets/icos/shop.svg'
import { ReactComponent as MapsIcon } from '../assets/icos/maps.svg'
import { useHeightContext } from '../hooks/HeightContext'
import { useOrientation } from '../hooks/OrientationContext'
import { useDataContext } from '../hooks/DataContext'
import { useViewMode } from '../hooks/ViewModeContext'
import MapView from './components/MapView'
import { useNavigate } from 'react-router-dom'
import DetailViewCard from './components/DetailViewCard'

const Shop = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext()
  const { data, loading, error } = useDataContext()
  const { isMapView } = useViewMode()
  const shopData = data.shop
  const navigate = useNavigate()

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

  const orientation = useOrientation()

  const pageTitleContent = (
    <div className="page-title">
      <ShopIcon className="shop-icon" />
      <h1>
        {pageTitle} {isMapView && 'Map'}
      </h1>
      {isMapView && <MapsIcon className="icon-svg" />}
    </div>
  )

  // Split shopData into two halves
  const halfLength = Math.ceil(shopData.length / 2)
  const firstHalf = shopData.slice(0, halfLength)
  const secondHalf = shopData.slice(halfLength)

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
      {orientation === 'desktop' ? (
        <div className="two-column-layout-desk">
          {shopData.map((item) => (
            <DetailViewCard
              key={item.id}
              item={item}
              category="eat"
              navigate={navigate}
            />
          ))}
        </div>
      ) : (
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
              {!isMapView ? (
                <div className="two-column-layout">
                  <div className="column">
                    {firstHalf.map((item) => (
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
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                            ></p>
                            <div className="reviews-container">
                              {item.rating && (
                                <div className="reviews-block">
                                  <div className="stars">
                                    {renderStars(item.rating)}
                                  </div>
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
                    ))}
                  </div>
                  <div className="column">
                    {secondHalf.map((item) => (
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
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                            ></p>
                            <div className="reviews-container">
                              {item.rating && (
                                <div className="reviews-block">
                                  <div className="stars">
                                    {renderStars(item.rating)}
                                  </div>
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
                    ))}
                  </div>
                </div>
              ) : (
                <MapView data={shopData} type="shop" />
              )}
            </div>
          )}
        </main>
      )}

      <Footer ref={footerRef} showCircles={true} />
    </div>
  )
}

export default Shop
