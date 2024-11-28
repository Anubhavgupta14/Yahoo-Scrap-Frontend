import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchForexData = async (from, to, period) => {
  try {
    const response = await axios.post(`${API_URL}/api/forex-data`, {
      from,
      to,
      period
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching forex data:', error);
    throw error;
  }
};