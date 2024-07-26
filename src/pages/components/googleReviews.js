import axios from 'axios';

export const getGoogleReviews = async (stage, lat, lng, name) => {
  try {
    const url = `https://8pz5kzj96d.execute-api.us-east-1.amazonaws.com/${stage}/google/getGoogleReviews?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}`;
    console.log(`Fetching Google Reviews for ${name} at (${lat}, ${lng}) From: ${url}`);
    const response = await axios.get(url);
    console.log('Google Reviews response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Google Reviews:', error);
    return null;
  }
};

