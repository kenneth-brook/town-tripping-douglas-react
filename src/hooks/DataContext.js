// src/hooks/DataContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getGoogleReviews } from '../pages/components/googleReviews'; // Adjust the path as necessary

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    eat: [],
    stay: [],
    play: [],
    shop: [],
    events: [],
    combined: [], // Add a combined key
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = {
          eat: 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/data/eat',
          stay: 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/data/stay',
          play: 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/data/play',
          shop: 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/data/shop',
          events: 'https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/get-events'
        };

        const fetchEndpointData = async (endpoint) => {
          const response = await fetch(endpoint);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        };

        const results = await Promise.all(
          Object.keys(endpoints).map(async (key) => {
            try {
              const result = await fetchEndpointData(endpoints[key]);
              if (key !== 'events') {
                const updatedData = await Promise.all(
                  result.map(async (item) => {
                    try {
                      const details = await getGoogleReviews(item.lat, item.long, item.name);
                      return { ...item, ...details, type: key }; // Add type attribute here
                    } catch (error) {
                      console.error(`Failed to fetch Google reviews for ${item.name}`, error);
                      return { ...item, type: key }; // Add type attribute here
                    }
                  })
                );
                return { key, data: updatedData };
              } else {
                // Add type attribute for events data
                const updatedEventsData = result.map(item => ({ ...item, type: 'events' }));
                return { key, data: updatedEventsData };
              }
            } catch (error) {
              console.error(`Failed to fetch data from ${endpoints[key]}`, error);
              throw error;
            }
          })
        );

        const dataMap = results.reduce((acc, { key, data }) => {
          acc[key] = data;
          return acc;
        }, {});

        // Combine the data for eat, stay, play, and shop and sort alphabetically by name
        dataMap.combined = [
          ...dataMap.eat,
          ...dataMap.stay,
          ...dataMap.play,
          ...dataMap.shop,
        ].sort((a, b) => a.name.localeCompare(b.name));

        setData(dataMap);
      } catch (error) {
        setError(`Failed to fetch data: ${error.message}`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
