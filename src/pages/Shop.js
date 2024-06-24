import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { ReactComponent as ShopIcon } from '../assets/icos/shop.svg';
//import '../sass/componentsass/Shop.scss'; // Import the SCSS file with the correct path

const Shop = ({ pageTitle }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const footerRef = useRef(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/data/shop');
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

  useEffect(() => {
    if (footerRef.current) {
      setFooterHeight(footerRef.current.offsetHeight);
    }
  }, []);

  return (
    <>
      <Header />
      <main className="internal-content">
        <div className="page-title">
          <ShopIcon />
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
                {/* Add more fields as needed */}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer ref={footerRef} showCircles={true} />
    </>
  );
};

export default Shop;

