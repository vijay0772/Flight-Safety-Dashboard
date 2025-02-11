import axios from "axios";

const API_URL = "https://flaskserver-production-3215.up.railway.app/api";

export const fetchWeatherData = async () => {
  const response = await axios.get(`${API_URL}/weather-data`);
  return response.data;
};

export const fetchFlightData = async () => {
  const response = await axios.get(`${API_URL}/flight-data`);
  return response.data;
};

export const fetchAlerts = async () => {
  const response = await axios.get(`${API_URL}/alerts`);
  return response.data;
};