import React, { createContext, useState, useContext, useEffect } from 'react';

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
  const [itinerary, setItinerary] = useState([]);

  const addToItinerary = (location) => {
    setItinerary((prevItinerary) => {
      const updatedItinerary = [...prevItinerary, location];
      console.log('Updated Itinerary:', updatedItinerary);
      return updatedItinerary;
    });
  };

  const removeFromItinerary = (id) => {
    setItinerary((prevItinerary) => {
      const updatedItinerary = prevItinerary.filter(item => item.id !== id);
      console.log('Updated Itinerary:', updatedItinerary);
      return updatedItinerary;
    });
  };

  return (
    <ItineraryContext.Provider value={{ itinerary, addToItinerary, removeFromItinerary }}>
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItineraryContext = () => {
  return useContext(ItineraryContext);
};
