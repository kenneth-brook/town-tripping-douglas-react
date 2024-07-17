import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
  const [itineraries, setItineraries] = useState([]);

  const addToItinerary = (location) => {
    setItineraries((prevItineraries) => {
      const updatedItineraries = [...prevItineraries, location];
      console.log('Updated Itinerary:', updatedItineraries);
      return updatedItineraries;
    });
  };

  const removeFromItinerary = (id) => {
    setItineraries((prevItineraries) => {
      const updatedItineraries = prevItineraries.filter(item => item.id !== id);
      console.log('Updated Itineraries:', updatedItineraries);
      return updatedItineraries;
    });
  };

  const saveItinerary = async (userId, itineraryName, itineraryData) => {
    console.log('Saving Itinerary:', { userId, itineraryName, itineraryData }); // Add this line
    try {
      const response = await axios.post('https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/aws-test/itinerary/save', {
        userId,
        itineraryName,
        itineraryData
      });
      console.log('Itinerary saved:', response.data);
    } catch (error) {
      console.error('Error saving itinerary:', error);
    }
  };

  const fetchItineraries = async (userId) => {
    try {
      const response = await axios.get(`https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/aws-test/itinerary/user/${userId}`);
      setItineraries(response.data);
      console.log('Fetched Itineraries:', response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  };

  return (
    <ItineraryContext.Provider value={{ itineraries, addToItinerary, removeFromItinerary, saveItinerary, fetchItineraries }}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItineraryContext = () => useContext(ItineraryContext);
