import axios from 'axios';

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const GOOGLE_API_KEY = 'AIzaSyAGefyRhxQki08cpUEvDe4dTBh0N8YGArc';

const getPlaceId = async (lat, lng, name) => {
  try {
    const encodedName = encodeURIComponent(name);
    const url = `${CORS_PROXY}https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&type=restaurant&keyword=${encodedName}&key=${GOOGLE_API_KEY}`;
    console.log(`Requesting Place ID for ${name} at ${lat}, ${lng}`);
    const response = await axios.get(url);
    console.log('Place ID response:', response.data);

    if (response.data.status !== 'OK') {
      console.error('Error in Place ID response:', response.data.status);
      return null;
    }

    const place = response.data.results.find(place => place.name.toLowerCase().includes(name.toLowerCase()));
    console.log('Matching place:', place);

    return place ? place.place_id : null;
  } catch (error) {
    console.error('Error fetching place ID:', error);
    return null;
  }
};

const getPlaceDetails = async (placeId) => {
  try {
    const url = `${CORS_PROXY}https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}`;
    console.log(`Requesting Place Details for Place ID: ${placeId}`);
    const response = await axios.get(url);
    console.log('Place details response:', response.data);

    if (response.data.status !== 'OK') {
      console.error('Error in Place details response:', response.data.status);
      return null;
    }

    const { rating } = response.data.result;
    return { rating };
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

export const getGoogleReviews = async (lat, lng, name) => {
  console.log(`Fetching Place ID for ${name} at (${lat}, ${lng})`);
  const placeId = await getPlaceId(lat, lng, name);
  if (placeId) {
    const details = await getPlaceDetails(placeId);
    console.log('Place details:', details);
    return details;
  } else {
    console.error(`No Place ID found for ${name} at (${lat}, ${lng})`);
  }
  return null;
};
