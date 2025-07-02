import axios from 'axios';

const BASE_URL = 'https://localhost:7266/gateway/Transaction';

export const createTransaction = async (transactionData) => {
  try {
    console.log('Sending transaction payload:', transactionData); // For debugging

    const response = await axios.post(`${BASE_URL}/add`, transactionData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Server error:', error.response.data); // Detailed backend error
    } else if (error.request) {
      console.error('❌ No response from server:', error.request);
    } else {
      console.error('❌ Axios setup error:', error.message);
    }
    throw error; // Let your component catch it
  }
};

export const getTransactionByUserId= async (userId) => {  
  try {
    const response = await axios.get(`${BASE_URL}/getbyuserid/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Server error:', error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server:', error.request);
    } else {
      console.error('❌ Axios setup error:', error.message);
    }
    throw error;
  }
}

export const getAllTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getall`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('❌ Server error:', error.response.data);
    } else if (error.request) {
      console.error('❌ No response from server:', error.request);
    } else {
      console.error('❌ Axios setup error:', error.message);
    }
    throw error;
  }
}