// src/api/categoryApi.js
import axios from 'axios';

const BASE_URL = 'https://localhost:7266/gateway/categories';
export const getCategoryById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};
