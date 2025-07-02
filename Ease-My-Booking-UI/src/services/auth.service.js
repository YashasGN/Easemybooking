import axios from 'axios';

const AUTH_URL = 'https://localhost:7266/gateway/Account/login';
const REGISTER_URL = 'https://localhost:7266/gateway/Account/register';
const Update_Role_URL = 'https://localhost:7266/gateway/Account/updateRole';
// Login API
export const loginApi = async ({ username, password }) => {
  try {
    const response = await axios.post(AUTH_URL, { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Register API
export const registerUser = async ({
  UserName,
  Email,
  Password,
  DateOfBirth,
  City,
  Region,
}) => {
  try {
    const response = await axios.post(
      REGISTER_URL,
      {
        UserName,
        Email,
        Password,
        DateOfBirth,
        City,
        Region,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Role API
export const updateRole = async ({ userEmail, role }) => {
  try {
    const response = await axios.post(
      `${Update_Role_URL}?email=${encodeURIComponent(userEmail)}&role=${encodeURIComponent(role)}`,
      null, // No body needed
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};