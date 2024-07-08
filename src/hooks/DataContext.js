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
  const [filteredData, setFilteredData] = useState(data);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');

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

        const removeQuotesFromName = (name) => name.replace(/['"]/g, '');

        const results = await Promise.all(
          Object.keys(endpoints).map(async (key) => {
            try {
              const result = await fetchEndpointData(endpoints[key]);
              if (key !== 'events') {
                const updatedData = await Promise.all(
                  result.map(async (item) => {
                    try {
                      const details = await getGoogleReviews(item.lat, item.long, item.name);
                      return { 
                        ...item, 
                        ...details, 
                        type: key, 
                        name: removeQuotesFromName(item.name) // Remove quotes from name here
                      };
                    } catch (error) {
                      console.error(`Failed to fetch Google reviews for ${item.name}`, error);
                      return { 
                        ...item, 
                        type: key, 
                        name: removeQuotesFromName(item.name) // Remove quotes from name here
                      };
                    }
                  })
                );
                return { key, data: updatedData };
              } else {
                // Add type attribute for events data and remove quotes from name
                const updatedEventsData = result.map(item => ({
                  ...item,
                  type: 'events',
                  name: removeQuotesFromName(item.name) // Remove quotes from name here
                }));
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
        setFilteredData(dataMap);
      } catch (error) {
        setError(`Failed to fetch data: ${error.message}`);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (keyword) {
      const filterData = (data) => {
        return data.filter(item => 
          Object.values(item).some(value => 
            typeof value === 'string' && value.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      };

      setFilteredData({
        eat: filterData(data.eat),
        stay: filterData(data.stay),
        play: filterData(data.play),
        shop: filterData(data.shop),
        events: filterData(data.events),
        combined: filterData(data.combined),
      });
    } else {
      setFilteredData(data);
    }
  }, [keyword, data]);

  return (
    <DataContext.Provider value={{ data: filteredData, loading, error, setKeyword }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
