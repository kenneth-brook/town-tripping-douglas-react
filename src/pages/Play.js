// src/pages/Play.js
import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import { ReactComponent as PlayIcon } from '../assets/icos/play.svg'
import { useHeightContext } from '../hooks/HeightContext'
import { useOrientation } from '../hooks/OrientationContext'
import { useDataContext } from '../hooks/DataContext'

const Play = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext()
  const { data, loading, error } = useDataContext()
  const playData = data.play
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
          <PlayIcon className="play-icon" />
          <h1>{pageTitle}</h1>
        </div>
        {loading && <div className="loader"></div>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="content">
            {playData.map((item) => (
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
                    <div
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    ></div>

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
                        onClick={() => navigate(`/play/${item.id}`)}
                      >
                        more
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer ref={footerRef} showCircles={true} />
    </div>
  )
}

export default Play
