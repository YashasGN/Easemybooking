import axios from 'axios';
const BASE_URL = 'https://localhost:7266/gateway';

export const getPriceByPackageId  = async (slotId) => {
    try {
        const response = await axios.get(`${BASE_URL}/Price/getPriceByPackageId/${slotId}`);
        console.log("API response for price:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching package price:', error);
        throw error;
    }
    }

export const getSlotByPackageId = async (packageId) => {
    try {
        const response = await axios.get(`${BASE_URL}/Slots/getSlotByPackageId/${packageId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching slots by package ID:', error);
        throw error;
    }
}

export const createSlots = async (slots) => {
    try {
        const response = await axios.post(`${BASE_URL}/Slots/add`, slots);
        return response.data.slotId;
    } catch (error) {
        console.error('Error creating slots:', error);
        throw error;
    }
}

export const createPrice = async (price) => {   
    try {
        const response = await axios.post(`${BASE_URL}/Price/add`, price);
        return response.data.priceId;
    } catch (error) {
        console.error('Error creating price:', error);
        throw error;
    }
}

export const updateSlot = async (slotId, updatedData) => {  
    try {
        const response = await axios.put(`${BASE_URL}/Slots/update/${slotId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating slot:', error);
        throw error;
    }
}

export const updatePrice = async (slotId, updatedData) => {
    try {
        const response = await axios.put(`${BASE_URL}/Price/update/${slotId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error('Error updating price:', error);
        throw error;
    }
}

export const deletePriceByPackageId = async (packageId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/Price/deleteByPackageId/${packageId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting price by package ID:', error);
        throw error;
    }
}
export const deletePriceByslotId = async (slotId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/Price/deleteBySlotId/${slotId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting price by slot ID:', error);
        throw error;
    }
}

export const deleteSlotByPackageId = async (packageId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/Slots/deleteByPackageId/${packageId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting slots by package ID:', error);
        throw error;
    }
}
export const deleteSlot= async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/Slots/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting slot by slot ID:', error);
        throw error;
    }
}

export const getPriceBySlotId = async (slotId) => {
    try {
        const response = await axios.get(`${BASE_URL}/Price/getPriceBySlotId/${slotId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching price by slot ID:', error);
        throw error;
    }
}