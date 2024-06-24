import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactComponent as PlayIcon } from '../assets/icos/ticket-icon.svg';
//import '../sass/componentsass/Play.scss';
import { useHeightContext } from '../hooks/HeightContext';

const Play = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/data/play');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('API response:', result); // Log the response data
        setData(result);
      } catch (error) {
        setError(`Failed to fetch data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <main className="internal-content" style={{ paddingTop: `calc(${headerHeight}px + 30px)`, paddingBottom: `calc(${footerHeight}px + 50px)` }}>
        <div className="page-title">
          <PlayIcon className="play-icon" />
          <h1>{pageTitle}</h1>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="content">
          {data.map((item) => (
            <div key={item.id} className="content-item">
              <h2>{item.name}</h2>
              <div className="descriptBox">
                <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
              </div>
              <div className="reviews-container">
                <div className="reviews-section">
                  <div className="stars">
                    {/* You can replace this with actual star rating components */}
                    ★★★★☆
                  </div>
                  <p className="reviews-text">{item.googleReviews} Google reviews</p>
                </div>
                <button className="more-button">more</button>
              </div>
            </div>
          ))}
        </div> 
        )}
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </>
  );
};

export default Play;
