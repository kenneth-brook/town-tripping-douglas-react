import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useOrientation } from '../../hooks/OrientationContext'
import { useHeightContext } from '../../hooks/HeightContext'
import { useDataContext } from '../../hooks/DataContext'
import { ReactComponent as Phone } from '../../assets/icos/phone.svg'
import { ReactComponent as MapIcon } from '../../assets/icos/map-icon.svg'
import { ReactComponent as Share } from '../../assets/icos/share-icon.svg'
import { ReactComponent as AddItinerary } from '../../assets/icos/add-itinerary.svg'
import Header from './Header'
import Footer from './Footer'
import styles from '../../sass/componentsass/DetailView.scss'

const DetailView = () => {
  const { category, id } = useParams()
  const { data, loading, error } = useDataContext()
  const { headerHeight, footerHeight, footerRef } = useHeightContext()
  const orientation = useOrientation()
  const [item, setItem] = useState(null)

  useEffect(() => {
    if (data && data[category]) {
      const selectedItem = data[category].find(
        (item) => item.id.toString() === id
      )
      setItem(selectedItem)
    }
  }, [data, category, id])

  if (loading) return <div className="loader"></div>
  if (error) return <p>{error}</p>
  if (!item) return <p>Not found</p>

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
          paddingTop: `calc(${headerHeight}px + 30px)`,
          paddingBottom: `calc(${footerHeight}px + 50px)`,
        }}
      >
        <div className="view-card">
          <div className="top-image">
            {item.images && item.images.length > 0 && (
              <div className="image-container">
                <img
                  src={`https://douglas.365easyflow.com/easyflow-images/${item.images[0]}`}
                  alt={item.name}
                />
              </div>
            )}
            {orientation === 'landscape-primary' ? (
              <div className="contact-container">
                {item.web && item.web.length > 0 && (
                  <a href={item.web} target="_blank" rel="noopener noreferrer">
                    Website
                  </a>
                )}
                <div className="contact-btn">
                  {item.phone && item.phone.length > 0 && (
                    <button>
                      <Phone /> {item.phone}
                    </button>
                  )}
                  <button>
                    <MapIcon /> Get Direction
                  </button>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>

          <div className="text-container">
            <h2>{item.name}</h2>
            <p>{`${item.street_address}, ${item.city}, ${item.state} ${item.zip}`}</p>
            <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
          </div>
          <div className="contact-container">
            {item.web && item.web.length > 0 && (
              <a href={item.web} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            )}
            <div className="contact-btn">
              {item.phone && item.phone.length > 0 && (
                <button>
                  <Phone /> {item.phone}
                </button>
              )}
              <button>
                <MapIcon /> Get Direction
              </button>
            </div>
          </div>
          {item.rating && (
            <div className="reviews-block">
              <div className="stars">{renderStars(item.rating)}</div>
              <p className="reviews-text">
                {item.rating.toFixed(1)} Google reviews
              </p>
            </div>
          )}
          <div className="bottom-button">
            <button>
              <Share />
              Share
            </button>
            <button>
              <MapIcon />
              Map
            </button>
            <button>
              <AddItinerary />
              Add to Itinerary
            </button>
          </div>
        </div>
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </div>
  )
}

export default DetailView
