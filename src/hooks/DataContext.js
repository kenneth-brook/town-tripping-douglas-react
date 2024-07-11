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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAscending, setIsAscending] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [nearMe, setNearMe] = useState(false);

  const isValidCoordinate = (lat, lon) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);
    const valid = typeof latNum === 'number' && typeof lonNum === 'number' &&
                  !isNaN(latNum) && !isNaN(lonNum) &&
                  latNum >= -90 && latNum <= 90 &&
                  lonNum >= -180 && lonNum <= 180;
    if (!valid) {
      console.error(`Invalid coordinates: (${latNum}, ${lonNum})`);
    }
    return valid;
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortByProximity = (data, userLocation) => {
    return data
      .filter(item => {
        const valid = isValidCoordinate(item.lat, item.long);
        if (!valid) {
          console.error(`Invalid item coordinates for ${item.name}: (${item.lat}, ${item.long})`);
        }
        return valid;
      })
      .map(item => ({
        ...item,
        distance: calculateDistance(userLocation.lat, userLocation.lon, parseFloat(item.lat), parseFloat(item.long))
      }))
      .sort((a, b) => a.distance - b.distance);
  };

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

      const [results, userLocation] = await Promise.all([
        Promise.all(
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
                        name: removeQuotesFromName(item.name)
                      };
                    } catch (error) {
                      console.error(`Failed to fetch Google reviews for ${item.name}`, error);
                      return { 
                        ...item, 
                        type: key, 
                        name: removeQuotesFromName(item.name)
                      };
                    }
                  })
                );
                return { key, data: updatedData };
              } else {
                const updatedEventsData = result.map(item => ({
                  ...item,
                  type: 'events',
                  name: removeQuotesFromName(item.name)
                }));
                return { key, data: updatedEventsData };
              }
            } catch (error) {
              console.error(`Failed to fetch data from ${endpoints[key]}`, error);
              throw error;
            }
          })
        ),
        fetchUserLocation()
      ]);

      const dataMap = results.reduce((acc, { key, data }) => {
        if (key === 'events') {
          const today = new Date();
          acc[key] = data
            .filter(event => {
              const startDate = new Date(event.start_date);
              return startDate >= today;
            })
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
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
      setUserLocation(userLocation);
      console.log('Data fetched and set:', dataMap, 'User Location:', userLocation);

    } catch (error) {
      setError(`Failed to fetch data: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [fetchUserLocation]);

  const fetchTypeNames = useCallback(async (typeCounts) => {
    console.log('Request body for type names:', JSON.stringify({ typeCounts })); // Log the request body

    try {
      const response = await fetch('https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/Prod/type-names/fetch-type-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ typeCounts }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const typeNamesData = await response.json();
      setTypeNames(typeNamesData);
      console.log('Type names fetched:', typeNamesData);

    } catch (error) {
      setError(`Failed to fetch type names: ${error.message}`);
      console.error(error);
    }
  }, []);

  const handleNearMe = () => {
    if (userLocation && isValidCoordinate(userLocation.lat, userLocation.lon)) {
      setNearMe(true); // Set nearMe to true
      const sortedData = {
        ...data,
        eat: sortByProximity(data.eat, userLocation),
        stay: sortByProximity(data.stay, userLocation),
        play: sortByProximity(data.play, userLocation),
        shop: sortByProximity(data.shop, userLocation),
        combined: sortByProximity(data.combined, userLocation),
      };
      setFilteredData(sortedData);
      console.log('Filtered Data Set after Near Me:', sortedData); // Log the filtered data set after Near Me
    } else {
      console.error("Invalid or missing user coordinates:", userLocation);
    }
  };

  const resetFilteredData = () => {
    setFilteredData(data);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (Object.keys(typeCounts).some(key => Object.keys(typeCounts[key]).length > 0)) {
      fetchTypeNames(typeCounts);
    }
  }, [typeCounts, fetchTypeNames]);

  useEffect(() => {
    if (keyword) {
      console.log(`Filtering data with keyword: ${keyword}`);
      const filterData = (data) => {
        return data.filter(item => 
          Object.values(item).some(value => 
            typeof value === 'string' && value.toLowerCase().includes(keyword.toLowerCase())
          )
        );
      };

      const filtered = {
        eat: filterData(data.eat),
        stay: filterData(data.stay),
        play: filterData(data.play),
        shop: filterData(data.shop),
        events: filterData(data.events),
        combined: filterData(data.combined),
      };
      setFilteredData(filtered);
      console.log('Filtered Data Set with keyword:', filtered); // Log the filtered data set with keyword
    } else {
      setFilteredData(data);
      console.log('Filtered Data Set reset to original:', data); // Log the reset to original filtered data set
    }
  }, [keyword, data]);

  useEffect(() => {
    if (selectedDate) {
      const filterEventsByDate = (events, date) => {
        return events.filter(event => {
          if (!event.start_date) return false; // Remove events without a start date
          const startDate = new Date(event.start_date);
          const endDate = event.end_date ? new Date(event.end_date) : null;
          return (
            (endDate ? startDate <= date && endDate >= date : startDate.toDateString() === date.toDateString())
          );
        }).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      };

      const filtered = {
        ...data,
        events: filterEventsByDate(data.events, selectedDate),
      };
      setFilteredData(filtered);
      console.log('Filtered Data Set with selected date:', filtered); // Log the filtered data set with selected date
    } else {
      setFilteredData(data);
      console.log('Filtered Data Set reset to original:', data); // Log the reset to original filtered data set
    }
  }, [selectedDate, data]);

  const resetKeyword = () => {
    console.log('Keyword reset');
    setKeyword('');
  };

  const sortData = useCallback((ascending) => {
    const sortOrder = ascending ? 1 : -1;
    const sortedData = {
      eat: [...data.eat].sort((a, b) => a.name.localeCompare(b.name) * sortOrder),
      stay: [...data.stay].sort((a, b) => a.name.localeCompare(b.name) * sortOrder),
      play: [...data.play].sort((a, b) => a.name.localeCompare(b.name) * sortOrder),
      shop: [...data.shop].sort((a, b) => a.name.localeCompare(b.name) * sortOrder),
      events: [...data.events].sort((a, b) => a.name.localeCompare(b.name) * sortOrder),
      combined: [...data.combined].sort((a, b) => a.name.localeCompare(b.name) * sortOrder),
    };
    setFilteredData(sortedData);
    console.log('Filtered Data Set after sort:', sortedData); // Log the filtered data set after sort
  }, [data]);

  const resetSortOrder = useCallback(() => {
    setIsAscending(true);
    sortData(true);
  }, [sortData]);

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
      typeNames 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
