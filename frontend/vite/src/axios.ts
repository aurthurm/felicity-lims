import axios from 'axios';
import { authFromStorage, authLogout } from './auth';

import { REST_BASE_URL } from './conf'

const getAuthHeaders = () => {
  const token = authFromStorage()?.token;
  if (token) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      ...(token && {
        'x-felicity-user-id': "felicity-user",
        'x-felicity-role': "felicity-administrator",
        'Authorization': `Bearer ${token}`
      }),
    } 
  }

  authLogout();
};

const axiosInstance = axios.create({
  baseURL: REST_BASE_URL + "/api/v1/",
  timeout: 1000,
  headers: getAuthHeaders()
})

export default axiosInstance