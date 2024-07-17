import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactComponent as Intinerery } from '../assets/icos/intinerery.svg';
import { ReactComponent as Share } from '../assets/icos/share-icon.svg';
import { useHeightContext } from '../hooks/HeightContext';
import { useOrientation } from '../hooks/OrientationContext';
import { useAuth } from '../hooks/AuthContext';
import { useItineraryContext } from '../hooks/ItineraryContext';
import '../sass/componentsass/Itinerary.scss'; // Ensure this import is included

const Itinerary = ({ pageTitle }) => {
  const { headerRef, footerRef, headerHeight, footerHeight, updateHeights } = useHeightContext();
  const orientation = useOrientation();
  const { userId, isAuthenticated } = useAuth();
  const { itineraries, fetchItineraries } = useItineraryContext();

  useEffect(() => {
    updateHeights();
    if (isAuthenticated && userId) {
      fetchItineraries(userId); // Fetch itineraries when the component mounts
    }
  }, [headerRef, footerRef, updateHeights, userId, fetchItineraries, isAuthenticated]);

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
        <div className="itinerary-content">
          {itineraries && itineraries.length > 0 ? (
            itineraries.map((itinerary, index) => (
              <div key={index} className="itinerary-item">
                <h2>{itinerary.itinerary_name}</h2>
                <div className="itinerary-locations">
                  {itinerary.itinerary_data.map((location, locIndex) => (
                    <div key={locIndex} className="location-item">
                      <h3>{location.name}</h3>
                      <p>{location.description}</p>
                      {/* Add more details as needed */}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No itineraries found.</p>
          )}
        </div>
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </div>
  );
}

export default Itinerary;
