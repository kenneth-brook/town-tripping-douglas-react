import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
    combined: [],
  });
  const [filteredData, setFilteredData] = useState(data);
  const [typeCounts, setTypeCounts] = useState({
    menu_types: {},
    play_types: {},
    stay_types: {},
    shop_types: {},
  });
  const [typeNames, setTypeNames] = useState({
    menu_types: {},
    play_types: {},
    stay_types: {},
    shop_types: {},
  });
  const [selectedTypes, setSelectedTypes] = useState({
    menu_types: [],
    play_types: [],
    stay_types: [],
    shop_types: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearMe, setNearMe] = useState(false);

  // The stage value for the current environment
  const stage = "live"; // or "aws-test", "Prod", etc.

  const fetchUserLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const userLocation = {
              lat: parseFloat(position.coords.latitude),
              lon: parseFloat(position.coords.longitude),
            };
            console.log('User Location:', userLocation); // Debugging log
            if (isValidCoordinate(userLocation.lat, userLocation.lon)) {
              resolve(userLocation);
            } else {
              reject(new Error("Invalid user coordinates"));
            }
          },
          error => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  }, []);

  const fetchData = useCallback(async () => {
    console.log('Fetching data...');
    try {
      const endpoints = {
        eat: `https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/data/eat`,
        stay: `https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/data/stay`,
        play: `https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/data/play`,
        shop: `https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/data/shop`,
        events: `https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/get-events`
      };
  
      const fetchEndpointData = async (endpoint) => {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      };
  
      const removeQuotesFromName = (name) => name.replace(/['"]/g, '');
  
      const [results] = await Promise.all([
        Promise.all(
          Object.keys(endpoints).map(async (key) => {
            try {
              const result = await fetchEndpointData(endpoints[key]);
              if (key !== 'events') {
                const updatedData = await Promise.all(
                  result.map(async (item) => {
                    try {
                      const details = await getGoogleReviews(stage, item.lat, item.long, item.name);
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
                const updatedEventsData = result.map(item => ({
                  ...item,
                  type: 'events',
                  name: removeQuotesFromName(item.name), // Remove quotes from name here
                  start_date: new Date(item.start_date) // Convert start_date to Date object
                }));
                return { key, data: updatedEventsData };
              }
            } catch (error) {
              console.error(`Failed to fetch data from ${endpoints[key]}`, error);
              throw error;
            }
          })
        ),
      ]);
  
      const dataMap = results.reduce((acc, { key, data }) => {
        if (key === 'events') {
          const today = new Date();
          acc[key] = data
            .filter(event => {
              const startDate = event.start_date;
              return startDate >= today; // Filter out past events
            })
            .sort((a, b) => a.start_date - b.start_date); // Sort events by start_date
        } else {
          acc[key] = data.sort((a, b) => a.name.localeCompare(b.name));
        }
        return acc;
      }, {});
  
      dataMap.combined = [
        ...dataMap.eat,
        ...dataMap.stay,
        ...dataMap.play,
        ...dataMap.shop,
      ].sort((a, b) => a.name.localeCompare(b.name));
  
      const collectTypes = (data, typeKey) => {
        const typeCounts = {};
        data.forEach(item => {
          if (item[typeKey]) {
            item[typeKey].forEach(type => {
              if (typeCounts[type]) {
                typeCounts[type]++;
              } else {
                typeCounts[type] = 1;
              }
            });
          }
        });
        return typeCounts;
      };
  
      const newTypeCounts = {
        menu_types: collectTypes(dataMap.eat, 'menu_types'),
        play_types: collectTypes(dataMap.play, 'play_types'),
        stay_types: collectTypes(dataMap.stay, 'stay_types'),
        shop_types: collectTypes(dataMap.shop, 'shop_types'),
      };
  
      console.log('Data fetched and type counts set:', newTypeCounts);
  
      setData(dataMap);
      setFilteredData(dataMap);
      setTypeCounts(newTypeCounts);
      console.log('Filtered Data Set:', dataMap);
  
      const response = await fetch(`https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/type-names/fetch-type-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ typeCounts: newTypeCounts }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const typeNamesData = await response.json();
      setTypeNames(typeNamesData);
      console.log('Type names fetched:', typeNamesData);
  
    } catch (error) {
      setError(`Failed to fetch data: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [stage]);

  // The rest of your DataProvider code remains unchanged

  return (
    <DataContext.Provider value={{ 
      data: filteredData, 
      loading, 
      error, 
      setKeyword, 
      resetKeyword, 
      sortData, 
      resetSortOrder, 
      isAscending, 
      setIsAscending, 
      setSelectedDate,
      handleNearMe, 
      userLocation, 
      nearMe, 
      setNearMe, 
      resetFilteredData, 
      typeCounts, 
      typeNames, 
      selectedTypes,
      setSelectedTypes,
      stage
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
