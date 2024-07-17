import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactComponent as ItineraryIcon } from '../assets/icos/intinerery.svg';
import { ReactComponent as Share } from '../assets/icos/share-icon.svg';
import { useHeightContext } from '../hooks/HeightContext';
import { useOrientation } from '../hooks/OrientationContext';
import { useItineraryContext } from '../hooks/ItineraryContext';
import '../sass/componentsass/Itinerary.scss';

const Itinerary = ({ pageTitle }) => {
  const { headerRef, footerRef, headerHeight, footerHeight, updateHeights } = useHeightContext();
  const orientation = useOrientation();
  const { itinerary } = useItineraryContext();

  useEffect(() => {
    updateHeights();
  }, [headerRef, footerRef, updateHeights]);

  const pageTitleContent = (
    <div className="page-title">
      <div className="itinerery-title">
        <ItineraryIcon />
        <h1>{pageTitle}</h1>
      </div>
      <div className="right-button">
        <button>
          <Share />
          <span>Share Itinerary</span>
        </button>
      </div>
    </div>
  );

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {Array.from({ length: fullStars }, (_, i) => (
          <span key={i} className="star full">★</span>
        ))}
        {halfStar === 1 && <span className="star half">☆</span>}
        {Array.from({ length: emptyStars }, (_, i) => (
          <span key={i} className="star empty">☆</span>
        ))}
      </>
    );
  };

  const renderItineraryContent = () => (
    <div className="two-column-layout">
      {itinerary.map((item) => (
        <div key={item.id} className="content-item">
          <h2>{item.name}</h2>
          <div className="content-box">
            
          </div>
        </div>
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
        <div className="content">
          {renderItineraryContent()}
        </div>
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </div>
  );
};

export default Itinerary;
