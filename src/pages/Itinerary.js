import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactComponent as Intinerery } from '../assets/icos/intinerery.svg';
import { ReactComponent as Share } from '../assets/icos/share-icon.svg';
import { useHeightContext } from '../hooks/HeightContext';
import { useOrientation } from '../hooks/OrientationContext';

const Itinerary = ({ pageTitle }) => {
  const { headerRef, footerRef, headerHeight, footerHeight, updateHeights } = useHeightContext();
  const orientation = useOrientation();

  useEffect(() => {
    updateHeights();
  }, [headerRef, footerRef, updateHeights]);

  const pageTitleContent = (
    <div className="page-title">
      <div className="itinerery-title">
        <Intinerery />
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
        {/* Add your itinerary content here */}
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </div>
  );
}

export default Itinerary;
