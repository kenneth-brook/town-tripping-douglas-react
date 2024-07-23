import React, { useState, useEffect, useCallback } from 'react';
import { ReactComponent as Location } from '../../assets/icos/location.svg'
import { ReactComponent as DateIcon } from '../../assets/icos/date.svg'
import { ReactComponent as TimeIcon } from '../../assets/icos/time.svg'
import { ReactComponent as Phone } from '../../assets/icos/phone.svg'
import { ReactComponent as MapIcon } from '../../assets/icos/map-icon.svg'
import { ReactComponent as Share } from '../../assets/icos/share-icon.svg'
import { ReactComponent as AddItinerary } from '../../assets/icos/add-itinerary.svg'
import '../../sass/componentsass/DetailViewCard.scss'
import { useViewMode } from '../../hooks/ViewModeContext';

const DetailViewCard = ({ item, category, navigate }) => {
  const { isMapView, setIsMapView } = useViewMode();

  if (!item) {
    return <div>Loading...</div>
  }

  const handleMapView = () => {
    setIsMapView(true);
    navigate(`/${category}/${item.id}`, { state: { location: item } });
  };

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

  const googleMapsLink =
    item.lat && item.long
      ? `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.long}`
      : '#'


      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1; // Months are zero-indexed
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };

  return (
    <div className="content-item">
      <div className="top-container">
        {item.images && item.images.length > 0 && (
          <div className="image-container">
            <img
              src={`https://douglas.365easyflow.com/easyflow-images/${item.images[0]}`}
              alt={item.name}
            />
          </div>
        )}
        <div className="text-container">
          <h2>{item.name}</h2>
          {item.start_date && <h3>{formatDate(item.start_date)}</h3>}
          <div className="content-box">
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
                  onClick={() => navigate(`/${category}/${item.id}`)}
                >
                  more
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="view-card">
        <div className="top-image">
          <div className="contact-container">
            {item.web && item.web.length > 0 && (
              <a
                href={item.web}
                target="_blank"
                rel="noopener noreferrer"
                className="web-button"
              >
                Website
              </a>
            )}

            {item.phone && item.phone.length > 0 && (
              <a href={`tel:${item.phone}`} className="phone-button">
                <Phone /> {item.phone}
              </a>
            )}
            {item.lat && item.long && (
              <a
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="map-button"
              >
                <MapIcon /> Get Direction
              </a>
            )}
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
          <button onClick={handleMapView}>
            <MapIcon />
            Map
          </button>
          <button>
            <AddItinerary />
            Add to Itinerary
          </button>
        </div>
      </div>
    </div>
  )
}

export default DetailViewCard
