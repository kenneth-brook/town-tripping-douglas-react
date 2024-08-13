import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useDataContext } from './DataContext';

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
  const { stage } = useDataContext();
  const [itineraries, setItineraries] = useState([]); 
  const [selectedItinerary, setSelectedItinerary] = useState(null);

  const fetchItineraries = useCallback(async (userId) => {
    try {
      const response = await axios.get(`https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/itinerary/user/${userId}`);
      setItineraries(response.data);
    } catch (error) {
      console.error('Error fetching itineraries:', error);
    }
  }, []);

  const saveItinerary = useCallback(async (userId, itineraryName, itineraryData) => {
    try {
        const response = await axios.post(`https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/itinerary/save`, {
            userId,
            itineraryName,
            itineraryData
        });
        const newItinerary = response.data;  // Ensure this contains the correct data

        if (newItinerary && newItinerary.id) {
            // Update context with the new itinerary
            setItineraries(prevItineraries => [...prevItineraries, newItinerary]);
            return newItinerary;
        } else {
            console.error('The server response did not include an ID.');
            return null;
        }
    } catch (error) {
        console.error('Error saving itinerary:', error);
        return null;
    }
}, [itineraries, stage]);



const updateItinerary = useCallback(async (itineraryId, itineraryData, itineraryName = null) => {
  try {
      const response = await axios.put(
          `https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/itinerary/update/${itineraryId}`,
          {
              itineraryData,
              itineraryName,
          }
      );

      const updatedItinerary = response.data; // Ensure response contains the updated itinerary

      if (updatedItinerary && updatedItinerary.id) {
          // Update state with the new itinerary
          setItineraries(itineraries.map(it => it.id === itineraryId ? updatedItinerary : it));
          setSelectedItinerary(updatedItinerary);
          return updatedItinerary; // Return the updated itinerary
      } else {
          throw new Error('Failed to get a valid updated itinerary');
      }
  } catch (error) {
      console.error('Error updating itinerary:', error);
      throw error; // Ensure error is thrown to be caught by the calling function
  }
}, [itineraries]);


  const addToItinerary = useCallback(async (location) => {
    if (selectedItinerary) {
      const updatedData = [...selectedItinerary.itinerary_data, location];
      const response = await updateItinerary(selectedItinerary.id, updatedData, selectedItinerary.itinerary_name);
      setSelectedItinerary(response);
    }
  }, [selectedItinerary, updateItinerary]);

  const removeFromItinerary = useCallback(async (itineraryId) => {
    try {
      await axios.delete(`https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/itinerary/delete/${itineraryId}`);
      setItineraries(itineraries.filter(it => it.id !== itineraryId));
      setSelectedItinerary(null); // Reset the selected itinerary after deletion
    } catch (error) {
      console.error('Error deleting itinerary:', error);
    }
  }, [itineraries]);

  return (
    <ItineraryContext.Provider value={{ itineraries, selectedItinerary, setSelectedItinerary, addToItinerary, removeFromItinerary, saveItinerary, updateItinerary, fetchItineraries }}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItineraryContext = () => useContext(ItineraryContext);
