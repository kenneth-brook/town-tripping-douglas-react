import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useOrientation } from '../../hooks/OrientationContext';
import { useHeightContext } from '../../hooks/HeightContext';
import { useDataContext } from '../../hooks/DataContext';
import { ReactComponent as Location } from '../../assets/icos/location.svg';
import { ReactComponent as DateIcon } from '../../assets/icos/date.svg';
import { ReactComponent as TimeIcon } from '../../assets/icos/time.svg';
import { ReactComponent as Phone } from '../../assets/icos/phone.svg';
import { ReactComponent as MapIcon } from '../../assets/icos/map-icon.svg';
import { ReactComponent as Share } from '../../assets/icos/share-icon.svg';
import { ReactComponent as AddItinerary } from '../../assets/icos/add-itinerary.svg';
import { ReactComponent as BackArrow } from '../../assets/icos/back-arrow.svg';
import Header from './Header';
import Footer from './Footer';
import styles from '../../sass/componentsass/DetailView.scss';

const DetailView = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading, error } = useDataContext();
  const { headerHeight, footerHeight, footerRef } = useHeightContext();
  const orientation = useOrientation();
  const [item, setItem] = useState(null);
  const category = location.pathname.split('/')[1]; // Infer category from URL

  useEffect(() => {
    if (location.state?.location) {
      setItem(location.state.location);
    } else if (data) {
      const actualCategory = category === 'dine' ? 'eat' : category;
      if (data[actualCategory]) {
        const selectedItem = data[actualCategory].find(
          (item) => item.id.toString() === id
        );
        setItem(selectedItem);
      }
    }
  }, [location.state, data, category, id]);

  if (loading) return <div className="loader"></div>;
  if (error) return <p>{error}</p>;
  if (!item) return <p>Not found</p>;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

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
    );
  };

  const googleMapsLink = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.long}`;

  const formatDate = (dateTime) => {
    if (!dateTime) return { date: 'N/A', time: 'N/A' };
    const [date, time] = dateTime.split('T');
    const [hours, minutes] = time.split(':');
    return { date, time: `${hours}:${minutes}` };
  };

  const handleBack = () => {
    navigate(-1);
  };

  const { date, time } = formatDate(item.start_date);

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
        <div className="view-card">
          <div className="top-image">
            <div className="img-back">
              {item.images && item.images.length > 0 && (
                <div className="image-container">
                  <img
                    src={`https://douglas.365easyflow.com/easyflow-images/${item.images[0]}`}
                    alt={item.name}
                  />
                </div>
              )}
              {orientation === 'landscape-primary' ? (
                <a onClick={handleBack} className="web-button-landscape">
                  <BackArrow />
                  back
                </a>
              ) : (
                ''
              )}
            </div>

            {orientation === 'landscape-primary' ? (
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

                <div className="contact-btn">
                  {item.phone && item.phone.length > 0 && (
                    <a href={`tel:${item.phone}`} className="phone-button">
                      <Phone /> {item.phone}
                    </a>
                  )}
                  <a
                    href={googleMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="map-button"
                  >
                    <MapIcon /> Get Direction
                  </a>
                </div>
              </div>
            ) : (
              ''
            )}
          </div>

          <div className="text-container">
            <h2>{item.name}</h2>
            <p className={category === 'events' ? 'events-text' : ''}>
              {category === 'events' && <Location />}
              {`${item.street_address}, ${item.city}, ${item.state} ${item.zip}`}
            </p>
            {item.start_date && item.start_time && (
              <div className="date-container ">
                <p>
                  <DateIcon />
                  {date}
                </p>
                {time === '00:00' ? (
                  ''
                ) : (
                  <p>
                    <TimeIcon />
                    {time}
                  </p>
                )}
              </div>
            )}
            <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
          </div>

          {orientation === 'landscape-primary' ? (
            ''
          ) : (
            <div className="contact-container">
              <div className="web-back">
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
                <a onClick={handleBack} className="web-button">
                  <BackArrow />
                  Back
                </a>
              </div>

              <div className="contact-btn">
                {item.phone && item.phone.length > 0 && (
                  <a href={`tel:${item.phone}`} className="phone-button">
                    <Phone /> {item.phone}
                  </a>
                )}
                <a
                  href={googleMapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-button"
                >
                  <MapIcon /> Get Direction
                </a>
              </div>
            </div>
          )}

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
  );
};

export default DetailView;
