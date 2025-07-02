import axios from 'axios';

const BASE_URL = 'https://localhost:7266/gateway/Package';

export const getPackagesByPlaceId = async (placeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/getbyplaceid/${placeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
}

export const getPackagesById = async (packageId) => {
  try {
    const response = await axios.get(`${BASE_URL}/getbyId/${packageId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching package by ID:', error);
    throw error;
  }
}

export const getAllPackages = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getall`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all packages:', error);
    throw error;
  }
}

export const createPackage = async (newPackage) => {
  try {
    const response = await axios.post(`${BASE_URL}/add`, newPackage);
    return response.data.packageId; // Only return the ID
  } catch (error) {
    console.error('Error creating package:', error);
    throw error;
  }
}

export const updatePackage = async (packageId, updatedData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/update/${packageId}`,
      updatedData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating package:', error);
    throw error;
  }
};


export const deletePackage = async (packageId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${packageId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting package:', error);
    throw error;
  }
}