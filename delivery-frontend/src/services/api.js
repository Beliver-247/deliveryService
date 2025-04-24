import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const createDelivery = (data) => axios.post(`${API_BASE_URL}/delivery`, data);
export const assignDriver = (deliveryId) => axios.post(`${API_BASE_URL}/delivery/${deliveryId}/assign-driver`);
export const getDeliveries = () => axios.get(`${API_BASE_URL}/delivery`);
export const getDeliveryById = (deliveryId) => axios.get(`${API_BASE_URL}/delivery/${deliveryId}`);
export const getDrivers = () => axios.get(`${API_BASE_URL}/drivers`);
export const updateDriverResponse = (deliveryId, response) =>
  axios.put(`${API_BASE_URL}/delivery/${deliveryId}/driver-response`, { response });

export const deleteDelivery = (deliveryId) => axios.delete(`${API_BASE_URL}/delivery/${deliveryId}`);
export const updateDriver = (driverId, data) =>
  axios.put(`${API_BASE_URL}/drivers/${driverId}`, data);
