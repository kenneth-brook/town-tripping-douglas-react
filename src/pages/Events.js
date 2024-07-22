// Events.js
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactComponent as EventsIcon } from '../assets/icos/events.svg';
import { ReactComponent as MapsIcon } from '../assets/icos/maps.svg';
import { useHeightContext } from '../hooks/HeightContext';
import { useOrientation } from '../hooks/OrientationContext';
import { useDataContext } from '../hooks/DataContext';
import { useViewMode } from '../hooks/ViewModeContext';
import MapView from './components/MapView';
import { useNavigate } from 'react-router-dom';
import DetailViewCard from './components/DetailViewCard';

const Events = ({ pageTitle }) => {
  const { headerRef, footerRef, headerHeight, footerHeight, updateHeights } = useHeightContext();
  const { data, loading, error } = useDataContext();
  const { isMapView, setIsMapView } = useViewMode();
  const navigate = useNavigate();
  const orientation = useOrientation();

  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    updateHeights();
  }, [headerRef, footerRef, updateHeights]);

  const sortedEventsData = useMemo(() => {
    return data.events.slice().sort((a, b) => {
      const dateA = new Date(a.start_date);
      const dateB = new Date(b.start_date);
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }, [data.events, sortOrder]);

  const pageTitleContent = (
    <div className="page-title">
      <EventsIcon />
      <h1>
        {pageTitle} {isMapView && 'Map'}
      </h1>
      {isMapView && <MapsIcon className="icon-svg" />}
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Months are zero-indexed
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };
  
  const renderEventsContent = () => (
    <div className="two-column-layout">
      {sortedEventsData.map((item) => (
        <div key={item.id} className="content-item">
          <h2>{item.name}</h2>
          <h3>{formatDate(item.start_date)}</h3>
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
                    <p className="reviews-text">
                      {item.rating.toFixed(1)} Google reviews
                    </p>
                  </div>
                )}
                <button
                  className="more-button"
                  onClick={() => navigate(`/events/${item.id}`)}
                >
                  more
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEventsDesktopContent = () => (
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
  );

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
        {pageTitleContent}
        {loading && <div className="loader"></div>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="content">
            {isMapView ? (
              <MapView data={sortedEventsData} type="events" />
            ) : orientation === 'desktop' ? (
              renderEventsDesktopContent()
            ) : (
              renderEventsContent()
            )}
          </div>
        )}
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </div>
  );
};

export default Events;
