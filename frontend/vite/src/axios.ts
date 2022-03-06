import axios from 'axios';
import { authFromStorage, authLogout } from './auth';

import { REST_BASE_URL } from './conf'

const getAuthHeaders = async () => {
  const auth = await authFromStorage();
  if (auth?.token) {
    return {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      ...(auth?.token && {
        'x-felicity-user-id': "felicity-user",
        'x-felicity-role': "felicity-administrator",
        'Authorization': `Bearer ${auth?.token}`
      }),
    } 
  }

  authLogout();
};

const axiosInstance = axios.create({
  baseURL: REST_BASE_URL + "/api/v1/",
  timeout: 1000,
  headers: await getAuthHeaders()
})

export default axiosInstance