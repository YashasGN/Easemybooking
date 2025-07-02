import axios from 'axios';

const BASE_URL = 'https://localhost:7266/gateway';

export const getPlacesByCategory = async (category) => {
  try {
    const response = await axios.get(`${BASE_URL}/Places/getbycategory/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching places by category:', error);
    return [];
  }
};

export const getPlacesByCityAndCategory = async (city, category) => {
  try {
    const response = await axios.get(`${BASE_URL}/Places/getbycityandcategory/${city}/${category}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching places by city and category:', error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Category`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export const getAllPlaces = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/Places/getall`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all places:', error);
    return [];
  }
}

export const updatePlace = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/Places/update/${id}`, updatedData);
    return response.data; // Expected to be a success message like "Place updated successfully"
  } catch (error) {
    console.error('Error updating place:', error);
    // You could return an error string or throw to handle it in the component
    return `Update failed: ${error?.response?.data || error.message}`;
  }
};

export const createPlace = async (newPlace) => {
  try {
    const response = await axios.post(`${BASE_URL}/Places/add`, newPlace);
    return response.data.placeId; // Only return the ID
  } catch (error) {
    console.error('Error creating place:', error);
    return null; // Or throw error if you want to handle in the calling code
  }
};

export const deletePlace = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/Places/delete/${id}`);
    return response.data; // Expected to be a success message like "Place deleted successfully"
  } catch (error) {
    console.error('Error deleting place:', error);
    return `Delete failed: ${error?.response?.data || error.message}`;
  }
}