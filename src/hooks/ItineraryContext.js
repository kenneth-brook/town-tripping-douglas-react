import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
  const [itineraries, setItineraries] = useState([]); 
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const fetchItineraries = useCallback(async (userId) => {
    try {
      const response = await axios.get(`https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/aws-test/itinerary/user/${userId}`);
      setItineraries(response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  }, []);

  const saveItinerary = useCallback(async (userId, itineraryName, itineraryData) => {
    try {
      const response = await axios.post('https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/aws-test/itinerary/save', {
        userId,
        itineraryName,
        itineraryData
      });
      setItineraries([...itineraries, response.data]);
    } catch (error) {
      console.error('Error saving itinerary:', error);
    }
  }, [itineraries]);

  const updateItinerary = useCallback(async (itineraryId, itineraryData, itineraryName = null) => {
    try {
      const response = await axios.put(`https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/aws-test/itinerary/update/${itineraryId}`, {
        itineraryData,
        itineraryName,
      });
      setItineraries(itineraries.map(it => (it.id === itineraryId ? response.data : it)));
      setSelectedItinerary(response.data);
    } catch (error) {
      console.error('Error updating itinerary:', error);
    }
  }, [itineraries]);

  const addToItinerary = useCallback(async (location) => {
    if (selectedItinerary) {
      const updatedData = [...selectedItinerary.itinerary_data, location];
      const response = await updateItinerary(selectedItinerary.id, updatedData, selectedItinerary.itinerary_name);
      setSelectedItinerary(response);
    }
  }, [selectedItinerary, updateItinerary]);

  const removeFromItinerary = useCallback((id) => {
    if (selectedItinerary) {
      const updatedData = selectedItinerary.itinerary_data.filter(item => item.id !== id);
      setSelectedItinerary({ ...selectedItinerary, itinerary_data: updatedData });
    }
  }, [selectedItinerary]);

  return (
    <ItineraryContext.Provider value={{ itineraries, selectedItinerary, setSelectedItinerary, addToItinerary, removeFromItinerary, saveItinerary, updateItinerary, fetchItineraries }}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItineraryContext = () => useContext(ItineraryContext);
