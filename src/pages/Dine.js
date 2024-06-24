import React, { useContext, useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactComponent as DineIcon } from '../assets/icos/dine.svg';
//import '../sass/componentsass/Dine.scss';
import { useHeightContext } from '../hooks/HeightContext';

const Eat = ({ pageTitle }) => {
  const { headerHeight, footerHeight, footerRef } = useHeightContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/data/eat');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('API response:', result);
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
          <DineIcon className="dine-icon" />
          <h1>{pageTitle}</h1>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <div className="content">
            {data.map((item) => (
              <div key={item.id} className="content-item">
                <h2>{item.name}</h2>
                <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
                <p>Location: {item.city}, {item.state}</p>
                <p>Phone: {item.phone}</p>
                <p>Website: <a href={item.web} target="_blank" rel="noopener noreferrer">{item.web}</a></p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </>
  );
};

export default Eat;
