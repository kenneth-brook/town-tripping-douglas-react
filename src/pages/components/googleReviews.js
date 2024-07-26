import axios from 'axios';
import { useDataContext } from '../../hooks/DataContext';

export const getGoogleReviews = async (lat, lng, name) => {
  const { stage } = useDataContext();
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
