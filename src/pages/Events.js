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
import ShareModal from './components/ShareModal'; // Import ShareModal

// Define the formatDate function
function formatDate(dateString) {
  if (!dateString) return ''; // Defensive check for undefined or null dateString
  const date = new Date(dateString);
  if (isNaN(date)) return ''; // Check for invalid date

  // Extract the date components in UTC to avoid timezone issues
  const month = date.getUTCMonth() + 1; // Months are zero-indexed
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  return `${month}/${day}/${year}`;
}

const Events = ({ pageTitle }) => {
  const { headerRef, footerRef, headerHeight, footerHeight, updateHeights } = useHeightContext();
  const { data, loading, error } = useDataContext();
  const { isMapView, setIsMapView } = useViewMode();
  const navigate = useNavigate();
  const orientation = useOrientation();

  const [sortOrder, setSortOrder] = useState('asc');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [shareTitle, setShareTitle] = useState('');

  useEffect(() => {
    updateHeights();
  }, [headerRef, footerRef, updateHeights]);

  const sortedEventsData = useMemo(() => {
    if (!data || !data.events) return []; // Defensive check for undefined data
    return data.events.slice().sort((a, b) => {
      const dateA = new Date(a.start_date);
      const dateB = new Date(b.start_date);
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }, [data, sortOrder]);

  const handleShare = (url, title) => {
    console.log('handleShare called with:', { url, title }); // Log the URL and title
    setShareUrl(url);
    setShareTitle(title);
    setModalIsOpen(true);
  };

  const pageTitleContent = (
    <div className="page-title">
      <EventsIcon />
      <h1>
        {pageTitle} {isMapView && 'Map'}
      </h1>
      {isMapView && <MapsIcon className="icon-svg" />}
    </div>
  );

  const renderEventsContent = () => {
    if (!sortedEventsData || sortedEventsData.length === 0) return null; // Defensive check before rendering
    return (
      <div className="two-column-layout">
        {sortedEventsData.map((item) => (
          <div key={item.id} className="content-item">
            <h2>{item.name}</h2>
            <p>{formatDate(item.start_date)}</p>
            <div className="content-box">
              <div className="box-top">
              {item.images && item.images.length > 0 && (
                <img
                  src={
                    // If the first image is already an absolute URL (starts with "https://"),
                    // use it directly. Otherwise, prepend your image server URL.
                    item.images[0].startsWith('https://')
                      ? item.images[0]
                      : `https://douglas.365easyflow.com/easyflow-images/${item.images[0]}`
                  }
                  alt={item.name}
                  className="content-image"
                />
              )}
                <div className="text-box">
                  <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
                </div>
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
          </div>
        ))}
      </div>
    );
  };

  const renderEventsDesktopContent = () => {
    if (!sortedEventsData || sortedEventsData.length === 0) return null; // Defensive check before rendering
    return (
      <div className="two-column-layout-desk">
        {sortedEventsData.map((item) => (
          <DetailViewCard
            key={item.id}
            item={item}
            category="events"
            navigate={navigate}
            handleShare={orientation === 'desktop' ? handleShare : null} // Pass handleShare function conditionally
          />
        ))}
      </div>
    );
  };

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
        {!loading && !error && sortedEventsData.length > 0 && (
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
      <ShareModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        url={shareUrl}
        title={shareTitle}
      />
    </div>
  );
};

export default Events;
